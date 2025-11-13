import React, { useState, useEffect, useRef } from "react";
import "../styles/widget.css";
import sendIcon from "../components/send.svg";
import aiIcon from "../components/ai.svg";

const ChatWidget = ({ apiKey, position = "right" })  => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [thread_id, setThread_id] = useState("");
  const messagesEndRef = useRef(null);


  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    // if (!sessionId) {
    //   console.error("No hay sesión activa");
    //   return;
    // }

    // Agregar el mensaje del usuario a la lista de mensajes
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const response = await fetch(
        "https://seba-whatsapp-agent.vercel.app/script_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Si tu backend espera la apiKey en headers, descomenta:
            // "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: text,
            sessionId: sessionId,
            thread_id: thread_id,
            assistantId: apiKey, // <- aquí pasamos el apiKey como assistantId
          }),
        }
      );

      const data = await response.json();
      setThread_id(data.threadId);
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

  // Función para desplazar el contenedor hacia abajo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Desplazar hacia abajo cada vez que se actualizan los mensajes
  }, [messages]);

  return (
    <div
    className="ai-chat-widget"
    style={{
      position: "fixed",
      bottom: "30px",
      [position]: "40px", // si position="left", quedará en la izquierda
      zIndex: 9999,
    }}
  >
      {isOpen ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="ia_image">
              <img alt="image" src={aiIcon} className="" />
            </div>
            <div className="header_text">
              <h4>Customer Support Agent</h4>
              <h6>Online</h6>
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
            <div ref={messagesEndRef} />
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
                <img alt="image" src={sendIcon} className="send" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        <button className="chat-trigger" onClick={() => setIsOpen(true)}>
          <div className="ia_image">
            <img alt="image" src={aiIcon} className="" />
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
