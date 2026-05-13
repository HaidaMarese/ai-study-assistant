import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}"
}


@app.route("/")
def home():
    return jsonify({
        "message": "AI Study Assistant Backend is running!"
    })


@app.route("/study", methods=["POST"])
def study():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    notes = data.get("notes", "").strip()

    if not notes:
        return jsonify({"error": "Please enter notes"}), 400

    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json={"inputs": notes},
            timeout=60
        )

        result = response.json()

        if isinstance(result, list) and "summary_text" in result[0]:
            summary = result[0]["summary_text"]
        else:
            summary = notes[:300] + "..."

    except Exception as error:
        print("Backend error:", error)
        summary = notes[:300] + "..."

    flashcards = [
        {
            "question": "What is the main topic?",
            "answer": summary
        },
        {
            "question": "What should you review first?",
            "answer": "Review the key terms, definitions, and main ideas."
        }
    ]

    quiz = [
        {
            "question": "Summarize the notes in one sentence.",
            "answer": summary
        },
        {
            "question": "Why are these notes important?",
            "answer": "They help you understand and remember the key concepts."
        }
    ]

    return jsonify({
        "summary": summary,
        "flashcards": flashcards,
        "quiz": quiz
    })


if __name__ == "__main__":
    app.run(debug=True)