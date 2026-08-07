import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 팬덤 일정 목록 조회
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("schedules").get();
    const schedules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;