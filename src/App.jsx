import { useState } from "react";
import "./App.css";

function App() {
  const [longURL, setLongURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const handleSubmit = async () => {
    setError("");
    setShortURL("");

    if (!longURL.trim()) {
      setError("→ URL required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://03a52uei0g.execute-api.us-east-2.amazonaws.com/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longURL: longURL.trim() })
      });

      const data = await response.json();
      const short = `https://03a52uei0g.execute-api.us-east-2.amazonaws.com/${data.shortCode}`;
      setShortURL(short);
      setCount(prev => prev + 1);
      setLongURL("");

    } catch (err) {
      setError("→ something broke. try again.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="wrap">
      <p className="label">Tool</p>
      <h1>URL/<br />SHORT</h1>

      <input
        className="field"
        type="text"
        placeholder="https://your-long-url.com"
        value={longURL}
        onChange={(e) => setLongURL(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "... working" : "→ Shorten"}
      </button>

      {shortURL && (
        <div className="result-block">
          <p className="result-label">Output</p>
          <a className="result-url" href={shortURL} target="_blank" rel="noreferrer">{shortURL}</a>
        </div>
      )}

      {error && <p className="err">{error}</p>}

      {count > 0 && (
        <p className="counter">{count} url{count !== 1 ? "s" : ""} shortened this session</p>
      )}
    </div>
  );
}

export default App;