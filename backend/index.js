import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "KONNECT server is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});