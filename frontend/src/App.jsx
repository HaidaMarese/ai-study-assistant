import { useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const handleStudy = async () => {

    if (!notes.trim()) {
      alert("Please enter study notes first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/study`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ notes })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setResult(data);

    } catch (error) {
      console.error("Error:", error);

      alert(
        "Cannot connect to backend. Make sure Flask backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="overlay">

        <div className="container">

          <h1>AI Study Assistant</h1>

          <p className="subtitle">
            Transform your study notes into summaries,
            flashcards, and quizzes using AI.
          </p>

          <textarea
            rows="10"
            placeholder="Paste your study notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button onClick={handleStudy} disabled={loading}>
            {loading ? "Generating..." : "Generate Study Help"}
          </button>

          {result && (
            <div className="results">

              <h2>Summary</h2>

              <div className="card">
                <p>{result.summary}</p>
              </div>

              <h2>Flashcards</h2>

              {result.flashcards?.map((card, index) => (
                <div key={index} className="card">

                  <strong>Q:</strong> {card.question}

                  <br />

                  <strong>A:</strong> {card.answer}

                </div>
              ))}

              <h2>Quiz</h2>

              {result.quiz?.map((q, index) => (
                <div key={index} className="card">

                  <strong>Question:</strong> {q.question}

                  <br />

                  <strong>Answer:</strong> {q.answer}

                </div>
              ))}

            </div>
          )}

          <footer className="footer">
            <p>
              © 2026 Haida Makouangou | AI Study Assistant
            </p>
          </footer>

        </div>

      </div>
    </div>
  );
}

export default App;

