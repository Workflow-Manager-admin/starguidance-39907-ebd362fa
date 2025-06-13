import React, { useState } from "react";
import "./App.css";

/**
 * Horoscope web app - all-in-browser implementation (no backend).
 * Features:
 *  - User enters: name, birth date, birth time, location
 *  - Uses OpenCage (API key) to geocode location
 *  - Computes sun sign from date
 *  - Uses Aztro API to get horoscope
 *  - All error handling is in-browser
 *  - Clean, responsive UI; mobile-friendly; modern, pastel design
 *  - All logic and fetch calls in frontend, using fetch/XHR
 */

// --- Zodiac sign calculation (Western astrology) ---
const ZODIAC_SIGNS = [
  { name: "Capricorn", start: [1, 1], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] },
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", start: [12, 22], end: [12, 31] },
];

// PUBLIC_INTERFACE
function getZodiacFromDate(isoDate) {
  // isoDate: YYYY-MM-DD
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  try {
    const [year, month, day] = isoDate.split("-").map(Number);
    for (let s of ZODIAC_SIGNS) {
      const [sm, sd] = s.start, [em, ed] = s.end;
      if (
        (month === sm && day >= sd) ||
        (month === em && day <= ed) ||
        (sm < month && month < em) ||
        (sm > em && (month > sm || month < em)) // Capricorn (year cross)
      ) {
        // e.g. May 21 - Jun 20
        const range = `${months[sm - 1]} ${sd} - ${months[em - 1]} ${ed}`;
        return { sign: s.name, range };
      }
    }
  } catch {
    return { sign: "Unknown", range: "" };
  }
  return { sign: "Unknown", range: "" };
}

// PUBLIC_INTERFACE
function ZodiacSVG({ sign, size = 80 }) {
  // Stylish pastel SVGs for all signs
  const map = {
    Aries: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="42" cy="42" r="40" fill="#E6E6FA"/>
        <path d="M42 62Q46 44 59 23Q62 18 54 18Q48 19 46 35M42 62Q38 44 25 23Q22 18 30 18Q36 19 38 35" stroke="#9370DB" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    Taurus: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="42" cy="60" r="14" fill="#E6E6FA"/>
        <ellipse cx="29" cy="34" rx="13" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <ellipse cx="55" cy="34" rx="13" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Gemini: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <rect x="28" y="16" width="8" height="52" rx="3" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
        <rect x="48" y="16" width="8" height="52" rx="3" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
        <ellipse cx="42" cy="22" rx="12" ry="4" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <ellipse cx="42" cy="62" rx="12" ry="4" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Cancer: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="32" cy="52" r="10" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <circle cx="52" cy="32" r="10" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <circle cx="32" cy="52" r="3" fill="#9370DB"/>
        <circle cx="52" cy="32" r="3" fill="#9370DB"/>
      </svg>
    ),
    Leo: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <circle cx="60" cy="53" r="13" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
        <path d="M60 66Q25 78 26 36Q25 14 48 14Q65 18 60 36" stroke="#9370DB" fill="none" strokeWidth="2.5"/>
      </svg>
    ),
    Virgo: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 60V24Q26 14 36 14Q46 14 46 36V60" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <path d="M46 60Q50 58 56 50T58 30Q58 14 45 24" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Libra: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <ellipse cx="42" cy="40" rx="18" ry="9" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <rect x="20" y="50" width="44" height="7" rx="3.5" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Scorpio: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 60V24Q26 14 36 14Q46 14 46 36V60M46 60Q58 58 57 50M57 50L68 40M57 50L67 60" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Sagittarius: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <line x1="22" y1="62" x2="64" y2="20" stroke="#9370DB" strokeWidth="2.5"/>
        <polyline points="44,20 64,20 64,40" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Capricorn: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <path d="M26 44Q30 54 42 54Q54 54 54 44Q54 34 42 34Q34 34 34 26V20" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <circle cx="26" cy="20" r="4" fill="#E6E6FA" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Aquarius: (
      <svg viewBox="0 0 84 84" width={size} height={size}>
        <polyline points="18,48 30,38 42,48 54,38 66,48" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
        <polyline points="18,62 30,52 42,62 54,52 66,62" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      </svg>
    ),
    Pisces: (
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
  const [time, setTime] = useState(""); // for further use
  const [location, setLocation] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !date || !location) return;
    onSubmit({ name, date, time, location });
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

      <div className="form-label">Time of Birth <span style={{ color: "#baa8e0", fontSize: "0.95em" }}>(optional)</span></div>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="e.g. 14:30"
      />

      <div className="form-label">Birthplace (City, Country)</div>
      <input
        type="text"
        maxLength="60"
        spellCheck="false"
        placeholder="e.g. Paris, France"
        required
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button className="btn btn-large" type="submit" disabled={loading}>
        {loading ? "Loading..." : "Reveal My Horoscope"}
      </button>
    </form>
  );
}

