import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 주변 모임 전체 목록 조회
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("gatherings").get();
    const gatherings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ success: true, gatherings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 특정 모임 신청/취소 토글 (booked 상태 변경)
router.patch("/:id/book", async (req, res) => {
  try {
    const ref = db.collection("gatherings").doc(req.params.id);
    const doc = await ref.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "모임을 찾을 수 없습니다." });
    }

    const currentBooked = doc.data().booked || false;
    const nextBooked = !currentBooked;

    await ref.update({ booked: nextBooked });
    res.json({ success: true, booked: nextBooked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;