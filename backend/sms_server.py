from flask import Flask, request

app = Flask(__name__)

@app.route('/fake-sms', methods=['POST'])
def receive_sms():
    data = request.json
    print(f"[SIMULATED TEXT SENT] To: {data['to']}, Message: {data['message']}")
    return '', 200

if __name__ == '__main__':
    app.run(port=9000)
