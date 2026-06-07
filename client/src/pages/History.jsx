import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { historyAPI } from "../utils/api";
import { useWeather } from "../context/WeatherContext";
import { timeAgo, owmIconToEmoji } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faTrash,
  faMagnifyingGlass,
  faCity,
  faDroplet,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await historyAPI.getAll();
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (city) => {
    await fetchWeather(city);
    navigate("/dashboard");
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all search history?")) return;
    await historyAPI.clear();
    setHistory([]);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <h2 className="page-title"> <FontAwesomeIcon icon={faClockRotateLeft} /> Search History</h2>
          <p className="page-subtitle">Your recent city searches</p>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            <FontAwesomeIcon icon={faTrash} /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
          <h3>No search history</h3>
          <p>Cities you search will appear here for quick access.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item._id}
              className="history-item"
              onClick={() => handleOpen(item.city)}
            >
              <span className="history-icon">
                {item.weatherSnapshot?.icon
                  ? owmIconToEmoji(item.weatherSnapshot.icon)
                  : <FontAwesomeIcon icon={faCity} />}
              </span>
              <div>
                <div className="history-city">{item.city}</div>
                <div className="history-time">
                  {item.country} · {timeAgo(item.createdAt)}
                </div>
              </div>
              {item.weatherSnapshot && (
                <div className="history-snap">
                  <div className="snap-temp">{item.weatherSnapshot.temp}°C</div>
                  <div
                    className="snap-desc"
                    style={{ textTransform: "capitalize" }}
                  >
                    {item.weatherSnapshot.description}
                  </div>
                  <div className="snap-desc">
                    <FontAwesomeIcon icon={faDroplet} /> {item.weatherSnapshot.humidity}%
                  </div>
                </div>
              )}
              <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
