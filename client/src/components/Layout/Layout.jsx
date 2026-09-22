import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useWeather } from "../../context/WeatherContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faTriangleExclamation,
  faClock,
  faMagnifyingGlass,
  faLocationDot,
  faCloudSun,
  faXmark,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

const NAV = [
  { to: "/dashboard", icon: <FontAwesomeIcon icon={faHouse} />, label: "Dashboard" },
  { to: "/favorites", icon: <FontAwesomeIcon icon={faHeart} />, label: "Favorites" },
  { to: "/alerts", icon: <FontAwesomeIcon icon={faTriangleExclamation} />, label: "Alerts" },
  { to: "/history", icon: <FontAwesomeIcon icon={faClock} />, label: "History" },
  { to: "/ai-chat", icon: <FontAwesomeIcon icon={faRobot} />, label: "AI Chat" },
];


const POPULAR_CITIES = [
  "Vijayawada", "Hyderabad", "Bangalore", "Chennai",
  "Mumbai", "Delhi", "Pune", "Kolkata",
];

export default function Layout({ children }) {
  const { fetchWeather, error, setError } = useWeather();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();

  // Filter suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          // ✅ country_code=IN filters to India only — no more Arabic city names
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json&country_code=IN`
        );
        const data = await res.json();
        const results = data.results || [];

        // Deduplicate by lowercase name
        const seen = new Set();
        const unique = results
          .filter((r) => {
            const key = r.name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 5)
          .map((r) => ({
            name: r.name,
            state: r.admin1 || "",   // state name e.g. "Andhra Pradesh"
            id: r.id,                // unique numeric id — no duplicate key error
          }));

        setSuggestions(unique);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (city) => {
    if (!city.trim()) return;
    setQuery(city);
    setShowSuggestions(false);
    const data = await fetchWeather(city);
    if (data) navigate("/dashboard");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(query);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><FontAwesomeIcon icon={faCloudSun} style={{ color: "white" }} /></div>
          <div className="logo-text">
            <h1>
              <span style={{ color: "var(--teal-dark)" }}>Sky</span>
              <span style={{ color: "var(--teal-mid)" }}>Sense</span>
            </h1>
            <p>Smart Weather Intelligence</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="search-bar" ref={searchRef}>
            <span className="search-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
            <input
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="suggestion-item"
                    onMouseDown={() => handleSearch(s.name)}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ marginRight: 8, color: "var(--teal-mid)" }}
                    />
                    {s.name}
                    {s.state && (
                      <span style={{ marginLeft: 6, fontSize: 11, color: "var(--text-muted)" }}>
                        {s.state}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <FontAwesomeIcon icon={faTriangleExclamation} />  {error}{" "}
            <span
              style={{ cursor: "pointer", marginLeft: 8 }}
              onClick={() => setError(null)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </span>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
