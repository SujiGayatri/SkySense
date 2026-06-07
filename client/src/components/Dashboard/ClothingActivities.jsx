import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShirt,
  faPersonWalking,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function ClothingActivities({ clothing, activities }) {
  if (!clothing && !activities) return null;

  return (
    <div className="card">
      {clothing && (
        <>
          <div
            className="section-title"
            style={{ marginBottom: 8, fontSize: 14 }}
          >
            <FontAwesomeIcon
    icon={faShirt}
    // style={{ marginRight: "1px" }}
  /> Clothing Suggestions
          </div>
          <div className="clothing-items">
            {clothing.suggestions.map((s) => (
              <span key={s} className="clothing-tag">{s}</span>
            ))}
          </div>
        </>
      )}

      {activities && (
        <div style={{ marginTop: clothing ? 16 : 0 }}>
          <div className="section-title" style={{ marginBottom: 8, fontSize: 14 }}>
             <FontAwesomeIcon
    icon={faPersonWalking}
    style={{ marginRight: "1px" }}
  /> Outdoor Activities
          </div>
          <div className="activity-row">
            {activities.good.length > 0 && (
              <div className="activity-col">
                <h4>Good for</h4>
                {activities.good.map((a) => (
                  <div key={a} className="activity-item good"><FontAwesomeIcon
    icon={faCircleCheck}
    style={{
      marginRight: "6px",
      color: "#22c55e",
    }}
  /> {a}</div>
                ))}
              </div>
            )}
            {activities.avoid.length > 0 && (
              <div className="activity-col">
                <h4>Avoid</h4>
                {activities.avoid.map((a) => (
                  <div key={a} className="activity-item bad"><FontAwesomeIcon
    icon={faCircleXmark}
    style={{
      marginRight: "6px",
      color: "#ef4444",
    }}
  /> {a}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
