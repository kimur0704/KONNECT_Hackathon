import express from "express";
import { chatWithBot } from "../../ai/chatbot.js";
import { moderateText } from "../../ai/moderation.js";
import { translateText } from "../../ai/translator.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const result = await chatWithBot(message, history);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("[AI] chat error:", error);
    res.status(500).json({
      success: false,
      message: "AI assistant request failed",
      detail: error.message,
    });
  }
});

router.post("/moderate-text", async (req, res) => {
  try {
    const result = await moderateText(req.body.text);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("[AI] moderation error:", error);
    res.status(500).json({
      success: false,
      message: "Text moderation failed",
      detail: error.message,
    });
  }
});

router.post("/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    const result = await translateText(text, targetLang);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("[AI] translation error:", error);
    res.status(500).json({
      success: false,
      message: "Translation failed",
      detail: error.message,
    });
  }
});

export default router;
