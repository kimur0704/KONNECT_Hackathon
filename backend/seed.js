import { db } from "./firestore.js";

async function seed() {
  // 게시글 더미 데이터
  await db.collection("posts").add({
    writer: "글로벌팬1",
    content: "오늘 무대 정말 감동적이었어요!",
    language: "ko",
    likeCount: 3,
    createdAt: new Date().toISOString(),
  });

  await db.collection("posts").add({
    writer: "fan_usa",
    content: "The stage today was so touching!",
    language: "en",
    likeCount: 5,
    createdAt: new Date().toISOString(),
  });

  // 일정 더미 데이터
  await db.collection("schedules").add({
    title: "음악방송 출연",
    date: "2026-08-10T18:00:00",
    type: "broadcast",
    broadcastUrl: "https://example.com/broadcast",
  });

  await db.collection("schedules").add({
    title: "서울 콘서트",
    date: "2026-08-15T19:00:00",
    type: "concert",
    ticketUrl: "https://example.com/ticket",
    busUrl: "https://example.com/bus",
  });

  console.log("더미 데이터 삽입 완료!");
  process.exit(0);
}

seed();