// --- Result display ---
function ResultPanel({ result, error }) {
  if (error)
    return (
      <div className="result-section" style={{ background: "#fce0ea", color: "#b42444" }}>
        <strong>Error:</strong> {error}
      </div>
    );
  if (!result) return null;
  return (
    <div className="result-section" tabIndex={0} aria-live="polite">
      <div className="result-title">Your Zodiac Sign</div>
      <ZodiacSVG sign={result.zodiac} size={70} />
      <div style={{ fontWeight: 500, fontSize: "1.18rem", marginTop: 6 }}>
        {result.zodiac || "—"}
        <span style={{
          fontSize: "0.92rem",
          color: "#9370DB",
          marginLeft: 8
        }}>
          {result.zodiacRange ? `(${result.zodiacRange})` : ""}
        </span>
      </div>
      <hr />
      <div className="result-title">Today&apos;s Horoscope</div>
      <div style={{ marginBottom: 7 }}>{result.horoscope || "—"}</div>
      <div style={{ fontSize: "0.99rem", marginTop: 9, opacity: 0.80 }}>
        <b>Location:</b>{" "}
        {result.city ? (
          <span>{result.city}{result.country ? `, ${result.country}` : ""}</span>
        ) : <span>—</span>}
        {typeof result.lat === "number" && typeof result.lon === "number" ? (
          <>
            {" "}<span style={{ color: "#8fa2c6", fontSize: "0.92em" }}>
              ({result.lat.toFixed(3)}, {result.lon.toFixed(3)})
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

// --- API + client logic ---

// PUBLIC_INTERFACE
async function geocodeLocation(placeStr) {
  // Geocode city/country using OpenCage
  const OPENCAGE_KEY = "71191ee3c7fd4fddbea6ddce8f773135";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(placeStr)}&key=${OPENCAGE_KEY}&limit=1&no_annotations=1`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Geocoding failed");
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      const { geometry, components } = data.results[0];
      return {
        lat: geometry.lat,
        lon: geometry.lng,
        city: components.city || components.town || components.village || "",
        country: components.country || ""
      };
    }
  } catch (e) {
    return null; // signal error
  }
  return null; // signal error
}

// PUBLIC_INTERFACE
async function fetchAztroHoroscope(zodiacSign) {
  // Fetch daily horoscope for sign from Aztro API
  // POST https://aztro.sameerkumar.website/?sign=aries&day=today
  try {
    const resp = await fetch("https://aztro.sameerkumar.website/?sign=" + zodiacSign.toLowerCase() + "&day=today", {
      method: "POST"
    });
    if (!resp.ok) throw new Error("Aztro error");
    const data = await resp.json();
    return data.description || "";
  } catch {
    return null; // signal error
  }
}

// --- Main App ---
export default function App() {
  // State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // PUBLIC_INTERFACE
  async function handleFormSubmit({ name, date, time, location }) {
    setLoading(true);
    setResult(null);
    setErrorMsg("");
    if (!name || !date || !location) {
      setErrorMsg("Please fill in name, birth date and location.");
      setLoading(false);
      return;
    }
    // 1. Geocode location
    let geo = await geocodeLocation(location);
    if (!geo) {
      setErrorMsg("Could not determine location. Please check your city/country.");
      setLoading(false);
      return;
    }
    // 2. Zodiac: derive from date
    const { sign, range } = getZodiacFromDate(date);
    if (sign === "Unknown") {
      setErrorMsg("Invalid date format. Please use YYYY-MM-DD.");
      setLoading(false);
      return;
    }
    // 3. Horoscope: fetch from Aztro
    const horoscope = await fetchAztroHoroscope(sign);
    if (!horoscope) {
      setErrorMsg("Failed to fetch your horoscope. Please try again.");
      setLoading(false);
      return;
    }
    // 4. Present result
    setResult({
      zodiac: sign,
      zodiacRange: range,
      horoscope,
      ...geo,
    });
    setLoading(false);
  }

  // UI rendering
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container" style={{ maxWidth: 560, display: "flex" }}>
          <span className="logo" style={{ color: "#9370DB" }}>
            <svg width={32} height={32} viewBox="0 0 64 64" style={{ marginRight: 12 }}>
              <circle cx="32" cy="32" r="28" fill="#E6E6FA" />
              <circle cx="32" cy="32" r="12" fill="#D8BFD8" />
              <circle cx="32" cy="26" r="3" fill="#9370DB" />
            </svg>
            StarGuidance
          </span>
        </div>
      </nav>
      <main>
        <section className="container" style={{ marginTop: 120, marginBottom: 28 }}>
          <div className="section-title" style={{ color: "#9370DB", fontSize: "1.6rem", marginBottom: 6 }}>Discover Your Stars</div>
          <p style={{ color: "#7a6692", marginBottom: "18px" }}>
            Enter your birth details to receive your daily horoscope.
          </p>
          <UserInputForm onSubmit={handleFormSubmit} loading={loading} />
        </section>
        {(errorMsg || result) && (
          <section className="container">
            <ResultPanel result={result} error={errorMsg} />
          </section>
        )}
      </main>
      <footer style={{ height: 32 }}></footer>
    </div>
  );
}
