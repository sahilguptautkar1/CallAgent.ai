import sys
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

# Ensure parent directory is in the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from agent.firebase_service import update_kb

# ------------------------
# Firebase Initialization
# ------------------------
cred_path = os.path.join(os.path.dirname(__file__), 'firebase_config.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
       'databaseURL': 'https://human-in-loop-ai-supervisor-default-rtdb.firebaseio.com/'
    })

# ------------------------
# Flask App Setup
# ------------------------

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# ------------------------
# Simulated Webhook Sender
# ------------------------
def send_webhook(to: str, message: str):
    webhook_url = "http://localhost:9000/fake-sms"
    try:
        res = requests.post(webhook_url, json={"to": to, "message": message})
        if res.status_code == 200:
            print(f"[Webhook SENT] To: {to}, Message: {message}")
        else:
            print(f"[Webhook FAILED] Status: {res.status_code}, Body: {res.text}")
    except Exception as e:
        print(f"[Webhook ERROR] {e}")

# ------------------------
# Supervisor Respond Endpoint
# ------------------------
@app.route('/respond', methods=['POST'])
def respond():
    try:
        data = request.json
        req_id = data.get('request_id')
        answer = data.get('answer')

        if not req_id or not answer:
            return jsonify({'error': 'Missing request_id or answer'}), 400

        ref = db.reference(f'help_requests/{req_id}')
        request_data = ref.get()
        if not request_data:
            return jsonify({'error': 'Request not found'}), 404

        ref.update({
            'status': 'resolved',
            'answer': answer
        })

        update_kb(request_data['question'], answer)
        send_webhook(request_data['callerId'], answer)

        return jsonify({'status': 'ok'})
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({'error': str(e)}), 500

# ------------------------
# Run Server
# ------------------------
if __name__ == '__main__':
    app.run(port=5000)