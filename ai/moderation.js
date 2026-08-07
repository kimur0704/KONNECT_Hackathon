import { generateText, parseJsonResponse } from "./gemini.js";
const MODERATION_CATEGORIES = [
  "Hate speech",
  "Harassment",
  "Sexual content",
  "Violence",
  "Spam",
  "Personal information",
  "Abusive language",
];
const SYSTEM_INSTRUCTION = `You are a content moderation system for a fan community app.
Analyze text for: hate speech, harassment, sexual content, violence, spam, personal information (phone, address, email, ID numbers), abusive language.
Respond with JSON only:
- If safe: {"safe": true}
- If unsafe: {"safe": false, "reason": "CategoryName"}
Use one of these reason values exactly: ${MODERATION_CATEGORIES.join(", ")}.
Be strict on personal information, hate speech, harassment, and sexual content.
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