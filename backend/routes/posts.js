import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../firestore.js";

const router = express.Router();

// 이미지/영상 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 1. 게시글 목록 조회 (가수명 + 카테고리 필터)
router.get("/", async (req, res) => {
  try {
    const { singerName, category } = req.query;
    let query = db.collection("posts");

    if (singerName && singerName !== "전체") {
      query = query.where("singerName", "==", singerName);
    }
    if (category && category !== "전체") {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. 게시글 작성 (파일 업로드 지원)
router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { title, content, singerName, singerId, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "제목과 내용을 입력해 주세요." });
    }

    let mediaUrl = null;
    let mediaType = null; // 'image' | 'video'

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const newPost = {
      title,
      content,
      category: category || "응원",
      singerName: singerName || "전체",
      singerId: singerId || "all",
      likes: 0,
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("posts").add(newPost);

    // 투표 인증 게시글일 경우 명예의 전당(rankings) 가수 인증 수 1 증가
    if (category === "투표인증" && singerName) {
      const rankingsSnapshot = await db.collection("rankings").where("name", "==", singerName).get();
      if (!rankingsSnapshot.empty) {
        const rankDoc = rankingsSnapshot.docs[0];
        const currentAuthCount = rankDoc.data().authCount || 0;
        const currentScore = rankDoc.data().score || 0;

        await rankDoc.ref.update({
          authCount: currentAuthCount + 1,
          score: currentScore + 50, // 인증 1건당 50점 가산
        });
      }
    }

    res.json({ success: true, id: docRef.id, post: { id: docRef.id, ...newPost } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. 좋아요
router.patch("/:id/like", async (req, res) => {
  try {
    const ref = db.collection("posts").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
    }
    const newLikes = (doc.data().likes || 0) + 1;
    await ref.update({ likes: newLikes });
    res.json({ success: true, likes: newLikes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;