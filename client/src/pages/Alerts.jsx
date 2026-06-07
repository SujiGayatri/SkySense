import React from "react";
import { useWeather } from "../context/WeatherContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHigh,
  faCloudRain,
  faWind,
  faSun,
  faDroplet,
  faTriangleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const ALERT_META = {
  heat: { bg: "#fff8e6", border: "#f59e0b", badge: "#f59e0b" },
  rain: { bg: "#eff6ff", border: "#3b82f6", badge: "#3b82f6" },
  wind: { bg: "#f0fdf4", border: "#22c55e", badge: "#22c55e" },
  uv: { bg: "#fef9c3", border: "#eab308", badge: "#eab308" },
  humidity: { bg: "#f0f9ff", border: "#0ea5e9", badge: "#0ea5e9" },
};

export default function Alerts() {
  const { weatherData, loading, fetchWeather } = useWeather();

  React.useEffect(() => {
    if (!weatherData) fetchWeather("Vijayawada");
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const alerts = weatherData?.alerts || [];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><FontAwesomeIcon icon={faTriangleExclamation} /> Weather Alerts</h2>
        <p className="page-subtitle">
          Active warnings for {weatherData?.city || "your city"}
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FontAwesomeIcon icon={faCircleCheck} /></div>
          <h3>All Clear!</h3>
          <p>
            No active weather alerts. Conditions are safe and comfortable right now.
          </p>
        </div>
      ) : (
        <div className="alerts-grid">
          {alerts.map((alert, i) => {
            const meta = ALERT_META[alert.type] || ALERT_META.heat;
            return (
              <div
                key={i}
                className="alert-card"
                style={{
                  background: meta.bg,
                  borderColor: meta.border,
                  border: `1.5px solid ${meta.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <FontAwesomeIcon
  icon={alert.icon}
  style={{
    fontSize: "32px",
    color: meta.border,
  }}
/>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "var(--text-primary)",
                      }}
                    >
                      {alert.title}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        background: meta.badge,
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {alert.message}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Static alert info cards */}
      <div style={{ marginTop: 32 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 16,
            color: "var(--text-secondary)",
          }}
        >
          Alert Types Monitored
        </h3>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: faTemperatureHigh, label: "Heat", desc: "Temperature > 38°C" },
            { icon: faCloudRain, label: "Rain", desc: "Chance > 60%" },
            { icon: faWind, label: "Wind", desc: "Speed > 30 km/h" },
            { icon: faSun, label: "UV", desc: "UV Index > 7" },
            { icon: faDroplet, label: "Humidity", desc: "Humidity > 85%" },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: "1 1 160px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <FontAwesomeIcon
  icon={t.icon}
  style={{
    fontSize: "24px",
    color: "var(--teal-mid)",
  }}
/>
              <div>
                <div
                  style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}
                >
                  {t.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
