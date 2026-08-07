import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 명예의 전당 목록 조회 (총점 = 투표 점수 + 인증 점수)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("rankings").get();
    let rankings = snapshot.docs.map((doc) => {
      const data = doc.data();
      const votes = data.votes || 0;
      const authCount = data.authCount || 0;
      // 점수 계산 기준: 1투표 = 10점, 1인증 = 50점
      const totalScore = votes * 10 + authCount * 50;

      return {
        id: doc.id,
        ...data,
        score: totalScore,
      };
    });

    // 총점 기준 내림차순 정렬 후 순위 부여
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    res.json({ success: true, rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 직접 투표하기
router.post("/:id/vote", async (req, res) => {
  try {
    const ref = db.collection("rankings").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "가수를 찾을 수 없습니다." });
    }

    const currentVotes = doc.data().votes || 0;
    await ref.update({ votes: currentVotes + 1 });

    res.json({ success: true, message: `${doc.data().name} 가수님에게 투표했습니다!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;