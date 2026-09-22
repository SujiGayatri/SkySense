import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { weatherAPI, historyAPI } from "../utils/api";

const WeatherContext = createContext(null);

const CACHE_KEY = "vijayawadaWeather";
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCity, setCurrentCity] = useState("Vijayawada");

  // Load cached Vijayawada weather immediately
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);

        // Use cache only if it is less than 15 minutes old
        if (Date.now() - timestamp < CACHE_DURATION) {
          setWeatherData(data);
          setCurrentCity(data.city);
        }
      }
    } catch (err) {
      console.error("Failed to load cached weather:", err);
    }
  }, []);

  const fetchWeather = useCallback(async (cityOrCoords) => {
    setLoading(true);
    setError(null);

    try {
      let params;

      if (typeof cityOrCoords === "string") {
        params = { city: cityOrCoords };
      } else {
        params = {
          lat: cityOrCoords.lat,
          lon: cityOrCoords.lon,
        };
      }

      const res = await weatherAPI.get(params);

      setWeatherData(res.data);
      setCurrentCity(res.data.city);

      // Cache default Vijayawada weather
      if (
        typeof cityOrCoords === "string" &&
        cityOrCoords.toLowerCase() === "vijayawada"
      ) {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: res.data,
            timestamp: Date.now(),
          })
        );
      }

      // Save to history
      historyAPI
        .add({
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
        })
        .catch(() => {});

      return res.data;
    } catch (err) {
      const msg =
        typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : typeof err.message === "string"
          ? err.message
          : "Failed to fetch weather";

      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        currentCity,
        fetchWeather,
        setError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);

  if (!ctx) {
    throw new Error("useWeather must be used inside WeatherProvider");
  }

  return ctx;
}