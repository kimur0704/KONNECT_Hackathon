import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import postsRouter from "./routes/posts.js";
import schedulesRouter from "./routes/schedules.js";
import gatheringsRouter from "./routes/gatherings.js";
import rankingsRouter from "./routes/rankings.js";
import aiRouter from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// API 라우트 연결
app.use("/api/posts", postsRouter);
app.use("/api/schedules", schedulesRouter);
app.use("/api/gatherings", gatheringsRouter);
app.use("/api/rankings", rankingsRouter);
app.use("/api/ai", aiRouter);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "KONNECT server is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
