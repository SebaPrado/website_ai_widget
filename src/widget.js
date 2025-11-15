// src/widget.js
//archivo principal que inicializa el widget

import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./components/ChatWidget";

window.initAIChat = function (config) {
  const container = document.createElement("div");
  
  // 🧠 DECISIÓN 1: ¿Dónde me monto?
  // Si me dieron un targetSelector, busco ese elemento
  // Si no, uso el body (comportamiento actual)
  let mountPoint = document.body; // Por defecto: el jardín (body)
  let mountMode = "floating"; // Por defecto: modo flotante
  
  if (config?.targetSelector) {
    // Intentar encontrar el elemento especificado por el cliente
    const targetElement = document.querySelector(config.targetSelector);
    
    if (targetElement) {
      mountPoint = targetElement; // Encontré la habitación, me monto ahí
      mountMode = "embedded"; // Cambio a modo embebido
    } else {
      // Si el elemento no existe, aviso en consola y uso el comportamiento por defecto
      console.warn(
        `⚠️ No se encontró el elemento "${config.targetSelector}". ` +
        `El widget se montará en modo flotante por defecto.`
      );
    }
  }
  
  // Añadir el contenedor al punto de montaje elegido
  mountPoint.appendChild(container);

  const root = createRoot(container);
  root.render(
    <ChatWidget
      apiKey={config?.apiKey}
      position={config?.position || "right"}
      mountMode={mountMode} // 🆕 Le paso esta información al componente
      openByDefault={config?.openByDefault || false} // 🆕 Para tu caso de scroll
      triggerOnScroll={config?.triggerOnScroll || false} // 🆕 Opcional para después
    />
  );
};
