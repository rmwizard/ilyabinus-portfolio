from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_messages = data.get("messages", [])
        messages = user_messages

        print("📥 Получено сообщение:", messages)

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=300,
        )

        return jsonify(response)
    
    except Exception as e:
        print("💥 Ошибка GPT:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

