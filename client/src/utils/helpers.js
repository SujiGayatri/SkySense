export function formatDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function formatDayName(dateStr) {
  // Open-Meteo returns "YYYY-MM-DD" — parse as local date
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { weekday: "short" });
}

export function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 2) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// Open-Meteo uses same icon codes as OpenWeatherMap (01d, 02d, etc.)
export function owmIconToEmoji(icon) {
  if (!icon) return "🌤️";
  const code = icon.replace("d", "").replace("n", "");
  const map = {
    "01": "☀️", "02": "⛅", "03": "🌥️", "04": "☁️",
    "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
  };
  return map[code] || "🌤️";
}

// AQI label + color for US AQI scale
export function aqiInfo(aqi) {
  if (!aqi) return null;
  if (aqi <= 50)  return { label: "Good",        color: "#22c55e" };
  if (aqi <= 100) return { label: "Moderate",     color: "#f59e0b" };
  if (aqi <= 150) return { label: "Unhealthy*",   color: "#f97316" };
  if (aqi <= 200) return { label: "Unhealthy",    color: "#ef4444" };
  if (aqi <= 300) return { label: "Very Unhealthy",color: "#9333ea" };
  return           { label: "Hazardous",          color: "#7f1d1d" };
}
