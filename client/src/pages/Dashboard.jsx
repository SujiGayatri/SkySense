import React, { useEffect, useState } from "react";
import { useWeather } from "../context/WeatherContext";
import CurrentWeather from "../components/Dashboard/CurrentWeather";
import ForecastRow from "../components/Dashboard/ForecastRow";
import TravelScore from "../components/Dashboard/TravelScore";
import AlertsSummary from "../components/Dashboard/AlertsSummary";
import AISummary from "../components/Dashboard/AISummary";
import ClothingActivities from "../components/Dashboard/ClothingActivities";
import { getGreeting } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudSun,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { weatherData, loading, fetchWeather } = useWeather();
  const [slowLoad, setSlowLoad] = useState(false);

  // Load default city on first visit
  useEffect(() => {
    if (!weatherData) {
      // After 4 seconds of loading, show the wake-up message
      const timer = setTimeout(() => setSlowLoad(true), 4000);
      fetchWeather("Kakinada").finally(() => {
        clearTimeout(timer);
        setSlowLoad(false);
      });
      return () => clearTimeout(timer);
    }
  }, []);

  if (loading && !weatherData) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
        Fetching weather data...
      </p>
    </div>
  );
}
  // if (loading) {
  //   return (
  //     <div className="loading-screen">
  //       <div className="spinner" />
  //       <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", maxWidth: 300 }}>
  //         {slowLoad
  //           ? "☕ Waking up the server... first load takes ~30 seconds on free hosting. Hang tight!"
  //           : "Fetching weather data..."}
  //       </p>
  //       {slowLoad && (
  //         <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
  //           This only happens once. Subsequent loads are instant.
  //         </p>
  //       )}
  //     </div>
  //   );
  // }

  if (!weatherData) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><FontAwesomeIcon icon={faCloudSun} /></div>
        <h3>Search for a city to get started</h3>
        <p>Type a city name in the search bar above</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>
          {getGreeting()},{" "}
           <FontAwesomeIcon
            icon={faSun}
            style={{
              color: "#f59e0b",
              marginLeft: 6,
            }}
          />
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
          Here's your weather overview
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <CurrentWeather data={weatherData} />
          <ForecastRow forecast={weatherData.forecast} />
          <AISummary summary={weatherData.aiSummary} />
        </div>
        <div className="dashboard-right">
          <TravelScore travelScore={weatherData.travelScore} />
          <ClothingActivities
            clothing={weatherData.clothing}
            activities={weatherData.activities}
          />
          <AlertsSummary alerts={weatherData.alerts} />
        </div>
      </div>
    </div>
  );
}
