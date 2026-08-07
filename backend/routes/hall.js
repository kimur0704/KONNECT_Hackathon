import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. 현재 월 자동 계산
    const currentMonth = `${new Date().getMonth() + 1}월`;

    // 2. DB 전체 투표 인증수 합산
    const votesSnapshot = await db.collection("votes").get();
    const totalVoteConfirm = votesSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().confirmCount || 0), 0
    );

    // 3. DB 일반 게시글 수 집계
    const postsSnapshot = await db.collection("posts")
      .where("postType", "==", "normal").get();
    const totalPosts = postsSnapshot.size;

    // 4. DB 전체 모임 수 집계
    const gatheringsSnapshot = await db.collection("gatherings").get();
    const totalGatherings = gatheringsSnapshot.size;

    res.json({
      success: true,
      hall: {
        month: currentMonth, // 자동 계산된 월
        voteConfirmCount: totalVoteConfirm,
        postCount: totalPosts,
        gatheringCount: totalGatherings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;