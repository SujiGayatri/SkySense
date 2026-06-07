import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";

export default function TravelScore({ travelScore }) {
  if (!travelScore) return null;
  const { score, label } = travelScore;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? "var(--teal-dark)"
      : score >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="card travel-score-card">
      <div className="score-header"><FontAwesomeIcon
          icon={faSuitcase}
          style={{ marginRight: "8px" }}
        /> Travel Score</div>
      <div className="score-circle-wrap">
        <div className="score-circle">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={radius}
              fill="none"
              stroke="var(--teal-light)"
              strokeWidth="7"
            />
            <circle
              cx="40" cy="40" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <span className="score-num" style={{ color }}>{score}</span>
        </div>
        <div>
          <div className="score-label">{label}</div>
          <div className="score-sublabel">out of 100</div>
        </div>
      </div>
    </div>
  );
}
