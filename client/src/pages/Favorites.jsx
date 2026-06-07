import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { favoritesAPI } from "../utils/api";
import { useWeather } from "../context/WeatherContext";
import { owmIconToEmoji } from "../utils/helpers";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCity,
  faDroplet,
  faWind,
  faXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherMap, setWeatherMap] = useState({});
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
  const refreshFavorites = () => {
    loadFavorites();
  };

  window.addEventListener("favoritesUpdated", refreshFavorites);

  return () => {
    window.removeEventListener("favoritesUpdated", refreshFavorites);
  };
}, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data);
      // Fetch weather for each favorite
      const map = {};
      await Promise.all(
        res.data.map(async (fav) => {
          try {
            const w = await axios.get("/api/weather", {
              params: { city: fav.city },
            });
            map[fav.city] = w.data;
          } catch (_) {}
        })
      );
      setWeatherMap(map);
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

  const handleRemove = async (e, city) => {
    e.stopPropagation();
    await favoritesAPI.remove(city);
    setFavorites((prev) => prev.filter((f) => f.city !== city));
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
      <div className="page-header">
        <h2 className="page-title"><FontAwesomeIcon icon={faHeart} /> Favorites</h2>
        <p className="page-subtitle">
          Your saved cities — click to open on dashboard
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FontAwesomeIcon icon={faCity} /></div>
          <h3>No favorite cities yet</h3>
          <p>
            Search a city on the dashboard and tap the heart icon to add it here.
          </p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => {
            const w = weatherMap[fav.city];
            return (
              <div
                key={fav._id}
                className="fav-card"
                onClick={() => handleOpen(fav.city)}
              >
                <button
                  className="fav-remove"
                  onClick={(e) => handleRemove(e, fav.city)}
                  title="Remove"
                >
                   <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="fav-city-name">{fav.city}</div>
                <div className="fav-country">{fav.country}</div>
                {w ? (
                  <>
                    <div className="fav-temp">
                      {owmIconToEmoji(w.current.icon)} {w.current.temp}°C
                    </div>
                    <div className="fav-desc" style={{ textTransform: "capitalize" }}>
                      {w.current.description}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "var(--text-muted)",
                        display: "flex",
                        gap: 12,
                      }}
                    >
                      <span><FontAwesomeIcon icon={faDroplet} /> {w.current.humidity}%</span>
                      <span><FontAwesomeIcon icon={faWind} /> {w.current.windSpeed} km/h</span>
                    </div>
                  </>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12 }}>
                    Loading...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
