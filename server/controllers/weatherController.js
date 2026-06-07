const axios = require("axios");

// ─── Open-Meteo endpoints (100% free, no API key, forever) ───────────────────
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

// ─── WMO Weather Code → human description + emoji icon ───────────────────────
function wmoToDescription(code) {
  const map = {
    0:  { desc: "Clear sky",            icon: "01d" },
    1:  { desc: "Mainly clear",         icon: "01d" },
    2:  { desc: "Partly cloudy",        icon: "02d" },
    3:  { desc: "Overcast",             icon: "04d" },
    45: { desc: "Foggy",                icon: "50d" },
    48: { desc: "Icy fog",              icon: "50d" },
    51: { desc: "Light drizzle",        icon: "09d" },
    53: { desc: "Moderate drizzle",     icon: "09d" },
    55: { desc: "Dense drizzle",        icon: "09d" },
    61: { desc: "Slight rain",          icon: "10d" },
    63: { desc: "Moderate rain",        icon: "10d" },
    65: { desc: "Heavy rain",           icon: "10d" },
    71: { desc: "Slight snowfall",      icon: "13d" },
    73: { desc: "Moderate snowfall",    icon: "13d" },
    75: { desc: "Heavy snowfall",       icon: "13d" },
    80: { desc: "Slight rain showers",  icon: "09d" },
    81: { desc: "Moderate rain showers",icon: "09d" },
    82: { desc: "Violent rain showers", icon: "09d" },
    95: { desc: "Thunderstorm",         icon: "11d" },
    96: { desc: "Thunderstorm with hail",icon: "11d" },
    99: { desc: "Thunderstorm with hail",icon: "11d" },
  };
  return map[code] || { desc: "Unknown", icon: "01d" };
}

// ─── Step 1: City name → lat/lon via Open-Meteo Geocoding ────────────────────
async function geocodeCity(city) {
  const res = await axios.get(GEO_URL, {
    params: { name: city, count: 1, language: "en", format: "json" },
  });
  if (!res.data.results || res.data.results.length === 0) {
    throw { status: 404, message: "City not found" };
  }
  const r = res.data.results[0];
  return {
    name: r.name,
    country: r.country_code?.toUpperCase() || "",
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone || "auto",
  };
}

// ─── Step 2: Fetch forecast + air quality in parallel ────────────────────────
async function fetchWeatherData(lat, lon, timezone = "auto") {
  const forecastParams = {
    latitude: lat,
    longitude: lon,
    timezone,
    // Current conditions
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
      "precipitation_probability",
      "uv_index",
    ].join(","),
    // Hourly for next 24h rain probability
    hourly: [
      "precipitation_probability",
      "weather_code",
    ].join(","),
    // Daily for 7-day forecast
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "uv_index_max",
    ].join(","),
    forecast_days: 7,
    wind_speed_unit: "kmh",
  };

  const airParams = {
    latitude: lat,
    longitude: lon,
    current: ["pm2_5", "us_aqi"].join(","),
    timezone,
  };

  const [forecastRes, airRes] = await Promise.allSettled([
    axios.get(FORECAST_URL, { params: forecastParams }),
    axios.get(AIR_URL, { params: airParams }),
  ]);

  const forecast = forecastRes.status === "fulfilled" ? forecastRes.value.data : null;
  const air = airRes.status === "fulfilled" ? airRes.value.data : null;

  if (!forecast) throw { status: 500, message: "Failed to fetch weather data" };

  return { forecast, air };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateAlerts(temp, humidity, windSpeed, uvIndex, rainChance) {
  const alerts = [];

  if (temp >= 38) {
    alerts.push({
      type: "heat",
      severity: temp >= 42 ? "critical" : "warning",
      title: "Heat Alert",
      message: `Temperature is ${Math.round(temp)}°C. Avoid outdoor activities between 12 PM – 3 PM. Stay hydrated.`,
      icon: "🌡️",
    });
  }
  if (rainChance >= 60) {
    alerts.push({
      type: "rain",
      severity: rainChance >= 80 ? "critical" : "warning",
      title: "Rain Alert",
      message: `${Math.round(rainChance)}% chance of rain. Carry an umbrella and avoid low-lying areas.`,
      icon: "🌧️",
    });
  }
  if (windSpeed >= 30) {
    alerts.push({
      type: "wind",
      severity: windSpeed >= 50 ? "critical" : "warning",
      title: "Strong Wind",
      message: `Wind speed: ${Math.round(windSpeed)} km/h. Avoid bike travel and secure loose outdoor items.`,
      icon: "💨",
    });
  }
  if (uvIndex >= 7) {
    alerts.push({
      type: "uv",
      severity: uvIndex >= 10 ? "critical" : "warning",
      title: "UV Exposure High",
      message: `UV Index: ${Math.round(uvIndex)}. Use SPF 50+ sunscreen. Wear sunglasses and cover up.`,
      icon: "☀️",
    });
  }
  if (humidity >= 85) {
    alerts.push({
      type: "humidity",
      severity: "warning",
      title: "High Humidity",
      message: `Humidity at ${humidity}%. Feels very uncomfortable outdoors. Wear breathable fabrics.`,
      icon: "💧",
    });
  }

  return alerts;
}

