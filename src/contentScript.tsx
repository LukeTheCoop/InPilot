// src/contentScript.tsx
import { createRoot } from "react-dom/client";
import IdleOverlay from "./components/IdleOverlay";

function init() {
  // Create a <div> to host our React app (or you can do a Portal inside IdleOverlay)
  const hostEl = document.createElement("div");
  // If you want it hidden or no visible styling, you can do so:
  hostEl.style.display = "none"; 
  document.documentElement.appendChild(hostEl);

  // Mount React
  const root = createRoot(hostEl);
  root.render(<IdleOverlay />);
}

// In a content script, just run init right away:
init();
