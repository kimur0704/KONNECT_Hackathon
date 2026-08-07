import { createRequire } from "module";
import { pathToFileURL } from "url";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const DEFAULT_TIMEOUT_MS = 30000;

let client;
let sdkPromise;
const requireFromBackend = createRequire(new URL("../backend/package.json", import.meta.url));

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
}

async function getGoogleGenAI() {
  if (!sdkPromise) {
    const sdkPath = requireFromBackend.resolve("@google/genai");
    sdkPromise = import(pathToFileURL(sdkPath).href).then((module) => module.GoogleGenAI);
  }

  return sdkPromise;
}

async function getClient() {
  if (!client) {
    const GoogleGenAI = await getGoogleGenAI();
    client = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return client;
}

function withTimeout(promise, timeoutMs = DEFAULT_TIMEOUT_MS) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Gemini API request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function buildConfig({ systemInstruction, jsonMode, temperature, maxOutputTokens }) {
  const config = {
    temperature,
    maxOutputTokens,
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  if (jsonMode) {
    config.responseMimeType = "application/json";
  }

  return config;
}

function readResponseText(response) {
  const text = typeof response.text === "function" ? response.text() : response.text;
  const trimmed = text?.trim();

  if (!trimmed) {
    throw new Error("Empty response from Gemini API");
  }

  return trimmed;
}

export async function generateText({
  prompt,
  systemInstruction,
  jsonMode = false,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  temperature = 0.4,
  maxOutputTokens = 2048,
  model = DEFAULT_MODEL,
}) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("prompt is required");
  }

  const ai = await getClient();

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: prompt,
        config: buildConfig({ systemInstruction, jsonMode, temperature, maxOutputTokens }),
      }),
      timeoutMs,
    );

    return readResponseText(response);
  } catch (error) {
    console.error("[Gemini] generateText error:", error.message);
    throw error;
  }
}

export async function generateWithParts({
  parts,
  systemInstruction,
  jsonMode = false,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  temperature = 0.2,
  maxOutputTokens = 1024,
  model = DEFAULT_MODEL,
}) {
  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error("parts are required");
  }

  const ai = await getClient();

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: [{ role: "user", parts }],
        config: buildConfig({ systemInstruction, jsonMode, temperature, maxOutputTokens }),
      }),
      timeoutMs,
    );

    return readResponseText(response);
  } catch (error) {
    console.error("[Gemini] generateWithParts error:", error.message);
    throw error;
  }
}

export function parseJsonResponse(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Gemini response is empty");
  }

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Failed to parse JSON response from Gemini");
    }
    return JSON.parse(match[0]);
  }
}
