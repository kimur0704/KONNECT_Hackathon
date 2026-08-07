import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

// 1. 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 게시글 작성 (유효성 검사 추가)
router.post("/", async (req, res) => {
  try {
    const { writer, content, language } = req.body;

    // 필수 항목 검증
    if (!writer || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "writer와 content는 필수 입력 항목입니다." 
      });
    }

    const newPost = {
      writer,
      content,
      language: language || "ko", // 기본값 설정
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("posts").add(newPost);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. 게시글 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("posts").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
    }
    res.json({ success: true, post: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. 게시글 좋아요 (예외 처리 보완)
router.post("/:id/like", async (req, res) => {
  try {
    const postRef = db.collection("posts").doc(req.params.id);
    const doc = await postRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
    }

    const currentLikes = doc.data().likeCount || 0;
    const newLikes = currentLikes + 1;

    await postRef.update({ likeCount: newLikes });
    res.json({ success: true, likeCount: newLikes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;