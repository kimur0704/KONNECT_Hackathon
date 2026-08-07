import express from "express";
import { db } from "../firestore.js";
import { FieldValue } from "firebase-admin/firestore";

const router = express.Router();

// 전체 투표 목록 조회
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("votes").get();
    const votes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, votes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 투표 인증 (+1 실시간 증가)
router.post("/:id/confirm", async (req, res) => {
  try {
    const voteRef = db.collection("votes").doc(req.params.id);
    
    // Firestore 트랜잭션/FieldIncrement 적용 (더미가 아닌 진짜 연동)
    await voteRef.update({
      confirmCount: FieldValue.increment(1)
    });

    const updatedDoc = await voteRef.get();
    res.json({ success: true, confirmCount: updatedDoc.data().confirmCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;