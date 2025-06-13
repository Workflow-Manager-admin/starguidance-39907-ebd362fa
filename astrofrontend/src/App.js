import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function ZodiacSVG({ sign, size = 80 }) {
  const map = {
    Aries: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="42" cy="42" r="40" fill="#E6E6FA"/><path d="M42 62Q46 44 59 23Q62 18 54 18Q48 19 46 35M42 62Q38 44 25 23Q22 18 30 18Q36 19 38 35" stroke="#9370DB" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ), Taurus: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="42" cy="60" r="14" fill="#E6E6FA"/><ellipse cx="29" cy="34" rx="13" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/><ellipse cx="55" cy="34" rx="13" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Gemini: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <rect x="28" y="16" width="8" height="52" rx="3" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/><rect x="48" y="16" width="8" height="52" rx="3" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
        <ellipse cx="42" cy="22" rx="12" ry="4" fill="none" stroke="#9370DB" strokeWidth="2.5"/><ellipse cx="42" cy="62" rx="12" ry="4" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Cancer: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="32" cy="52" r="10" fill="none" stroke="#9370DB" strokeWidth="2.5"/><circle cx="52" cy="32" r="10" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <circle cx="32" cy="52" r="3" fill="#9370DB"/><circle cx="52" cy="32" r="3" fill="#9370DB"/>
      </svg>
    ), Leo: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="60" cy="53" r="13" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
        <path d="M60 66Q25 78 26 36Q25 14 48 14Q65 18 60 36" stroke="#9370DB" fill="none" strokeWidth="2.5"/>
      </svg>
    ), Virgo: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 60V24Q26 14 36 14Q46 14 46 36V60" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <path d="M46 60Q50 58 56 50T58 30Q58 14 45 24" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Libra: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <ellipse cx="42" cy="40" rx="18" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/><rect x="20" y="50" width="44" height="7" rx="3.5" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Scorpio: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 60V24Q26 14 36 14Q46 14 46 36V60M46 60Q58 58 57 50M57 50L68 40M57 50L67 60" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Sagittarius: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <line x1="22" y1="62" x2="64" y2="20" stroke="#9370DB" strokeWidth="2.5"/>
        <polyline points="44,20 64,20 64,40" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Capricorn: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 44Q30 54 42 54Q54 54 54 44Q54 34 42 34Q34 34 34 26V20" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <circle cx="26" cy="20" r="4" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Aquarius: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <polyline points="18,48 30,38 42,48 54,38 66,48" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <polyline points="18,62 30,52 42,62 54,52 66,62" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ), Pisces: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M22 22Q42 36 62 22" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <path d="M22 62Q42 48 62 62" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <line x1="42" y1="18" x2="42" y2="66" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
  };
  if (!sign || !(sign in map)) return null;
  return <span className="zodiac-illustration">{map[sign]}</span>;
}

// PUBLIC_INTERFACE
function UserInputForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [question, setQuestion] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !date || !place) return;
    onSubmit({ name, date, place, question });
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="form-label">Name</div>
      <input
        type="text"
        maxLength="30"
        spellCheck="false"
        placeholder="e.g. Alice"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="form-label">Date of Birth</div>
      <input
        type="date"
        required
        value={date}
        min="1900-01-01"
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="form-label">Birthplace (City, Country)</div>
      <input
        type="text"
        maxLength="60"
        spellCheck="false"
        placeholder="e.g. Paris, France"
        required
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />

      <div className="form-label">What guidance do you seek? (Optional)</div>
      <input
        type="text"
        maxLength="80"
        spellCheck="true"
        placeholder="Relationship, career, etc..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button className="button" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Reveal My Horoscope"}
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
function ResultPanel({ zodiac, zodiacDate, horoscope, aiAdvice, location }) {
  return (
    <div className="result-section" tabIndex={0} aria-live="polite">
      <div className="result-title">Your Zodiac Sign</div>
      <ZodiacSVG sign={zodiac} size={70} />
      <div style={{ fontWeight: 500, fontSize: "1.18rem", marginTop: 6 }}>
        {zodiac || "—"}
        <span style={{ fontSize: "0.92rem", color: "#9370DB", marginLeft: 8 }}>
          {zodiacDate ? `(${zodiacDate})` : ""}
        </span>
      </div>
      <hr />
      <div className="result-title">Today's Horoscope</div>
      <div style={{ marginBottom: 7 }}>{horoscope || <>&mdash;</>}</div>
      <div style={{ fontSize: "0.99rem", marginTop: 9, opacity: 0.80 }}>
        <b>Birthplace:</b> {location?.city ? (
          <span>{location.city}{location.country ? `, ${location.country}` : ""}</span>
        ) : (
          <>—</>
        )}
      </div>
      <hr />
      <div className="result-title">Personalized Guidance</div>
      <div>{aiAdvice || <span style={{ color: "#b0a6dc" }}>Ask a question for custom advice.</span>}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  // State for form & API results
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  async function handleUserSubmit(userInput) {
    setLoading(true);
    setError("");
    setResults(null);
    try {
      // Send to backend API
      const resp = await fetch(
        "http://localhost:5000/api/horoscope",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInput)
        }
      );
      if (!resp.ok) throw new Error("Server error");
      const data = await resp.json();
      setResults(data);
    } catch (err) {
      setError("Error: Unable to fetch your horoscope. Please try again.");
    }
    setLoading(false);
  }

  // Main render
  return (
    <div className="app">
      <div className="navbar">
        <span className="logo">
          <svg className="logo-astro" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#E6E6FA" />
            <circle cx="32" cy="32" r="13" fill="#D8BFD8" />
            <circle cx="32" cy="25" r="2.9" fill="#9370DB" />
          </svg>
          <span style={{ color: "#9370DB" }}>StarGuidance</span>
        </span>
      </div>
      <main>
        <section className="container" aria-label="Enter birth details">
          <div className="section-title">Discover Your Stars</div>
          <p style={{ color: "#7a6692", marginBottom: "18px" }}>
            Enter your birth details to receive your daily horoscope and personalized guidance.
          </p>
          <UserInputForm onSubmit={handleUserSubmit} loading={loading} />
        </section>
        {error && (
          <div className="container" style={{ background: "#fce0ea", color: "#b42444" }}>
            <b>Error:</b> {error}
          </div>
        )}
        {results && (
          <section className="container">
            <ResultPanel
              zodiac={results.zodiac_sign}
              zodiacDate={results.zodiac_range}
              horoscope={results.horoscope}
              aiAdvice={results.ai_guidance}
              location={results.location}
            />
          </section>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
