import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// We’ll inject our custom styles with a styled-component-like approach
// but we can do it inline for now or rely on a separate CSS file if you prefer.

const overlayStyles = `
  /* Circle styling */
  .__myExtension_circle {
    position: fixed;
    width: 150px;
    height: 150px;
    margin-left: -75px; /* half of width to center around cursor */
    margin-top: -75px;  /* half of height to center around cursor */
    border: 6px solid rgba(0, 0, 255, 0.5);
    border-radius: 100%;
    pointer-events: none;
    animation: __myExtension_shrinkCircle 1s forwards ease-out;
    z-index: 999999; /* ensure it's on top */
  }

  @keyframes __myExtension_shrinkCircle {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  /* Popup styling */
  .__myExtension_popup {
    position: fixed;
    transform: translate(20px, 20px); /* offset from cursor */
    background: white;
    border: 2px solid #00f;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    z-index: 999999;
    pointer-events: none;
    font-family: sans-serif;
    /* Make the cursor appear blue on top of it */
    cursor: url("data:image/svg+xml,\
      <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>\
        <circle cx='16' cy='16' r='8' fill='blue'/>\
      </svg>") 16 16, auto;
  }

  .__myExtension_popup p {
    margin: 0.5rem 0;
  }

  .__myExtension_enterLine {
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: #666;
  }
`;

const IdleOverlay: React.FC = () => {
  const [isCircleVisible, setIsCircleVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);

  // Insert the style block once when component mounts
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = overlayStyles;
    document.head.appendChild(styleEl);

    return () => {
      // Cleanup the style on unmount if you like
      styleEl.remove();
    };
  }, []);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Hide circle/popup if visible
      if (isCircleVisible || isPopupVisible) {
        setIsCircleVisible(false);
        setIsPopupVisible(false);
      }

      // Clear any existing timers
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      // Start a new 1 second timer
      idleTimerRef.current = window.setTimeout(() => {
        // Show circle
        setIsCircleVisible(true);
      }, 1000);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isCircleVisible, isPopupVisible]);

  // Circle animation end -> show popup
  const handleAnimationEnd = () => {
    // Only show popup if the circle is still visible
    if (isCircleVisible) {
      setIsPopupVisible(true);
    }
  };

  // Enter key to hide popup & circle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isPopupVisible) {
        setIsPopupVisible(false);
        setIsCircleVisible(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupVisible]);

  // Render a React Portal with our circle & popup elements
  // We conditionally render them based on state
  return ReactDOM.createPortal(
    <>
      {isCircleVisible && (
        <div
          className="__myExtension_circle"
          style={{ left: mousePosition.x, top: mousePosition.y }}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
      {isPopupVisible && (
        <div
          className="__myExtension_popup"
          style={{ left: mousePosition.x, top: mousePosition.y }}
        >
          <p>I am here if you need me</p>
          <p className="__myExtension_enterLine">Press Enter to continue</p>
        </div>
        
      )}
    </>,
    document.body
  );
};

export default IdleOverlay;
