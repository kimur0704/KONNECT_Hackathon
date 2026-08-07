import { generateText, parseJsonResponse } from "./gemini.js";

// 프론트엔드(src/App.jsx의 handleAiNavigation)가 인식하는 이동 액션 코드.
// 이 목록에 없는 값은 프론트에서 무시되므로 반드시 아래 6개 중 하나 또는 null만 사용해야 함.
const ACTION_CODES = [
  "OPEN_HOME",
  "OPEN_BOARD",
  "OPEN_PROFILE",
  "OPEN_SETTINGS",
  "OPEN_CHAT",
  "OPEN_TRANSLATOR",
];

const SYSTEM_INSTRUCTION = `너는 트로트 팬덤 플랫폼 'KONNECT'의 AI 도우미 챗봇이다.
사용자가 앱 사용 중 궁금한 점을 물어보면 친절하고 간결하게(2~3문장 이내) 답변한다.
답변은 반드시 사용자가 마지막 메시지에서 사용한 언어와 동일한 언어로 작성한다.

사용자의 메시지에서 아래 화면 중 하나로 이동하고 싶어하는 의도가 감지되면, 반드시 action 값에 해당 코드를 담아라.
이동 의도가 없는 단순 질문/잡담이라면 action은 null로 한다.

[이동 가능한 화면 코드]
- OPEN_HOME: 홈 화면 (내가 좋아하는 가수 목록)
- OPEN_BOARD: 커뮤니티 게시판 (응원 게시글 작성/열람)
- OPEN_PROFILE: 마이페이지 (내 정보)
- OPEN_SETTINGS: 설정 화면
- OPEN_TRANSLATOR: 언어 설정(번역 언어 변경) 화면
- OPEN_CHAT: AI 도우미 채팅 화면 (지금 사용자가 이미 있는 화면이므로 특별한 경우가 아니면 사용하지 않는다)

[예시]
"응원 게시글 쓰고 싶어" -> action: "OPEN_BOARD"
"게시판 보여줘" -> action: "OPEN_BOARD"
"홈으로 가고 싶어" -> action: "OPEN_HOME"
"언어 바꾸고 싶어" -> action: "OPEN_TRANSLATOR"
"내 정보 보고싶어" / "설정 열어줘" -> action: "OPEN_PROFILE" 또는 "OPEN_SETTINGS"
"오늘 날씨 어때?" (이동 의도 없음) -> action: null

반드시 아래 JSON 형식으로만 답변하라. 다른 설명, 코드블록 표시는 절대 포함하지 마라.
{"reply": "사용자에게 보여줄 답변 텍스트", "action": "위 코드 중 하나" 또는 null}`;

function buildPrompt(message, history = []) {
  const historyText = (history || [])
    .slice(-8)
    .map((turn) => `${turn.role === "user" ? "사용자" : "챗봇"}: ${turn.content}`)
    .join("\n");

  return `[이전 대화]
${historyText || "(없음)"}

[사용자 메시지]
${message}`;
}

export async function chatWithBot(message, history = []) {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("message is required");
  }

  const raw = await generateText({
    prompt: buildPrompt(message.trim(), history),
    systemInstruction: SYSTEM_INSTRUCTION,
    jsonMode: true,
    timeoutMs: 20000,
  });

  let parsed;
  try {
    parsed = parseJsonResponse(raw);
  } catch {
    // JSON 파싱에 실패하면 원문 텍스트를 답변으로, 이동 액션은 없는 것으로 처리
    return { reply: raw, action: null };
  }

  const action = ACTION_CODES.includes(parsed.action) ? parsed.action : null;
  const reply = typeof parsed.reply === "string" && parsed.reply.trim()
    ? parsed.reply.trim()
    : "죄송해요, 다시 한 번 말씀해 주시겠어요?";

  return { reply, action };
}

export { ACTION_CODES };
