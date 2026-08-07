import { createHash } from "crypto";
import { db } from "../../firestore.js";
import { generateText } from "./gemini.js";
const LANG_LABELS = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  "zh-CN": "Simplified Chinese",
};
function buildCacheKey(text, targetLang) {
  return createHash("sha256").update(`${targetLang}::${text}`).digest("hex");
}
async function getCachedTranslation(cacheKey) {
  const doc = await db.collection("translation_cache").doc(cacheKey).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  return data.translatedText || null;
}
async function saveCachedTranslation(cacheKey, originalText, targetLang, translatedText) {
  await db.collection("translation_cache").doc(cacheKey).set({
    originalText,
    targetLang,
    translatedText,
    createdAt: new Date().toISOString(),
  });
}
export function resolveLanguageLabel(targetLang) {
  return LANG_LABELS[targetLang] || targetLang;
}
export async function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Text is required");
  }
  if (!targetLang || typeof targetLang !== "string") {
    throw new Error("Target language is required");
  }
  const trimmedText = text.trim();
  if (targetLang === "ko") {
    return {
      originalText: trimmedText,
      translatedText: trimmedText,
      targetLang,
      cached: true,
    };
  }
  const cacheKey = buildCacheKey(trimmedText, targetLang);
  const cached = await getCachedTranslation(cacheKey);
  if (cached) {
    return {
      originalText: trimmedText,
      translatedText: cached,
      targetLang,
      cached: true,
    };
  }
  const langLabel = resolveLanguageLabel(targetLang);
  const translatedText = await generateText({
    prompt: `Translate the following text to ${langLabel}. Return ONLY the translated text with no quotes, labels, or explanation.\n\n${trimmedText}`,
    systemInstruction: "You are a professional translator. Preserve tone and meaning. Output translation only.",
  });
  await saveCachedTranslation(cacheKey, trimmedText, targetLang, translatedText);
  return {
    originalText: trimmedText,
    translatedText,
    targetLang,
    cached: false,
  };
}
export async function translateBatch(items, targetLang) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }
  const results = await Promise.all(
    items.map(async (item) => {
      try {
        const result = await translateText(item.text, targetLang);
        return {
          id: item.id,
          field: item.field,
          ...result,
        };
      } catch (error) {
        console.error(`[Translator] Failed to translate item ${item.id}:`, error.message);
        return {
          id: item.id,
          field: item.field,
          originalText: item.text,
          translatedText: item.text,
          targetLang,
          cached: false,
          error: error.message,
        };
      }
    }),
  );
  return results;
}