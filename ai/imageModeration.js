import { readFileSync } from "fs";
import { generateWithParts, parseJsonResponse } from "./gemini.js";
const IMAGE_RISK_CATEGORIES = [
  "Nudity",
  "Violence",
  "Gore",
  "Explicit content",
  "Hateful imagery",
];
const SYSTEM_INSTRUCTION = `You are an image moderation system for a fan community app.
Analyze the image for: nudity, violence, gore, explicit content, hateful imagery.
Respond with JSON only:
- If safe: {"safe": true}
- If unsafe: {"safe": false, "reason": "CategoryName"}
Use one of these reason values exactly: ${IMAGE_RISK_CATEGORIES.join(", ")}.
Concert photos, fan signs, and normal selfies are generally safe.
`;
function detectMimeType(filePath, mimetype) {
  if (mimetype && mimetype.startsWith("image/")) {
    return mimetype;
  }
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
export async function moderateImageFile(filePath, mimetype) {
  if (!filePath) {
    throw new Error("Image file path is required");
  }
  const buffer = readFileSync(filePath);
  const mimeType = detectMimeType(filePath, mimetype);
  const base64 = buffer.toString("base64");
  const raw = await generateWithParts({
    parts: [
      { text: "Analyze this image for content moderation." },
      { inlineData: { mimeType, data: base64 } },
    ],
    systemInstruction: SYSTEM_INSTRUCTION,
    jsonMode: true,
    timeoutMs: 30000,
  });
  const parsed = parseJsonResponse(raw);
  if (parsed.safe === true) {
    return { safe: true };
  }
  if (parsed.safe === false) {
    const reason = IMAGE_RISK_CATEGORIES.includes(parsed.reason)
      ? parsed.reason
      : "Explicit content";
    return { safe: false, reason };
  }
  throw new Error("Invalid image moderation response format");
}
export async function moderateImageBuffer(buffer, mimetype = "image/jpeg") {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Image buffer is required");
  }
  const base64 = buffer.toString("base64");
  const raw = await generateWithParts({
    parts: [
      { text: "Analyze this image for content moderation." },
      { inlineData: { mimeType: mimetype, data: base64 } },
    ],
    systemInstruction: SYSTEM_INSTRUCTION,
    jsonMode: true,
    timeoutMs: 30000,
  });
  const parsed = parseJsonResponse(raw);
  if (parsed.safe === true) {
    return { safe: true };
  }
  if (parsed.safe === false) {
    const reason = IMAGE_RISK_CATEGORIES.includes(parsed.reason)
      ? parsed.reason
      : "Explicit content";
    return { safe: false, reason };
  }
  throw new Error("Invalid image moderation response format");
}