import React, { useState, useEffect } from "react";
import { favoritesAPI } from "../../utils/api";
import { formatDate, owmIconToEmoji, aqiInfo } from "../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faDroplet,
  faWind,
  faTemperatureHalf,
  faSun,
  faLungs,
  faUmbrella,
  // faSun,
  faMoon,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faCloudRain,
  faBolt,
  faSnowflake,
  faSmog,
} from "@fortawesome/free-solid-svg-icons";

export default function CurrentWeather({ data }) {
  const [isFav, setIsFav] = useState(false);
  const WEATHER_ICONS = {
  "01d": faSun,
  "01n": faMoon,

  "02d": faCloudSun,
  "02n": faCloudMoon,

  "03d": faCloud,
  "03n": faCloud,

  "04d": faCloud,
  "04n": faCloud,

  "09d": faCloudRain,
  "09n": faCloudRain,

  "10d": faCloudRain,
  "10n": faCloudRain,

  "11d": faBolt,
  "11n": faBolt,

  "13d": faSnowflake,
  "13n": faSnowflake,

  "50d": faSmog,
  "50n": faSmog,
};

  useEffect(() => {
    favoritesAPI
      .check(data.city)
      .then((res) => setIsFav(res.data.isFavorite))
      .catch(() => {});
  }, [data.city]);

  const toggleFav = async () => {
  try {
    if (isFav) {
      await favoritesAPI.remove(data.city);
      setIsFav(false);
    } else {
      await favoritesAPI.add({
        city: data.city,
        country: data.country,
        lat: data.coord?.lat,
        lon: data.coord?.lon,
      });

      setIsFav(true);

      // notify other pages
      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  } catch (e) {
    console.error(e);
  }
};

  const { current } = data;
  const aqi = aqiInfo(current.aqi);

  return (
    <div className="weather-hero">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="city-name">{data.city}{data.country ? `, ${data.country}` : ""}</div>
          <div className="city-date">{formatDate()}</div>
        </div>
        <button className="heart-btn" onClick={toggleFav} title={isFav ? "Remove from favorites" : "Add to favorites"}>
          <FontAwesomeIcon
  icon={faHeart}
  style={{
    color: isFav ? "#ef4444" : "#cbd5e1",
    fontSize: "20px",
  }}
/>
        </button>
      </div>

      <div className="weather-main">
        <div>
          <div className="temp-display">{current.temp}<sup>°C</sup></div>
          <div className="weather-desc" style={{ textTransform: "capitalize" }}>
            {current.description}
          </div>
        </div>
        <div className="weather-icon-big"><FontAwesomeIcon
    icon={WEATHER_ICONS[current.icon] || faCloud}
  /></div>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <span className="stat-icon"><FontAwesomeIcon icon={faDroplet} /></span>
          <div>
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{current.humidity}%</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><FontAwesomeIcon icon={faWind} /></span>
          <div>
            <span className="stat-label">Wind</span>
            <span className="stat-value">{current.windSpeed} km/h</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><FontAwesomeIcon icon={faTemperatureHalf} /></span>
          <div>
            <span className="stat-label">Feels like</span>
            <span className="stat-value">{current.feelsLike}°C</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><FontAwesomeIcon icon={faSun} /></span>
          <div>
            <span className="stat-label">UV Index</span>
            <span className="stat-value" style={{ color: current.uvIndex >= 8 ? "#ff6b6b" : "inherit" }}>
              {current.uvIndex >= 8 ? "High" : current.uvIndex >= 5 ? "Moderate" : "Low"} ({current.uvIndex})
            </span>
          </div>
        </div>
        {aqi && (
          <div className="stat-item">
            <span className="stat-icon"><FontAwesomeIcon icon={faLungs} /></span>
            <div>
              <span className="stat-label">Air Quality</span>
              <span className="stat-value" style={{ color: aqi.color }}>
                {aqi.label}
              </span>
            </div>
          </div>
        )}
        {current.rainChance > 0 && (
          <div className="stat-item">
            <span className="stat-icon"><FontAwesomeIcon icon={faUmbrella} /></span>
            <div>
              <span className="stat-label">Rain chance</span>
              <span className="stat-value">{current.rainChance}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
