import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleCheck,
  faTemperatureHigh,
  faCloudRain,
  faWind,
  faSun,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

export default function AlertsSummary({ alerts }) {
  const ALERT_ICONS = {
  heat: faTemperatureHigh,
  rain: faCloudRain,
  wind: faWind,
  uv: faSun,
  humidity: faDroplet,
};
  return (
    <div className="card">
      <div className="section-title"> <FontAwesomeIcon
    icon={faTriangleExclamation}
    style={{ marginRight: "8px" }}
  /> Active Alerts</div>
      {!alerts?.length ? (
        <div className="no-alerts">
          <div style={{ fontSize: 32, marginBottom: 8 }}><FontAwesomeIcon
    icon={faCircleCheck}
    style={{ color: "#22c55e" }}
  /></div>
          <div>No active alerts</div>
          <div style={{ fontSize: 12, marginTop: 4, color: "var(--text-muted)" }}>
            All clear!
          </div>
        </div>
      ) : (
        alerts.slice(0, 3).map((a, i) => (
          <div key={i} className={`alert-item ${a.severity}`}>
            <span className="alert-icon"><FontAwesomeIcon
    icon={ALERT_ICONS[a.type] || faTriangleExclamation}
  /></span>
            <div>
              <div className="alert-title">{a.title}</div>
              <div className="alert-msg">{a.message}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
