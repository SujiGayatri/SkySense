import axios from "axios";

const API_KEY = process.env.GEO_URL; 

export async function getWeatherByCity(city) {
  const { data } = await axios.get(
    "https://api.weatherapi.com/v1/forecast.json",
    {
      params: {
        key: API_KEY,
        q: city,
        days: 7,
        aqi: "yes",
        alerts: "yes",
      },
    }
  );

  return {
    city: data.location.name,
    current: {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      condition: data.current.condition.text,
    },
    forecast: data.forecast.forecastday.map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      rainChance: day.day.daily_chance_of_rain,
      condition: day.day.condition.text,
    })),
  };
}