import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { favoritesAPI, weatherAPI } from "../utils/api";
import { useWeather } from "../context/WeatherContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBuilding,
  faDroplet,
  faWind,
  faXmark,
  faTemperatureHalf,
  faSun, faMoon, faCloud, faCloudSun,
  faCloudMoon, faCloudRain, faBolt,
  faSnowflake, faSmog,
} from "@fortawesome/free-solid-svg-icons";

const WEATHER_ICONS = {
  "01d": faSun,    "01n": faMoon,
  "02d": faCloudSun, "02n": faCloudMoon,
  "03d": faCloud,  "03n": faCloud,
  "04d": faCloud,  "04n": faCloud,
  "09d": faCloudRain, "09n": faCloudRain,
  "10d": faCloudRain, "10n": faCloudRain,
  "11d": faBolt,   "11n": faBolt,
  "13d": faSnowflake, "13n": faSnowflake,
  "50d": faSmog,   "50n": faSmog,
};

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherMap, setWeatherMap] = useState({});
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites(); // ✅ load on mount

    const refresh = () => loadFavorites();
    window.addEventListener("favoritesUpdated", refresh);
    return () => window.removeEventListener("favoritesUpdated", refresh);
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data);

      // ✅ weatherAPI already has the correct Render URL baked in
      const map = {};
      await Promise.all(
        res.data.map(async (fav) => {
          try {
            const w = await weatherAPI.get({ city: fav.city });
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
    setWeatherMap((prev) => {
      const copy = { ...prev };
      delete copy[city];
      return copy;
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 12 }}>
          Loading your saved cities...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">
          <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444", marginRight: 10 }} />
          Favorites
        </h2>
        <p className="page-subtitle">
          Your saved cities — click any card to view on dashboard
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: 48, color: "var(--text-muted)" }} />
          </div>
          <h3>No favorite cities yet</h3>
          <p>
            Go to dashboard, search a city, and tap the{" "}
            <FontAwesomeIcon icon={faHeart} style={{ color: "#ef4444" }} />{" "}
            icon to save it here.
          </p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => {
            const w = weatherMap[fav.city];
            const icon = w ? (WEATHER_ICONS[w.current.icon] || faCloud) : null;

            return (
              <div
                key={fav._id}
                className="fav-card"
                onClick={() => handleOpen(fav.city)}
              >
                {/* Remove button */}
                <button
                  className="fav-remove"
                  onClick={(e) => handleRemove(e, fav.city)}
                  title="Remove from favorites"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

                {/* City name */}
                <div className="fav-city-name">{fav.city}</div>
                <div className="fav-country">{fav.country || ""}</div>

                {w ? (
                  <>
                    {/* Weather icon + temp */}
                    <div className="fav-temp">
                      <FontAwesomeIcon
                        icon={icon}
                        style={{ marginRight: 8, color: "var(--teal-mid)", fontSize: 28 }}
                      />
                      {w.current.temp}°C
                    </div>

                    <div className="fav-desc" style={{ textTransform: "capitalize" }}>
                      {w.current.description}
                    </div>

                    {/* Stats row */}
                    <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 16 }}>
                      <span>
                        <FontAwesomeIcon icon={faDroplet} style={{ marginRight: 4, color: "#3b82f6" }} />
                        {w.current.humidity}%
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faWind} style={{ marginRight: 4, color: "var(--teal-mid)" }} />
                        {w.current.windSpeed} km/h
                      </span>
                      <span>
                        <FontAwesomeIcon icon={faTemperatureHalf} style={{ marginRight: 4, color: "#f59e0b" }} />
                        Feels {w.current.feelsLike}°C
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                    <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
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