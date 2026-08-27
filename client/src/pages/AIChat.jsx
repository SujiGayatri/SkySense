import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../components/CSS/AIChat.css";
import { useWeather } from "../context/WeatherContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faRobot } from "@fortawesome/free-solid-svg-icons";
import ChatBubble from "../components/Chat/ChatBubble";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
    const { currentCity } = useWeather();
    const chatEndRef = useRef(null);
    
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me about weather, travel safety, clothing or outdoor activities.",
      sources: [],
    },
  ]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userText = question;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/weather/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentCity,
          question: userText,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to reach the server.",
          sources: [],
        },
      ]);
    }

    setLoading(false);
  };
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);
  return (
  <div className="ai-chat-page">
    {/* <h1 className="ai-title"><FontAwesomeIcon icon={faCloudSun} style={{color:"white"}}/> SkySense AI</h1> */}
    <p className="ai-subtitle">
  Ask questions about weather, travel, air quality, clothing and outdoor activities in {currentCity}.
</p>
<div className="quick-prompts">
  <button onClick={() => setQuestion("Can I go for a run tomorrow?")}>
    Running
  </button>

  <button onClick={() => setQuestion("What should I wear today?")}>
    Clothing
  </button>

  <button onClick={() => setQuestion("Is it safe to travel today?")}>
    Travel
  </button>

  <button onClick={() => setQuestion("How is the air quality today?")}>
    Air Quality
  </button>
</div>
    <div className="chat-box">
  {messages.map((msg, i) => (
    <ChatBubble
      key={i}
      role={msg.role}
      content={msg.content}
      sources={msg.sources}
    />
  ))}

  {loading && (
    <div className="chat-row assistant">
      <div className="chat-avatar">
        <FontAwesomeIcon icon={faRobot} size={22} />
      </div>

      <div className="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )}
</div>
     <div ref={chatEndRef} ></div>
    <div className="input-area">
  <input
    className="chat-input"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder={`Ask anything about ${currentCity}...`}
    onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
  />

  <button
    className="send-btn"
    disabled={loading || !question.trim()}
    onClick={sendMessage}
  >
    {loading ? "..." : "Send"}
  </button>
</div>
  </div>
);
}