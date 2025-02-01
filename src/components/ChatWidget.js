// src/components/ChatWidget.js
//componente principal del widget

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
        "https://seba-whatsapp-agent.vercel.app/script_chat",
        // "https://7275-151-47-181-171.ngrok-free.app/script_chat",
        {
           method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${apiKey}`,
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
              <img alt="image" src="\ai.svg" className="home-image14"></img>
            </div>
            <div className="header_text">
              <h4>Customer Support Agent</h4>
              <h6> Online</h6>
            </div>
            <div className="close-button_div">
              <button onClick={() => setIsOpen(false)} className="close-button">
                --
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
            className="input"
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
            className="send_button"
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
            >
              <div className="ia_image">
              <img alt="image" src="/send.svg" className="send"></img>
            </div>
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-trigger" onClick={() => setIsOpen(true)}>
           <div className="ia_image">
              <img alt="image" src="/ai.svg" className="home-image14"></img>
            </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
