// backend/routes/user.js
import express from "express";
import { db } from "../firestore.js";

const router = express.Router();
const FIXED_USER_ID = "demo-user"; // 시연용 고정 사용자

router.get("/", async (req, res) => {
  try {
    const doc = await db.collection("users").doc(FIXED_USER_ID).get();
    if (!doc.exists) {
      // 없으면 기본값으로 생성
      const defaultUser = { nickname: "글로벌팬", language: "en", favoriteSinger: "김트롯" };
      await db.collection("users").doc(FIXED_USER_ID).set(defaultUser);
      return res.json({ success: true, user: defaultUser });
    }
    res.json({ success: true, user: doc.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/language", async (req, res) => {
  try {
    const { language } = req.body;
    await db.collection("users").doc(FIXED_USER_ID).update({ language });
    res.json({ success: true, language });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;