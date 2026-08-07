import { db } from "./firestore.js";

async function seedDatabase() {
  console.log("DB 데이터 초기화 및 재주입을 시작합니다...");

  // 기존 posts 데이터 삭제 (초기화)
  const postsRef = db.collection("posts");
  const snapshot = await postsRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log("기존 게시글 삭제 완료!");

  // 1. 명예의 전당 / 랭킹 더미 데이터
  const rankingsRef = db.collection("rankings");
  const rankingSnapshot = await rankingsRef.get();
  if (rankingSnapshot.empty) {
    const initialRankings = [
      { name: "임영웅", votes: 340, authCount: 28, activity: "오늘 오후 8시 음악방송", trend: "up" },
      { name: "송가인", votes: 210, authCount: 19, activity: "내일 라이브 방송", trend: "keep" },
      { name: "장윤정", votes: 155, authCount: 12, activity: "8월 콘서트 준비 중", trend: "down" },
    ];
    for (const rankItem of initialRankings) {
      await rankingsRef.add(rankItem);
    }
    console.log("랭킹 데이터 주입 완료!");
  }

  // 2. 임영웅 4개 게시판 예시 데이터 (응원, 자유, 투표인증, 홍보)
  const initialPosts = [
    // [응원 게시판]
    {
      title: "임영웅 가수님 오늘 음방 본방사수 합시다! 💜",
      content: "오늘 오후 8시 생방송 무대 너무 기대됩니다. 영웅시대 분들 다 같이 실시간 응원 댓글 달아요!",
      category: "응원",
      singerName: "임영웅",
      singerId: "1",
      likes: 42,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      title: "무대에서 제일 빛나는 우리 영웅 님✨",
      content: "언제나 진심을 다해 노래해주셔서 감사합니다. 건행!",
      category: "응원",
      singerName: "임영웅",
      singerId: "1",
      likes: 29,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },

    // [자유 게시판]
    {
      title: "이번 공식 굿즈 응원봉 실물 후기 나눕니다~",
      content: "실물로 보니까 하늘색 불빛이 영롱함 그 자체네요! 이번 콘서트 때 다 같이 들면 대박일 듯합니다.",
      category: "자유",
      singerName: "임영웅",
      singerId: "1",
      likes: 18,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      title: "지방 팬분들 콘서트 때 셔틀 버스 이용하시나요?",
      content: "부산 지역 차편 알아보고 있는데 버스 대절 신청하시는 분 계신가요?",
      category: "자유",
      singerName: "임영웅",
      singerId: "1",
      likes: 11,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    },

    // [투표인증 게시판]
    {
      title: "오늘자 일일 투표 100표 완료 인증합니다! ✅",
      content: "가수님 명예의 전당 1등 만들어 드리기 위해 온 가족 계정 총동원해서 풀투표 완료했습니다!",
      category: "투표인증",
      singerName: "임영웅",
      singerId: "1",
      likes: 55,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      title: "주간 랭킹 1위 가자! 투표 인증샷 공유 💜",
      content: "매일 잊지 않고 투표 참여 중입니다. 다들 함께 화이팅해요!",
      category: "투표인증",
      singerName: "임영웅",
      singerId: "1",
      likes: 37,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },

    // [홍보 게시판]
    {
      title: "📺 [클립] 레전드 찍은 지난주 무대 스페셜 영상 모음!",
      content: "조회수 100만 돌파 직전입니다! 스티밍 및 좋아요 많이 눌러주세요 🎬",
      category: "홍보",
      singerName: "임영웅",
      singerId: "1",
      likes: 64,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    },
    {
      title: "🎉 [행사] 생일 기념 팬 카페 컵홀더 이벤트 일정 안내",
      content: "서울 강남역 및 춘천 명동 카페에서 나눔 이벤트 진행합니다! 특전 엽서도 준비되어 있으니 많이 방문해 주세요.",
      category: "홍보",
      singerName: "임영웅",
      singerId: "1",
      likes: 80,
      mediaUrl: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    },
  ];

  for (const post of initialPosts) {
    await postsRef.add(post);
  }
  console.log("임영웅 4개 게시판 예시 데이터 주입 완료!");

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("데이터 주입 실패:", err);
  process.exit(1);
});