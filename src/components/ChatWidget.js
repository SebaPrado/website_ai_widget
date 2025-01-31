// src/components/ChatWidget.js
import React, { useState } from "react";
import "../styles/widget.css";

const ChatWidget = ({ apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Crear el mensaje del usuario con el rol "user"
    let userMessage = { role: "user", content: text };
    let text_userMessage = userMessage.content;

    // const userMessage = text ;

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "https://d773-151-19-69-217.ngrok-free.app/script_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: text_userMessage, // Enviar el historial de mensajes como array
          }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Lo siento, hubo un error al procesar tu mensaje.",
        },
      ]);
    }
  };

  return (
    <div className="ai-chat-widget">
      {isOpen ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="ia_image">
              <img alt="image" src="/ai.svg" className="home-image14"></img>
            </div>
            <div className="header_text">
              <h4>Customer Support Agent</h4>
              <h6> Online</h6>
            </div>
            <div>
              <button onClick={() => setIsOpen(false)} className="close-button">
                x
              </button>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                  setInputText("");
                }
              }}
              placeholder="Escribe tu mensaje..."
            />
            <button
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-trigger" onClick={() => setIsOpen(true)}>
          Chat con IA
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
