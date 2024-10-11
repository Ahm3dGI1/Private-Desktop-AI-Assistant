from flask import Flask, request, jsonify
from flask_cors import CORS

from voice_logic.tts import tts
from voice_handler import voice_handler

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data['text']

    if not text:
        return jsonify({'message': 'No text provided'}), 400

    tts(text)

    return jsonify({'message': 'success'})


@app.route('/listen', methods=['POST'])
def listen():
    return jsonify({'message': 'success', 'text': voice_handler()})


if __name__ == '__main__':
    app.run(debug=True, port=4001)
