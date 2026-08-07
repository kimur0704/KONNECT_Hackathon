import express from "express";
import multer from "multer";
import path from "path";
import { unlink } from "fs/promises";
import { db } from "../firestore.js";
import { moderateCombinedText } from "../../ai/moderation.js";
import { moderateImageFile } from "../../ai/imageModeration.js";

const router = express.Router();

const MODERATION_REASON_LABELS = {
  "Hate speech": "혐오 표현",
  Harassment: "괴롭힘/비방",
  "Self-harm": "자해/자살 등 극단적 표현",
  "Sexual content": "성적인 내용",
  Violence: "폭력적인 내용",
  Spam: "스팸",
  "Personal information": "개인정보",
  "Abusive language": "욕설/공격적인 표현",
  "Extreme profanity": "강한 욕설",
  Nudity: "노출 이미지",
  Gore: "잔혹 이미지",
  "Explicit content": "부적절한 이미지",
  "Hateful imagery": "혐오 이미지",
};

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

async function removeUploadedFile(file) {
  if (!file?.path) return;

  try {
    await unlink(file.path);
  } catch (error) {
    console.warn("[Posts] Failed to remove rejected upload:", error.message);
  }
}

function buildModerationMessage(reason) {
  const label = MODERATION_REASON_LABELS[reason] || reason || "부적절한 내용";
  return `AI 필터링으로 게시글 등록이 제한되었습니다. 사유: ${label}`;
}

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

router.post("/", upload.single("media"), async (req, res) => {
  try {
    const { title, content, singerName, singerId, category } = req.body;

    if (!title || !content) {
      await removeUploadedFile(req.file);
      return res.status(400).json({ success: false, message: "제목과 내용을 입력해 주세요." });
    }

    const textModeration = await moderateCombinedText([title, content]);
    if (!textModeration.safe) {
      await removeUploadedFile(req.file);
      return res.status(400).json({
        success: false,
        blocked: true,
        reason: textModeration.reason,
        message: buildModerationMessage(textModeration.reason),
      });
    }

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";

      if (mediaType === "image") {
        const imageModeration = await moderateImageFile(req.file.path, req.file.mimetype);
        if (!imageModeration.safe) {
          await removeUploadedFile(req.file);
          return res.status(400).json({
            success: false,
            blocked: true,
            reason: imageModeration.reason,
            message: buildModerationMessage(imageModeration.reason),
          });
        }
      }
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

    if (category === "투표인증" && singerName) {
      const rankingsSnapshot = await db.collection("rankings").where("name", "==", singerName).get();
      if (!rankingsSnapshot.empty) {
        const rankDoc = rankingsSnapshot.docs[0];
        const currentAuthCount = rankDoc.data().authCount || 0;
        const currentScore = rankDoc.data().score || 0;

        await rankDoc.ref.update({
          authCount: currentAuthCount + 1,
          score: currentScore + 50,
        });
      }
    }

    res.json({ success: true, id: docRef.id, post: { id: docRef.id, ...newPost } });
  } catch (error) {
    await removeUploadedFile(req.file);

    if (error.message?.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        success: false,
        message: "AI 필터링 설정이 필요합니다. GEMINI_API_KEY를 확인해 주세요.",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
});

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
