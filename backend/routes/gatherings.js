import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 모임 목록 조회 (지역 필터링 지원)
router.get("/", async (req, res) => {
  try {
    const { region } = req.query;
    let query = db.collection("gatherings");

    if (region && region !== "전체") {
      query = query.where("region", "==", region);
    }

    const snapshot = await query.get();
    const gatherings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, gatherings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;