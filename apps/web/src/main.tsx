import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { WebClientShell } from "./shell/web-client-shell";
import "./styles/shell.css";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Missing root element for web client shell.");
}

createRoot(rootElement).render(
  <StrictMode>
    <WebClientShell />
  </StrictMode>
);
