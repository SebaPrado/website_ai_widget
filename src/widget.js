// src/widget.js
//archivo principal que inicializa el widget

import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./components/ChatWidget";

window.initAIChat = function (config) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <ChatWidget
      apiKey={config?.apiKey}
      position={config?.position || "right"}
    />
  );
};

