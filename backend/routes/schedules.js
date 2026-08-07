import express from "express";
import { db } from "../firestore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("schedules").orderBy("date", "asc").get();
    const schedules = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("schedules").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "일정 없음" });
    }
    res.json({ success: true, schedule: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;