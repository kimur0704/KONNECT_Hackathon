import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 작성
router.post("/", async (req, res) => {
  try {
    const { writer, content, language, postType, aiFiltered } = req.body;

    const newPost = {
      writer: writer || "익명",
      content,
      language: language || "ko",
      postType: postType || "normal", // 'normal' 또는 'voteAuth'
      aiFiltered: aiFiltered !== undefined ? aiFiltered : true,
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("posts").add(newPost);
    res.json({ success: true, id: docRef.id, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;