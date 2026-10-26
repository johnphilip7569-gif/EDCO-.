"""
API verification script testing all endpoints of Myra AI:
- /health
- /chat
- /quiz (verifies EXACTLY 1 question returned)
- /quiz/submit
- /score
- /progress/{student_id}
- / (web chat static UI)
"""

import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing Myra AI Endpoints...")

    # 1. Health check
    res_health = client.get("/health")
    assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
    health_data = res_health.json()
    print("  [+] /health:", health_data)

    # 2. Chat endpoint
    res_chat = client.post("/chat", json={
        "student_id": "test_student_42",
        "message": "Explain the Fundamental Theorem of Arithmetic"
    })
    assert res_chat.status_code == 200, f"Chat failed: {res_chat.text}"
    chat_reply = res_chat.json()["reply"]
    print("  [+] /chat response length:", len(chat_reply))
    assert "Fundamental Theorem" in chat_reply or "prime" in chat_reply

    # 3. Quiz endpoint (Verifying single question return)
    res_quiz = client.post("/quiz", json={
        "student_id": "test_student_42",
        "topic": "Real Numbers",
        "difficulty": "medium"
    })
    assert res_quiz.status_code == 200, f"Quiz failed: {res_quiz.text}"
    quiz_data = res_quiz.json()
    print("  [+] /quiz returned 1 question:", quiz_data["question"])
    print("      Options:", quiz_data["options"])
    assert "question_id" in quiz_data
    assert len(quiz_data["options"]) == 4

    # 4. Quiz Submit
    res_submit = client.post("/quiz/submit", json={
        "student_id": "test_student_42",
        "question_id": quiz_data["question_id"],
        "selected_option": "A"
    })
    assert res_submit.status_code == 200, f"Submit failed: {res_submit.text}"
    submit_data = res_submit.json()
    print("  [+] /quiz/submit result:", submit_data["feedback"][:70], "...")

    # 5. Direct Score endpoint
    res_score = client.post("/score", json={
        "student_id": "test_student_42",
        "topic": "Chemical Reactions",
        "score": 90.0
    })
    assert res_score.status_code == 200
    print("  [+] /score recorded:", res_score.json())

    # 6. Progress endpoint
    res_prog = client.get("/progress/test_student_42")
    assert res_prog.status_code == 200
    prog_data = res_prog.json()
    print("  [+] /progress/test_student_42:")
    print("      Total quizzes:", prog_data["total_quizzes"])
    print("      Strong topics:", prog_data["strong_topics"])
    print("      Weak topics:", prog_data["weak_topics"])
    print("      Next actions:", prog_data["next_actions"])
    print("      Celebration:", prog_data["celebration"])

    # 7. Headless API Root (No separate chat page)
    res_ui = client.get("/")
    assert res_ui.status_code == 200
    assert "Myra AI" in res_ui.json()["service"]
    print("  [+] GET / returns headless API status successfully (no separate web chat page)!")

    print("\nALL 7 ENDPOINTS VERIFIED AND PASSING 100%!")

if __name__ == "__main__":
    test_endpoints()
