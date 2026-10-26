# Myra AI - EdWorld Co. Study Buddy 🐻

> Friendly, grounded, empathetic AI study buddy for students, custom-tailored using the **4-Level Customization Framework** without pre-training from scratch.

---

## 4-Level Customization Architecture

| Level | Feature | What it does | Effort | Location |
|---|---|---|---|---|
| **Level 1** | **System Prompt** | Sets Myra's persona (friendly teddy bear 🐻 in a hoodie), 5 core features, pedagogical step-by-step doubt solver, and safety rules. | Free, Day 1 | `prompts/myra_system.txt` |
| **Level 2** | **RAG on Syllabus** | Chunks textbook content into 300–500 word passages and indexes them into Chroma vector DB. Answers strictly from syllabus notes or admits when unsure. | Weeks 1-2 | `data/syllabus/`, `scripts/ingest.py`, `vectordb/` |
| **Level 3** | **Memory & Progress** | SQLite student tracking. Generates **1-question-at-a-time quizzes**, stores quiz scores, and reports strong & weak topics with 3 next actions. | Weeks 2-4 | `students.db`, `/quiz`, `/score`, `/progress/{student_id}` |
| **Level 4** | **Fine-Tuning & Quality Benchmark** | Formats teacher-reviewed Q&A pairs into JSONL (`{"messages": [...]}`) for LoRA or API fine-tuning. Evaluates 100 benchmark student questions. | Month 2+ | `tests/questions.jsonl`, `scripts/generate_finetune_data.py`, `scripts/test_eval.py` |

---

## Quickstart

### 1. Prerequisites & Setup

```bash
cd myra-ai

# Create virtual environment and install dependencies
pip install -r requirements.txt
# Or with uv:
uv pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
```

### 2. Ingest Syllabus Data into Chroma Vector DB (Level 2 RAG)

```bash
python scripts/ingest.py
```
This processes all syllabus files in `data/syllabus/` (Class 10 Maths, Class 10 Science, Class 12 Maths, Class 12 Physics, Class 12 Computer Science) into Chroma DB (`vectordb/`).

### 3. Run the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

- **Web Chat UI**: [http://localhost:8000/](http://localhost:8000/)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## Running Quality Checks (Level 4 Benchmark)

Run the 100-question student benchmark to audit tone, pedagogical doubt steps, grounding, and formatting:

```bash
python scripts/create_test_questions.py
python scripts/test_eval.py
```

To export gold-standard teacher-reviewed training pairs for fine-tuning:
```bash
python scripts/generate_finetune_data.py
```

---

## Docker Deployment

To build and run in Docker:

```bash
docker compose up --build -d
```

---

## API Endpoints

### 1. `POST /chat`
Submits a student doubt or message with conversation history.
```json
{
  "student_id": "student_101",
  "message": "Explain why square root of 2 is irrational step by step."
}
```

### 2. `POST /quiz`
Generates **exactly one question at a time** on a target syllabus topic.
```json
{
  "student_id": "student_101",
  "topic": "Real Numbers",
  "difficulty": "medium"
}
```

### 3. `POST /quiz/submit`
Submits answer letter ('A', 'B', 'C', 'D'), automatically updates progress, and returns empathetic feedback.

### 4. `POST /score`
Directly logs a score to the student's learning history:
```json
{
  "student_id": "student_101",
  "topic": "Real Numbers",
  "score": 100.0
}
```

### 5. `GET /progress/{student_id}`
Returns strong topics (avg >= 75%), weak topics (< 75%), total quiz attempts, next 3 actions, and celebration praise.

---

## EdWorld Co.
*Making learning personal, friendly, and empowering for every student.* 🐻
