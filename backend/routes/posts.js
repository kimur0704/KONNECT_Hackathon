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
    const { writer, content, language } = req.body;
    const newPost = {
      writer,
      content,
      language,
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection("posts").add(newPost);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("posts").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "게시글 없음" });
    }
    res.json({ success: true, post: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 좋아요
router.post("/:id/like", async (req, res) => {
  try {
    const postRef = db.collection("posts").doc(req.params.id);
    const doc = await postRef.get();
    const currentLikes = doc.data().likeCount || 0;
    await postRef.update({ likeCount: currentLikes + 1 });
    res.json({ success: true, likeCount: currentLikes + 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;