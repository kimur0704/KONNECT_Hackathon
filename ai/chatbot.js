import { generateText, parseJsonResponse } from "./gemini.js";

export const ACTION_CODES = [
  "OPEN_HOME",
  "OPEN_BOARD",
  "OPEN_PROFILE",
  "OPEN_SETTINGS",
  "OPEN_CHAT",
  "OPEN_TRANSLATOR",
];

const SYSTEM_INSTRUCTION = `You are KONNECT's friendly AI assistant for a trot fan community app.
Answer in the same language as the user's latest message. Keep replies warm, practical, and short.

If the user clearly wants to move to a screen, set action to one of these codes:
- OPEN_HOME: home screen, favorite artist list, main menu
- OPEN_BOARD: community board, writing posts, reading posts, vote certificate posts
- OPEN_PROFILE: my page or profile information
- OPEN_SETTINGS: settings
- OPEN_TRANSLATOR: language or translation settings
- OPEN_CHAT: AI assistant chat

If there is no clear navigation intent, set action to null.

Return JSON only. Do not use markdown or code fences.
{"reply":"message shown to the user","action":"ACTION_CODE or null"}`;

function normalizeHistory(history = []) {
  return history
    .filter((turn) => turn && typeof turn.content === "string")
    .slice(-8)
    .map((turn) => {
      const role = turn.role === "assistant" ? "Assistant" : "User";
      return `${role}: ${turn.content}`;
    })
    .join("\n");
}

function buildPrompt(message, history = []) {
  return `[Previous conversation]
${normalizeHistory(history) || "(none)"}

[Latest user message]
${message}`;
}

export async function chatWithBot(message, history = []) {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("message is required");
  }

  const raw = await generateText({
    prompt: buildPrompt(message.trim(), history),
    systemInstruction: SYSTEM_INSTRUCTION,
    jsonMode: true,
    timeoutMs: 20000,
    temperature: 0.35,
  });

  let parsed;
  try {
    parsed = parseJsonResponse(raw);
  } catch {
    return { reply: raw, action: null };
  }

  const action = ACTION_CODES.includes(parsed.action) ? parsed.action : null;
  const reply =
    typeof parsed.reply === "string" && parsed.reply.trim()
      ? parsed.reply.trim()
      : "죄송해요. 다시 한 번만 말해주시면 바로 도와드릴게요.";

  return { reply, action };
}
