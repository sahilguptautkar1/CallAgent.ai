import firebase_admin
from firebase_admin import credentials, db
import uuid
from datetime import datetime
import os

CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', 'backend', 'firebase_config.json')
cred = credentials.Certificate(os.path.abspath(CONFIG_PATH))

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://human-in-loop-ai-supervisor-default-rtdb.firebaseio.com/'
    })

def create_help_request(question: str, caller_id: str):
    request_id = str(uuid.uuid4())
    ref = db.reference('help_requests/' + request_id)
    ref.set({
        'question': question,
        'callerId': caller_id,
        'status': 'pending',
        'answer': '',
        'createdAt': datetime.utcnow().isoformat()
    })

def get_knowledge_base():
    return db.reference('knowledge_base').get() or {}

def update_kb(question: str, answer: str):
    key = str(uuid.uuid4())
    db.reference('knowledge_base/' + key).set({
        'question': question,
        'answer': answer
    })
