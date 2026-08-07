import { generateText, parseJsonResponse } from "./gemini.js";
const MODERATION_CATEGORIES = [
  "Hate speech",
  "Harassment",
  "Self-harm",
  "Sexual content",
  "Violence",
  "Spam",
  "Personal information",
  "Abusive language",
  "Extreme profanity",
];

const LOCAL_BLOCK_RULES = [
  {
    reason: "Self-harm",
    pattern: /(자살|자해|죽고\s*싶|죽어\s*버리|극단적\s*선택|목\s*매|투신|suicide|self[-\s]?harm|kill\s+myself)/i,
  },
  {
    reason: "Extreme profanity",
    pattern: /(시발|씨발|ㅅㅂ|병신|븅신|개새끼|새끼|꺼져|좆|존나|fuck|fucking|shit|bitch|asshole)/i,
  },
];

const SYSTEM_INSTRUCTION = `You are a content moderation system for a fan community app.
Analyze text for: hate speech, harassment, self-harm or suicide expressions, sexual content, violence, spam, personal information (phone, address, email, ID numbers), abusive language, and extreme profanity.
Respond with JSON only:
- If safe: {"safe": true}
- If unsafe: {"safe": false, "reason": "CategoryName"}
Use one of these reason values exactly: ${MODERATION_CATEGORIES.join(", ")}.
Be strict on personal information, hate speech, harassment, self-harm or suicide expressions, sexual content, and strong profanity.
Block posts that contain suicide/self-harm encouragement, threats, intent, methods, or casual use of extreme self-harm words.
Block posts that contain strong swear words or abusive profanity even when there is no direct target.
Fan support messages and enthusiastic posts are generally safe unless they violate the above.
`;
export async function moderateText(text) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Text is required");
  }
  const trimmedText = text.trim();
  if (trimmedText.length > 8000) {
    return { safe: false, reason: "Spam" };
  }

  const localBlock = LOCAL_BLOCK_RULES.find(({ pattern }) => pattern.test(trimmedText));
  if (localBlock) {
    return { safe: false, reason: localBlock.reason };
  }

  const raw = await generateText({
    prompt: `Moderate this content:\n\n${trimmedText}`,
    systemInstruction: SYSTEM_INSTRUCTION,
    jsonMode: true,
    timeoutMs: 20000,
  });
  const parsed = parseJsonResponse(raw);
  if (parsed.safe === true) {
    return { safe: true };
  }
  if (parsed.safe === false) {
    const reason = MODERATION_CATEGORIES.includes(parsed.reason)
      ? parsed.reason
      : "Abusive language";
    return { safe: false, reason };
  }
  throw new Error("Invalid moderation response format");
}
export async function moderateCombinedText(fields) {
  const combined = fields.filter(Boolean).join("\n\n");
  return moderateText(combined);
}
