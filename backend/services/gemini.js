import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateText(text, targetLang) {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `다음 문장을 ${targetLang}로 번역해줘. 번역 결과만 출력해.\n\n${text}`,
  });
  return response.text;
}