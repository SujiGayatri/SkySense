import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState("Vijayawada");

  const fetchWeather = useCallback(async (cityOrCoords) => {
    setLoading(true);
    setError(null);
    try {
      let params;
      if (typeof cityOrCoords === "string") {
        params = { city: cityOrCoords };
      } else {
        params = { lat: cityOrCoords.lat, lon: cityOrCoords.lon };
      }

      const res = await axios.get("/api/weather", { params });
      setWeatherData(res.data);
      setCurrentCity(res.data.city);

      // Save to history
      await axios.post("/api/history", {
        city: res.data.city,
        country: res.data.country,
        lat: res.data.coord?.lat,
        lon: res.data.coord?.lon,
        weatherSnapshot: {
          temp: res.data.current.temp,
          description: res.data.current.description,
          humidity: res.data.current.humidity,
          icon: res.data.current.icon,
        },
      });

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch weather";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WeatherContext.Provider
      value={{ weatherData, loading, error, currentCity, fetchWeather, setError }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used inside WeatherProvider");
  return ctx;
}
