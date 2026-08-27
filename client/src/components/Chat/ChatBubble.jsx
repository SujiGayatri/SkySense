import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import "../CSS/ChatBubble.css";

export default function ChatBubble({ role, content, sources = [] }) {
  return (
    <div className={`chat-row ${role}`}>
      <div className="chat-avatar">
        {role === "assistant" ? (
          <FontAwesomeIcon icon={faRobot} size="lg" />
        ) : (
          <FontAwesomeIcon icon={faCircleUser} size="lg" />
        )}
      </div>

      <div className="chat-content">
        <div className="chat-bubble">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {sources.length > 0 && (
          <div className="chat-sources">
            {sources.map((src) => (
              <span key={src} className="source-pill">
                {src.replace(".txt", "")}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}