from flask import Flask, request, jsonify
import pyttsx3

app = Flask(__name__)

engine = pyttsx3.init()


@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data['text']

    if not text:
        return jsonify({'message': 'No text provided'}), 400

    engine.say(text)
    engine.runAndWait()

    return jsonify({'message': 'success'})


@app.route('/listen', methods=['GET'])
def listen():
    return jsonify({'message': 'success'})


if __name__ == '__main__':
    app.run(debug=True, port=4001)
