import React from "react";
import { formatDayName, owmIconToEmoji } from "../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faCloudRain,
  faBolt,
  faSnowflake,
  faSmog,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

export default function ForecastRow({ forecast }) {
  if (!forecast?.length) return null;
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
  return (
    <div className="card">
      <div className="section-title">
        5-Day Forecast
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Daily summary</span>
      </div>
      <div className="forecast-row">
        {forecast.map((day) => (
          <div key={day.date} className="forecast-day">
            <div className="day-name">{formatDayName(day.date)}</div>
            <div className="day-icon"> <FontAwesomeIcon
                icon={WEATHER_ICONS[day.icon] || faCloud}
              /></div>
            <div className="day-temps">
              {day.maxTemp}°
              <span className="day-min"> / {day.minTemp}°</span>
            </div>
            {day.rainChance > 0 && (
              <div style={{ fontSize: 11, color: "#3b82f6", marginTop: 4 }}>
                <FontAwesomeIcon icon={faDroplet} />  {day.rainChance}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
