import { createHash } from "crypto";
import { generateText } from "./gemini.js";

const LANG_LABELS = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  "zh-CN": "Simplified Chinese",
};

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = import("../backend/firestore.js")
      .then((module) => module.db)
      .catch((error) => {
        console.warn("[Translator] Firestore cache disabled:", error.message);
        return null;
      });
  }

  return dbPromise;
}

function buildCacheKey(text, targetLang) {
  return createHash("sha256").update(`${targetLang}::${text}`).digest("hex");
}

async function getCachedTranslation(cacheKey) {
  const db = await getDb();
  if (!db) return null;

  const doc = await db.collection("translation_cache").doc(cacheKey).get();
  if (!doc.exists) return null;

  return doc.data().translatedText || null;
}

async function saveCachedTranslation(cacheKey, originalText, targetLang, translatedText) {
  const db = await getDb();
  if (!db) return;

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
    prompt: `Translate the following text to ${langLabel}. Return only the translated text.\n\n${trimmedText}`,
    systemInstruction: "You are a professional translator. Preserve tone and meaning. Output translation only.",
    timeoutMs: 20000,
    temperature: 0.2,
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

  return Promise.all(
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
}
