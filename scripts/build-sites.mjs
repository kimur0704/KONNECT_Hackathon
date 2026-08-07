import { mkdir, readdir, readFile, writeFile, cp } from "fs/promises";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");
const hostingSource = path.join(root, ".openai", "hosting.json");
const hostingTargetDir = path.join(distDir, ".openai");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

async function walk(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "server" || entry.name === ".openai") continue;

    const absolute = path.join(dir, entry.name);
    const relative = path.join(prefix, entry.name).replaceAll("\\", "/");

    if (entry.isDirectory()) {
      files.push(...await walk(absolute, relative));
    } else {
      files.push(relative);
    }
  }

  return files;
}

const files = await walk(distDir);
const assets = {};

for (const file of files) {
  const absolute = path.join(distDir, file);
  const buffer = await readFile(absolute);
  assets[`/${file}`] = {
    body: buffer.toString("base64"),
    encoding: "base64",
    contentType: MIME_TYPES[path.extname(file)] || "application/octet-stream",
  };
}

await mkdir(serverDir, { recursive: true });
await mkdir(hostingTargetDir, { recursive: true });
await cp(hostingSource, path.join(hostingTargetDir, "hosting.json"));

const workerSource = `const ASSETS = ${JSON.stringify(assets)};

const ACTION_CODES = [
  "OPEN_HOME",
  "OPEN_BOARD",
  "OPEN_PROFILE",
  "OPEN_SETTINGS",
  "OPEN_CHAT",
  "OPEN_TRANSLATOR",
];

const LOCAL_BLOCK_RULES = [
  {
    reason: "Self-harm",
    pattern: /(자살|자해|죽고\\s*싶|죽어\\s*버리|극단적\\s*선택|목\\s*매|투신|suicide|self[-\\s]?harm|kill\\s+myself)/i,
  },
  {
    reason: "Extreme profanity",
    pattern: /(시발|씨발|ㅅㅂ|병신|븅신|개새끼|새끼|꺼져|좆|존나|fuck|fucking|shit|bitch|asshole)/i,
  },
];

const REASON_LABELS = {
  "Self-harm": "자해/자살 등 극단적 표현",
  "Extreme profanity": "강한 욕설",
};

const posts = [];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function getLocalBlockReason(...fields) {
  const combined = fields.filter(Boolean).join("\\n");
  return LOCAL_BLOCK_RULES.find(({ pattern }) => pattern.test(combined))?.reason || null;
}

async function callGemini(env, prompt, systemInstruction, jsonMode = false) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 1024,
          responseMimeType: jsonMode ? "application/json" : undefined,
        },
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
}

function parseJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/^\\\`\\\`\\\`json\\s*/i, "")
    .replace(/^\\\`\\\`\\\`\\s*/i, "")
    .replace(/\\s*\\\`\\\`\\\`$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\\{[\\s\\S]*\\}/);
    if (!match) throw new Error("Failed to parse JSON response from Gemini");
    return JSON.parse(match[0]);
  }
}

async function handleChat(request, env) {
  const { message, history = [] } = await request.json();
  if (!message || typeof message !== "string") {
    return json({ success: false, message: "message is required" }, 400);
  }

  const historyText = history
    .filter((turn) => turn && typeof turn.content === "string")
    .slice(-8)
    .map((turn) => \`\${turn.role === "assistant" ? "Assistant" : "User"}: \${turn.content}\`)
    .join("\\n");

  const systemInstruction = \`You are 트롯마당's friendly AI assistant for a trot fan community app.
Answer in the same language as the user's latest message. Keep replies warm, practical, and short.
If the user clearly wants to move to a screen, set action to one of these codes: \${ACTION_CODES.join(", ")}.
If there is no clear navigation intent, set action to null.
Return JSON only: {"reply":"message shown to the user","action":"ACTION_CODE or null"}\`;

  const raw = await callGemini(
    env,
    \`[Previous conversation]\\n\${historyText || "(none)"}\\n\\n[Latest user message]\\n\${message.trim()}\`,
    systemInstruction,
    true,
  );
  const parsed = parseJsonResponse(raw);
  const action = ACTION_CODES.includes(parsed.action) ? parsed.action : null;
  const reply = typeof parsed.reply === "string" && parsed.reply.trim()
    ? parsed.reply.trim()
    : "죄송해요. 다시 한 번만 말해주시면 바로 도와드릴게요.";

  return json({ success: true, reply, action });
}

async function handlePostCreate(request) {
  const form = await request.formData();
  const title = String(form.get("title") || "").trim();
  const content = String(form.get("content") || "").trim();
  const category = String(form.get("category") || "응원");
  const singerName = String(form.get("singerName") || "전체");
  const singerId = String(form.get("singerId") || "all");

  if (!title || !content) {
    return json({ success: false, message: "제목과 내용을 입력해 주세요." }, 400);
  }

  const reason = getLocalBlockReason(title, content);
  if (reason) {
    return json({
      success: false,
      blocked: true,
      reason,
      message: \`AI 필터링으로 게시글 등록이 제한되었습니다. 사유: \${REASON_LABELS[reason] || reason}\`,
    }, 400);
  }

  const post = {
    id: String(Date.now()),
    title,
    content,
    category,
    singerName,
    singerId,
    likes: 0,
    mediaUrl: null,
    mediaType: null,
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  return json({ success: true, id: post.id, post });
}

function serveAsset(pathname) {
  const asset = ASSETS[pathname] || (pathname === "/" ? ASSETS["/index.html"] : null) || ASSETS["/index.html"];
  const body = Uint8Array.from(atob(asset.body), (char) => char.charCodeAt(0));
  return new Response(body, {
    headers: {
      "content-type": asset.contentType,
      "cache-control": pathname.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/health") {
        return json({ success: true, message: "트롯마당 server is running" });
      }

      if (url.pathname === "/api/ai/chat" && request.method === "POST") {
        return handleChat(request, env);
      }

      if (url.pathname === "/api/posts" && request.method === "GET") {
        const singerName = url.searchParams.get("singerName");
        const category = url.searchParams.get("category");
        const filteredPosts = posts.filter((post) => {
          const matchesSinger = !singerName || singerName === "전체" || post.singerName === singerName;
          const matchesCategory = !category || category === "전체" || post.category === category;
          return matchesSinger && matchesCategory;
        });
        return json({ success: true, posts: filteredPosts });
      }

      if (url.pathname === "/api/posts" && request.method === "POST") {
        return handlePostCreate(request);
      }

      return serveAsset(url.pathname);
    } catch (error) {
      return json({ success: false, message: error.message || "Request failed" }, 500);
    }
  },
};
`;

await writeFile(path.join(serverDir, "index.js"), workerSource);
