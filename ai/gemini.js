import { GoogleGenAI } from "@google/genai";
const DEFAULT_MODEL = "gemini-2.0-flash";
const DEFAULT_TIMEOUT_MS = 30000;
let client = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}
function withTimeout(promise, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}
export async function generateText({ prompt, systemInstruction, jsonMode = false, timeoutMs = DEFAULT_TIMEOUT_MS }) {
  const ai = getClient();
  const config = {
    temperature: 0.4,
    maxOutputTokens: 2048,
  };
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }
  if (jsonMode) {
    config.responseMimeType = "application/json";
  }
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: prompt,
        config,
      }),
      timeoutMs,
    );
    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }
    return text;
  } catch (error) {
    console.error("[Gemini] generateText error:", error.message);
    throw error;
  }
}
export async function generateWithParts({ parts, systemInstruction, jsonMode = false, timeoutMs = DEFAULT_TIMEOUT_MS }) {
  const ai = getClient();
  const config = {
    temperature: 0.2,
    maxOutputTokens: 1024,
  };
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }
  if (jsonMode) {
    config.responseMimeType = "application/json";
  }
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [{ role: "user", parts }],
        config,
      }),
      timeoutMs,
    );
    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }
    return text;
  } catch (error) {
    console.error("[Gemini] generateWithParts error:", error.message);
    throw error;
  }
}
export function parseJsonResponse(rawText) {
  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Failed to parse JSON response from Gemini");
  }
}