function generateTravelScore(temp, humidity, windSpeed, rainChance) {
  let score = 100;

  if (temp > 40) score -= 25;
  else if (temp > 36) score -= 12;
  else if (temp < 10) score -= 15;

  if (humidity > 85) score -= 15;
  else if (humidity > 75) score -= 8;

  if (windSpeed > 50) score -= 20;
  else if (windSpeed > 30) score -= 10;

  if (rainChance > 80) score -= 25;
  else if (rainChance > 50) score -= 15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label = "Great time to travel!";
  if (score < 40) label = "Not ideal for travel";
  else if (score < 65) label = "Travel with caution";
  else if (score < 80) label = "Good time to travel!";

  return { score, label };
}

function generateClothing(temp, rainChance, uvIndex) {
  const suggestions = [];

  if (temp >= 35) {
    suggestions.push("Light cotton clothes", "Sunglasses");
  } else if (temp >= 25) {
    suggestions.push("Light clothes");
  } else if (temp >= 15) {
    suggestions.push("Full-sleeve shirt", "Layer up");
  } else {
    suggestions.push("Jacket / hoodie", "Warm layers");
  }

  if (rainChance >= 50) suggestions.push("Carry umbrella");
  if (uvIndex >= 6) suggestions.push("Sunscreen SPF 50+");

  return { suggestions };
}

function generateActivities(temp, windSpeed, rainChance) {
  const good = [];
  const avoid = [];

  if (temp >= 20 && temp <= 32 && windSpeed < 20 && rainChance < 30) {
    good.push("Walking", "Cycling");
  }
  if (temp < 30 && rainChance < 20) good.push("Running");
  if (rainChance < 10 && windSpeed < 15) good.push("Outdoor dining");

  if (temp > 38) avoid.push("Cricket", "Hiking");
  if (windSpeed > 30) avoid.push("Cycling", "Kite-flying");
  if (rainChance > 60) avoid.push("Picnic", "Outdoor sports");

  return { good: [...new Set(good)], avoid: [...new Set(avoid)] };
}

function generateAISummary(city, temp, desc, humidity, windSpeed, rainChance, uvIndex, aqi) {
  let summary = `It's ${desc.toLowerCase()} in ${city} with a temperature of ${Math.round(temp)}°C. `;

  if (humidity > 75) summary += `Humidity is high at ${humidity}%, making it feel warmer. `;
  if (windSpeed > 20) summary += `Winds are blowing at ${Math.round(windSpeed)} km/h. `;
  if (rainChance >= 50) summary += `There's a ${Math.round(rainChance)}% chance of rain — carry an umbrella. `;
  if (temp > 38) summary += `Stay hydrated and avoid direct sunlight. `;
  if (temp < 15) summary += `Bundle up before heading out. `;
  if (uvIndex >= 7) summary += `UV index is high — apply sunscreen. `;
  if (aqi && aqi > 100) summary += `Air quality is poor today; sensitive groups should limit outdoor exposure. `;

  return summary.trim();
}

function processDailyForecast(daily) {
  return daily.time.map((date, i) => {
    const { desc, icon } = wmoToDescription(daily.weather_code[i]);
    return {
      date,
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      icon,
      description: desc,
      rainChance: daily.precipitation_probability_max[i] || 0,
      uvMax: Math.round(daily.uv_index_max?.[i] || 0),
    };
  });
}

// ─── Main Controller ──────────────────────────────────────────────────────────

exports.getWeather = async (req, res) => {
  let { city, lat, lon } = req.query;

  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: "Provide city name or lat/lon" });
  }

  try {
    // Step 1: Geocode if city name given
    let cityName = city;
    let country = "";
    let timezone = "auto";

    if (city) {
      const geo = await geocodeCity(city);
      cityName = geo.name;
      country = geo.country;
      lat = geo.lat;
      lon = geo.lon;
      timezone = geo.timezone;
    }

    // Step 2: Fetch weather + air quality
    const { forecast, air } = await fetchWeatherData(lat, lon, timezone);
    const c = forecast.current;

    // Extract values
    const temp        = c.temperature_2m;
    const feelsLike   = c.apparent_temperature;
    const humidity    = c.relative_humidity_2m;
    const windSpeed   = c.wind_speed_10m;           // already km/h
    const uvIndex     = c.uv_index || 0;
    const rainChance  = c.precipitation_probability || 0;
    const wmoCode     = c.weather_code;
    const { desc, icon } = wmoToDescription(wmoCode);

    // Air quality
    const aqi   = air?.current?.us_aqi || null;
    const pm25  = air?.current?.pm2_5 || null;

    // Generate all analysis
    const alerts      = generateAlerts(temp, humidity, windSpeed, uvIndex, rainChance);
    const travelScore = generateTravelScore(temp, humidity, windSpeed, rainChance);
    const clothing    = generateClothing(temp, rainChance, uvIndex);
    const activities  = generateActivities(temp, windSpeed, rainChance);
    const aiSummary   = generateAISummary(cityName, temp, desc, humidity, windSpeed, rainChance, uvIndex, aqi);
    const dailyForecast = processDailyForecast(forecast.daily);

    res.json({
      city: cityName,
      country,
      coord: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: {
        temp: Math.round(temp),
        feelsLike: Math.round(feelsLike),
        humidity,
        windSpeed: Math.round(windSpeed),
        description: desc,
        icon,
        uvIndex: Math.round(uvIndex),
        rainChance,
        aqi,
        pm25: pm25 ? Math.round(pm25) : null,
      },
      forecast: dailyForecast,
      alerts,
      travelScore,
      clothing,
      activities,
      aiSummary,
    });
  } catch (err) {
    console.error("Weather error:", err?.message || err);
    const status = err?.status || err?.response?.status || 500;
    const message = err?.message || err?.response?.data?.reason || "Failed to fetch weather";
    res.status(status).json({ error: message });
  }
};
