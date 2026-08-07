import { db } from "./firestore.js";

async function seedDatabase() {
  console.log("DB 데이터 주입을 시작합니다...");

  // 1. 명예의 전당 / 랭킹 더미 데이터
  const rankingsRef = db.collection("rankings");
  const initialRankings = [
    { name: "윤하늘", votes: 340, authCount: 28, activity: "오늘 오후 8시 음악방송", trend: "up" },
    { name: "김별빛", votes: 210, authCount: 19, activity: "내일 라이브 방송", trend: "keep" },
    { name: "박다정", votes: 155, authCount: 12, activity: "8월 콘서트 준비 중", trend: "down" },
  ];

  for (const rankItem of initialRankings) {
    await rankingsRef.add(rankItem);
  }
  console.log("랭킹 데이터 주입 완료!");

  // 2. 3개 게시판 예시 데이터 (응원, 자유, 투표인증)
  const postsRef = db.collection("posts");
  const initialPosts = [
    {
      title: "윤하늘 가수님 오늘 음방 본방사수 합시다!",
      content: "오늘 오후 8시 생방송 무대 너무 기대됩니다. 다 같이 응원해요!",
      category: "응원",
      singerName: "윤하늘",
      singerId: "1",
      likes: 42,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      title: "팬클럽 굿즈 수령 후기 나누어요~",
      content: "이번에 새로 나온 응원봉 디자인 진짜 예쁘게 잘 나왔네요! 만족스럽습니다.",
      category: "자유",
      singerName: "윤하늘",
      singerId: "1",
      likes: 18,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      title: "오늘자 투표 100표 완료 인증합니다! ✅",
      content: "가수님 1등 만들어드리기 위해 오늘도 투표 싹 다 완료했습니다. 화이팅!",
      category: "투표인증",
      singerName: "윤하늘",
      singerId: "1",
      likes: 55,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  for (const post of initialPosts) {
    await postsRef.add(post);
  }
  console.log("게시판 예시 데이터 주입 완료!");

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("데이터 주입 실패:", err);
  process.exit(1);
});