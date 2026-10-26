"""
Myra AI Backend (FastAPI)
EdWorld Co. - Friendly AI Study Buddy 🐻
Features:
- Level 1: System prompt & study buddy persona
- Level 2: Chroma vector DB RAG on syllabus
- Level 3: SQLite student progress & single-question quizzes
- Level 4: Fine-tuning export & evaluation benchmark support
"""

import os
import re
import uuid
import sqlite3
from typing import List, Dict, Any, Optional
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(
    title="Myra AI - EdWorld Co. Study Buddy",
    description="Backend microservice for Myra AI featuring RAG, SQLite student tracking, quizzes, and study guidance.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database
DB_PATH = BASE_DIR / "students.db"
def get_db():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Create schema
with get_db() as db_conn:
    db_conn.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            topic TEXT NOT NULL,
            score REAL NOT NULL,
            ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db_conn.execute("""
        CREATE TABLE IF NOT EXISTS quiz_sessions (
            question_id TEXT PRIMARY KEY,
            student_id TEXT NOT NULL,
            topic TEXT NOT NULL,
            question TEXT NOT NULL,
            correct_option TEXT NOT NULL,
            explanation TEXT NOT NULL,
            difficulty TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db_conn.commit()

# Load System Prompt
PROMPT_PATH = BASE_DIR / "prompts" / "myra_system.txt"
if PROMPT_PATH.exists():
    with open(PROMPT_PATH, "r", encoding="utf-8") as f:
        SYSTEM_PROMPT = f.read()
else:
    SYSTEM_PROMPT = (
        "You are Myra, the friendly AI study buddy from EdWorld Co. Your mascot is a teddy bear in a hoodie. "
        "Explain step-by-step in simple English. End doubts with: 'Does this make sense? Want a practice question?'"
    )

# Chroma Vector DB
VECTORDB_DIR = BASE_DIR / "vectordb"
try:
    import chromadb
    chroma_client = chromadb.PersistentClient(path=str(VECTORDB_DIR))
    syllabus_collection = chroma_client.get_or_create_collection("syllabus")
except Exception as e:
    print(f"Warning: Chroma initialization failed ({e}). Running in fallback mode.")
    syllabus_collection = None


# Models
class AskRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    message: str = Field(..., description="Student's message or doubt")
    history: List[Dict[str, str]] = Field(default=[], description="Previous conversation turns")

class ScoreRequest(BaseModel):
    student_id: str
    topic: str
    score: float = Field(..., ge=0.0, le=100.0, description="Quiz score percentage (0-100)")
    answer: Optional[str] = None

class QuizRequest(BaseModel):
    student_id: str
    topic: str = Field(..., description="Syllabus chapter or topic for quiz")
    difficulty: str = Field(default="medium", description="easy, medium, or hard")

class QuizAnswerSubmission(BaseModel):
    student_id: str
    question_id: str
    selected_option: str  # e.g., 'A', 'B', 'C', 'D'


def retrieve_syllabus_context(query: str, n_results: int = 3) -> str:
    """Retrieves top matches from Chroma DB."""
    if syllabus_collection is None:
        return "No vector database connection available."
    try:
        results = syllabus_collection.query(query_texts=[query], n_results=n_results)
        documents = results.get("documents", [[]])[0]
        if not documents:
            return "No matching syllabus notes found."
        return "\n---\n".join(documents)
    except Exception as e:
        return f"Error retrieving syllabus: {str(e)}"

def generate_myra_reply(system_prompt: str, context: str, history: List[Dict[str, str]], message: str) -> str:
    """Generates response using Claude, Gemini, or intelligent study buddy fallback."""
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    full_system = f"{system_prompt}\n\n{context}"

    # 0. Try Fine-Tuned Model (Level 4 LoRA checkpoint)
    try:
        from app.model_loader import generate_finetuned_reply
        finetuned_reply = generate_finetuned_reply(
            message=message,
            system_prompt=system_prompt,
            context=context,
            history=history
        )
        if finetuned_reply:
            return finetuned_reply
    except Exception as e:
        print(f"Fine-tuned model check bypassed: {e}")

    # 1. Try Anthropic Claude
    if anthropic_key and anthropic_key != "your-key-here":
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=anthropic_key)
            model_name = os.getenv("MODEL", "claude-3-5-sonnet-20241022")
            response = client.messages.create(
                model=model_name,
                max_tokens=800,
                system=full_system,
                messages=history + [{"role": "user", "content": message}],
            )
            return response.content[0].text
        except Exception as e:
            print(f"Anthropic API call error: {e}")

    # 2. Try Google Gemini
    if gemini_key and gemini_key != "your-gemini-key-here":
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            chat_prompt = f"System:\n{full_system}\n\nUser Question:\n{message}"
            res = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=chat_prompt
            )
            return res.text
        except Exception as e:
            print(f"Gemini API call error: {e}")

    # 3. Built-in Study Buddy Fallback Engine
    # Provides grounded, empathetic step-by-step educational answers adhering strictly to Myra's guidelines
    msg_lower = message.lower().strip()

    if any(q in msg_lower for q in ["hello", "hi", "hey"]):
        return "Hi! I'm Myra, your study buddy from EdWorld Co. 🐻 What are we learning today: a doubt, a study plan, a quiz, or exam prep?"

    if "real number" in msg_lower or "fundamental theorem" in msg_lower:
        return (
            "The Fundamental Theorem of Arithmetic states that every composite number can be uniquely factored into prime numbers.\n\n"
            "Here is how it works step-by-step:\n"
            "1. Take any composite number like 24.\n"
            "2. Break it into its smallest prime factors: 24 = 2 x 2 x 2 x 3 = 2^3 x 3.\n"
            "3. No matter what order you divide in, the set of prime factors is always identical!\n\n"
            "Quick Formula: For two positive numbers a and b, HCF(a, b) x LCM(a, b) = a x b.\n\n"
            "Does this make sense? Want a practice question?"
        )

    if "irrational" in msg_lower or "root 2" in msg_lower or "sqrt 2" in msg_lower:
        return (
            "An irrational number is a number that cannot be written as a fraction p/q of integers.\n\n"
            "Steps to prove √2 is irrational (proof by contradiction):\n"
            "1. Assume √2 is rational: √2 = a/b where a and b are co-prime integers.\n"
            "2. Square both sides: 2 = a^2 / b^2, meaning a^2 = 2b^2. So 2 divides a.\n"
            "3. Let a = 2c, then (2c)^2 = 2b^2, which simplifies to b^2 = 2c^2. So 2 also divides b.\n"
            "4. Since both a and b are divisible by 2, they are not co-prime. This contradicts our assumption!\n\n"
            "Therefore, √2 must be irrational.\n\n"
            "Does this make sense? Want a practice question?"
        )

    if "polynomial" in msg_lower or "quadratic" in msg_lower or "zeroes" in msg_lower:
        return (
            "The zeroes of a quadratic polynomial ax^2 + bx + c are the x-values where the polynomial equals zero.\n\n"
            "Key Relationships:\n"
            "1. Sum of zeroes (alpha + beta) = -b / a\n"
            "2. Product of zeroes (alpha x beta) = c / a\n\n"
            "Quick Example: For x^2 - 5x + 6 = 0, sum = -(-5)/1 = 5, and product = 6/1 = 6. The zeroes are 2 and 3!\n\n"
            "Does this make sense? Want a practice question?"
        )

    if "chemical reaction" in msg_lower or "combination" in msg_lower or "redox" in msg_lower:
        return (
            "A chemical reaction transforms reactants into new products by breaking and reforming chemical bonds.\n\n"
            "Main Types:\n"
            "1. Combination: Two reactants make one product (e.g., CaO + H2O -> Ca(OH)2 + Heat).\n"
            "2. Decomposition: One substance breaks down using heat, electricity, or light.\n"
            "3. Displacement: A more reactive metal displaces a less reactive one (e.g., Fe + CuSO4 -> FeSO4 + Cu).\n"
            "4. Double Displacement: Ions exchange to form a precipitate (e.g., Na2SO4 + BaCl2 -> BaSO4 + 2NaCl).\n"
            "5. Redox: Oxidation is gaining oxygen; reduction is losing oxygen.\n\n"
            "Does this make sense? Want a practice question?"
        )

    if "stack" in msg_lower or "queue" in msg_lower or "data structure" in msg_lower:
        return (
            "A Stack is a LIFO (Last-In-First-Out) linear data structure where elements are pushed and popped from the TOP.\n\n"
            "Core Operations:\n"
            "1. Push: Adds an item to top (raises Stack Overflow if full).\n"
            "2. Pop: Removes item from top (raises Stack Underflow if empty).\n"
            "3. Peek: Views top item without removing it.\n\n"
            "Quick Example: A stack of cafeteria plates—the last plate put on top is the first one taken!\n\n"
            "Does this make sense? Want a practice question?"
        )

    if "study plan" in msg_lower or "timetable" in msg_lower or "schedule" in msg_lower:
        return (
            "I would love to build you a personalized study plan! 🐻\n\n"
            "To make it fit your exact schedule, please share:\n"
            "1. Your class or grade (e.g., Class 10 or 12)\n"
            "2. Target subjects and exam date\n"
            "3. How many daily study hours you have available\n"
            "4. Your top 2 weak topics that need extra revision\n\n"
            "Once you reply, I will structure a clear daily timetable with revision slots!"
        )

    # General grounding fallback
    if context and "No matching" not in context:
        first_doc = context.split("\n---\n")[0]
        # Cleanly extract summary sentence
        clean_doc = first_doc.replace("\n", " ").strip()
        summary = clean_doc[:300] + "..." if len(clean_doc) > 300 else clean_doc
        return (
            f"Here is what your syllabus says about this:\n\n{summary}\n\n"
            "Remember: Break the problem into small steps, solve one part at a time, and test with numbers.\n\n"
            "Does this make sense? Want a practice question?"
        )

    return (
        "I want to make sure I give you 100% accurate information according to your syllabus. "
        "I am not entirely sure about this specific detail from our course notes. "
        "Could you check your official textbook or ask your teacher? Meanwhile, I can help you with Real Numbers, Polynomials, Chemical Reactions, or Data Structures!\n\n"
        "Does this make sense? Want a practice question?"
    )


# ENDPOINTS

@app.get("/health")
def health_check():
    from app.model_loader import is_finetuned_model_available
    return {
        "status": "healthy",
        "service": "myra-ai",
        "vector_db_ready": syllabus_collection is not None,
        "database": "sqlite3",
        "finetuned_model_available": is_finetuned_model_available(),
        "persona": "Myra 🐻 (EdWorld Co.)"
    }

@app.post("/chat")
def chat(ask: AskRequest):
    """
    Core Chat Endpoint (Level 1 System Prompt + Level 2 RAG + Level 3 Student History).
    """
    # 1. Fetch relevant syllabus chunks
    hits = retrieve_syllabus_context(ask.message, n_results=3)

    # 2. Query student progress history
    with get_db() as db:
        rows = db.execute(
            "SELECT topic, ROUND(AVG(score), 1) as avg_score, COUNT(*) as count "
            "FROM progress WHERE student_id=? GROUP BY topic",
            (ask.student_id,)
        ).fetchall()

    progress_summary = [f"{r['topic']}: {r['avg_score']}% ({r['count']} quizzes)" for r in rows]
    progress_str = ", ".join(progress_summary) if progress_summary else "none recorded yet"

    rag_context = (
        f"SYLLABUS NOTES (answer from these; say you are not sure if missing):\n{hits}\n\n"
        f"STUDENT PROGRESS RECORD: {progress_str}"
    )

    reply_text = generate_myra_reply(
        system_prompt=SYSTEM_PROMPT,
        context=rag_context,
        history=ask.history,
        message=ask.message
    )

    return {
        "reply": reply_text,
        "grounded_sources": bool(hits and "No matching" not in hits),
        "student_id": ask.student_id
    }

@app.post("/quiz")
def get_quiz_question(q: QuizRequest):
    """
    Level 3 Practice & Quizzes: Returns EXACTLY ONE question at a time.
    """
    topic_clean = q.topic.lower()
    qid = str(uuid.uuid4())[:8]

    # Pre-crafted curriculum questions based on ingested syllabus
    if "real number" in topic_clean or "hcf" in topic_clean:
        question = "What is the HCF of 6 and 20 using prime factorisation?"
        options = ["A) 2", "B) 4", "C) 10", "D) 60"]
        correct = "A"
        explanation = "6 = 2 x 3, 20 = 2^2 x 5. The smallest power of common prime factor 2 is 2^1 = 2."
    elif "polynomial" in topic_clean or "zero" in topic_clean:
        question = "If alpha and beta are the zeroes of the quadratic polynomial p(x) = ax^2 + bx + c, what is the sum of zeroes (alpha + beta)?"
        options = ["A) c / a", "B) -b / a", "C) b / a", "D) -c / a"]
        correct = "B"
        explanation = "For any quadratic polynomial ax^2 + bx + c, sum of zeroes is -b/a and product of zeroes is c/a."
    elif "chemical" in topic_clean or "reaction" in topic_clean:
        question = "Which type of reaction occurs when Quicklime (CaO) reacts with water to form Slaked Lime (Ca(OH)2) with release of heat?"
        options = ["A) Decomposition Reaction", "B) Combination Reaction", "C) Displacement Reaction", "D) Double Displacement Reaction"]
        correct = "B"
        explanation = "CaO + H2O -> Ca(OH)2 is a combination reaction because two reactants combine into a single product."
    elif "stack" in topic_clean or "data structure" in topic_clean:
        question = "Which principle does a Stack data structure follow for adding and removing elements?"
        options = ["A) FIFO (First-In-First-Out)", "B) LIFO (Last-In-First-Out)", "C) Priority Order", "D) Random Access"]
        correct = "B"
        explanation = "A stack is a LIFO data structure where the last item pushed is the first item popped."
    elif "electric" in topic_clean or "charge" in topic_clean:
        question = "According to Coulomb's Law, what happens to the electrostatic force between two charges if the distance between them is doubled?"
        options = ["A) Doubles", "B) Halves", "C) Decreases to 1/4th", "D) Increases 4 times"]
        correct = "C"
        explanation = "Coulomb's Law follows the inverse square law: F is proportional to 1/r^2. Doubling distance makes F = 1/(2^2) = 1/4th."
    else:
        question = f"Regarding {q.topic}, what is the most fundamental property to verify first?"
        options = ["A) The core definitions and boundary conditions", "B) Random substitution", "C) Skipping directly to final results", "D) None of the above"]
        correct = "A"
        explanation = "Always clarify core definitions and constraints first to solve problems accurately."

    with get_db() as db:
        db.execute(
            "INSERT INTO quiz_sessions(question_id, student_id, topic, question, correct_option, explanation, difficulty) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (qid, q.student_id, q.topic, question, correct, explanation, q.difficulty)
        )
        db.commit()

    return {
        "question_id": qid,
        "student_id": q.student_id,
        "topic": q.topic,
        "difficulty": q.difficulty,
        "question": question,
        "options": options,
        "rule": "Only one question at a time. Submit your chosen letter to /quiz/submit."
    }

@app.post("/quiz/submit")
def submit_quiz_answer(sub: QuizAnswerSubmission):
    """
    Submits student answer for the active question and updates progress automatically.
    """
    with get_db() as db:
        session = db.execute(
            "SELECT * FROM quiz_sessions WHERE question_id=?", (sub.question_id,)
        ).fetchone()

        if not session:
            raise HTTPException(status_code=404, detail="Quiz question session not found.")

        is_correct = (sub.selected_option.strip().upper() == session["correct_option"].strip().upper())
        score = 100.0 if is_correct else 0.0

        # Record progress in database
        db.execute(
            "INSERT INTO progress (student_id, topic, score) VALUES (?, ?, ?)",
            (sub.student_id, session["topic"], score)
        )
        db.execute(
            "UPDATE quiz_sessions SET status=? WHERE question_id=?",
            ("completed", sub.question_id)
        )
        db.commit()

    if is_correct:
        feedback = f"Great job! That is completely correct. 🐻 {session['explanation']} Shall we try a slightly harder one?"
    else:
        feedback = (
            f"Good try! The correct answer was {session['correct_option']}. "
            f"Here is why: {session['explanation']} Don't worry, mistakes help us learn. Want another practice question?"
        )

    return {
        "question_id": sub.question_id,
        "correct": is_correct,
        "score": score,
        "explanation": session["explanation"],
        "feedback": feedback
    }

@app.post("/score")
def record_score(s: ScoreRequest):
    """
    Directly logs a score to the student's progress record.
    """
    with get_db() as db:
        db.execute(
            "INSERT INTO progress (student_id, topic, score) VALUES (?, ?, ?)",
            (s.student_id, s.topic, s.score)
        )
        db.commit()

    # Determine feedback
    if s.score >= 80:
        feedback = "Outstanding score! You have solid mastery in this topic. 🌟"
        raise_difficulty = True
    elif s.score >= 50:
        feedback = "Good progress! With a short revision session, this can easily become a strong topic."
        raise_difficulty = False
    else:
        feedback = "Let's review the fundamental steps together. Step-by-step practice will build your confidence!"
        raise_difficulty = False

    return {
        "ok": True,
        "student_id": s.student_id,
        "topic": s.topic,
        "recorded_score": s.score,
        "feedback": feedback,
        "raise_difficulty": raise_difficulty
    }

@app.get("/progress/{student_id}")
def get_student_progress(student_id: str):
    """
    Level 3 Progress Tracking:
    Returns strong topics (>=75%), weak topics (<75%), and the next 3 recommended actions.
    """
    with get_db() as db:
        rows = db.execute(
            "SELECT topic, ROUND(AVG(score), 1) as avg_score, COUNT(*) as attempts "
            "FROM progress WHERE student_id=? GROUP BY topic ORDER BY avg_score DESC",
            (student_id,)
        ).fetchall()

    if not rows:
        return {
            "student_id": student_id,
            "message": "No practice sessions recorded yet! Start with your first quiz or doubt.",
            "strong_topics": [],
            "weak_topics": [],
            "total_quizzes": 0,
            "next_actions": [
                "Ask Myra your first doubt about Real Numbers or Chemical Reactions",
                "Take a 1-question quick diagnostic quiz",
                "Set your daily study target hours"
            ],
            "celebration": "Welcome to EdWorld Co.! Every big achievement starts with step one 🐻"
        }

    strong_topics = []
    weak_topics = []
    total_quizzes = 0

    for r in rows:
        total_quizzes += r["attempts"]
        item = {
            "topic": r["topic"],
            "avg_score": r["avg_score"],
            "attempts": r["attempts"]
        }
        if r["avg_score"] >= 75.0:
            strong_topics.append(item)
        else:
            weak_topics.append(item)

    # Next 3 actions
    next_actions = []
    if weak_topics:
        target_weak = weak_topics[0]["topic"]
        next_actions.append(f"Review core concepts of '{target_weak}' using Myra's step-by-step doubt solver")
        next_actions.append(f"Take a 3-question targeted practice quiz on '{target_weak}'")
    else:
        next_actions.append("Keep your streak alive by taking a mixed revision quiz")
        next_actions.append("Tackle a higher difficulty level in your strongest subject")

    next_actions.append("Schedule a 15-minute quick revision slot before your evening break")

    celebration = f"Awesome effort! You have completed {total_quizzes} practice quizzes so far. Keep building momentum! 🐻🎉"

    return {
        "student_id": student_id,
        "total_quizzes": total_quizzes,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics,
        "next_actions": next_actions,
        "celebration": celebration
    }


@app.get("/")
def serve_index():
    return {
        "service": "Myra AI - EdWorld Co. 🐻",
        "status": "healthy",
        "type": "Headless AI Study Buddy Microservice",
        "docs": "/docs",
        "endpoints": {
            "chat": "/chat",
            "quiz": "/quiz",
            "quiz_submit": "/quiz/submit",
            "score": "/score",
            "progress": "/progress/{student_id}",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
