"""
해커톤 백엔드 스타터 (FastAPI)
- 회원가입 / 로그인 (JWT)
- AI 요약 API (Gemini 사용, Claude로 바꾸고 싶으면 call_ai() 함수만 수정)
- 요약 결과 저장 / 조회 (SQLite)

실행:
  pip install -r requirements.txt
  uvicorn main:app --reload
"""

import os
import sqlite3
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

load_dotenv()

# ---------- 설정 ----------
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24시간

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI(title="해커톤 백엔드 스타터")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 해커톤이니 일단 전체 허용, 나중에 프론트 도메인으로 좁히면 됨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "app.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            source_text TEXT NOT NULL,
            summary TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()


init_db()


# ---------- 스키마 ----------
class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class SummarizeRequest(BaseModel):
    text: str

class PostCreateRequest(BaseModel):
    title: str
    content: str 

class TranslateRequest(BaseModel):
    text: str
    target_language: str       


# ---------- 인증 유틸 ----------
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: Optional[int] = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")


# ---------- AI 호출 ----------
def call_ai(text: str) -> str:
    """Gemini(무료 티어)로 3줄 요약."""
    response = gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=f"다음 내용을 한국어로 핵심만 3줄로 요약해줘. 불필요한 설명 없이 요약 결과만 출력해줘.\n\n{text}",
    )
    return response.text
def call_ai_translate(text: str, target_lang: str) -> str:
    response=gemini_client.models.generate_content(
        model="gemini-flash-latest",
        contents=f"다음 텍스트를 {target_lang}로 번역해줘.다른 설명 없이 번역 결과만 출력해줘.\n\n{text}",
    
    )
    return response.text


# ---------- 라우트 ----------
@app.get("/")
def root():
    return {"status": "ok", "message": "해커톤 백엔드 서버 정상 작동 중"}


@app.post("/auth/signup")
def signup(req: SignupRequest):
    conn = get_db()
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (req.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="이미 가입된 이메일입니다")

    hashed = pwd_context.hash(req.password)
    cursor = conn.execute(
        "INSERT INTO users (email, hashed_password, created_at) VALUES (?, ?, ?)",
        (req.email, hashed, datetime.utcnow().isoformat()),
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    token = create_access_token({"user_id": user_id})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/auth/login")
def login(req: LoginRequest):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    conn.close()

    if not user or not pwd_context.verify(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 틀렸습니다")

    token = create_access_token({"user_id": user["id"]})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/summarize")
def summarize(req: SummarizeRequest, user_id: int = Depends(get_current_user)):
    summary = call_ai(req.text)

    conn = get_db()
    conn.execute(
        "INSERT INTO summaries (user_id, source_text, summary, created_at) VALUES (?, ?, ?, ?)",
        (user_id, req.text, summary, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()

    return {"summary": summary}


@app.get("/summaries")
def get_summaries(user_id: int = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        "SELECT id, source_text, summary, created_at FROM summaries WHERE user_id = ? ORDER BY id DESC",
        (user_id,),
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/posts")
def create_post(req: PostCreateRequest, user_id: int = Depends(get_current_user)):
    conn = get_db()
    conn.execute(
        "INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)",
        (user_id, req.title, req.content, datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()
    return {"message": "게시물이 성공적으로 생성되었습니다"}

@app.get("/posts")
def get_posts():
    conn=get_db()
    rows=conn.execute(
        "SELECT id, user_id, title, content, created_at FROM posts ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/translate")
def translate(req: TranslateRequest, user_id: int = Depends(get_current_user)):
    result = call_ai_translate(req.text, req.target_language)

    return {"translated_text": result}