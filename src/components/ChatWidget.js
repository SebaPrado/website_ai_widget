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
  
    // Agregar el mensaje del usuario
    setMessages((prev) => [...prev, { role: "user", content: text }]);
  
    // Agregar un mensaje temporal de "escribiendo..."
    const tempMessageId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Escribiendo...",
        isTemp: true,
        id: tempMessageId,
      },
    ]);
  
    try {
      // PASO 1: Iniciar la conversación - esto retorna inmediatamente
      const initResponse = await fetch(
        "https://seba-whatsapp-agent.vercel.app/script_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: text,
            sessionId: sessionId,
            thread_id: thread_id,
            assistantId: apiKey,
          }),
        }
      );
  
      const initData = await initResponse.json();
      
      // Guardamos el threadId para futuras conversaciones
      setThread_id(initData.threadId);
      
      // PASO 2: Hacer polling hasta obtener la respuesta final
      const finalResponse = await pollForResponse(
        initData.processing_Run_Id,
        initData.threadId
      );
  
      // PASO 3: Reemplazar el mensaje temporal con la respuesta real
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? { role: "assistant", content: finalResponse }
            : msg
        )
      );
      
    } catch (error) {
      console.error("Error:", error);
      
      // Reemplazar el mensaje temporal con un mensaje de error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? {
                role: "system",
                content: "Lo siento, hubo un error al procesar tu mensaje.",
              }
            : msg
        )
      );
    }
  };
  
  // Función auxiliar para hacer polling
  const pollForResponse = async (runId, threadId, maxAttempts = 30) => {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`⏳ Intento ${attempts + 1}: consultando estado...`);
        
        const checkResponse = await fetch(
          "https://seba-whatsapp-agent.vercel.app/script_chat_check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              runId: runId,
              threadId: threadId,
            }),
          }
        );

        const checkData = await checkResponse.json();
        
        // Log más detallado del estado
        console.log(`📊 Estado recibido:`, checkData.status);

        if (checkData.status === "completed") {
          console.log("✅ Respuesta completada exitosamente");
          return checkData.response;
        }

        if (checkData.status === "failed") {
          // ⭐ NUEVO: Extraer información detallada del error
          console.error("❌ Error detallado del run:", checkData.errorDetails);
          
          // Crear un mensaje de error más útil para el usuario
          const errorMsg = checkData.errorDetails?.last_error 
            ? `Error de OpenAI: ${checkData.errorDetails.last_error.message}`
            : checkData.error || "El procesamiento falló";
          
          throw new Error(errorMsg);
        }

        // Si aún está procesando, esperar y continuar
        console.log(`⏸️  Estado: ${checkData.status}, esperando 2 segundos...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
        
      } catch (error) {
        console.error("🚨 Error en polling:", error);
        throw error;
      }
    }

    throw new Error("El procesamiento está tomando demasiado tiempo (más de 60 segundos)");
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
