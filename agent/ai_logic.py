from agent.firebase_service import get_knowledge_base

def handle_question(question: str) -> str:
    kb = get_knowledge_base()
    question = question.strip().lower()
    for entry in kb.values():
        if entry.get('question', '').strip().lower() == question:
            return entry.get('answer', '')
    return ""
