import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function AISummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="ai-summary-card">
      <div className="ai-badge">
         <FontAwesomeIcon
    icon={faRobot}
    style={{
      color: "var(--teal-mid)",
      marginRight: "8px",
    }}
  />
        AI Weather Insights
      </div>

      <p className="ai-text">{summary}</p>
    </div>
  );
}
