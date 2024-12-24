import { useState, useEffect, useRef } from 'react';
import { useRive } from '@rive-app/react-canvas';

const IDLE_TIMEOUT_MS = 1000;

export default function RiveCursor() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isRiveVisible, setRiveVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const idleTimerRef = useRef<number | null>(null);

  const { rive, RiveComponent } = useRive({
    src: '../../public/assets/animations/cursor.riv', // Or local .riv file
    autoplay: false,
    // If you have a State Machine in your Rive file, specify: stateMachines: "StateMachineName",
  });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMouseX(e.clientX);
      setMouseY(e.clientY);

      // Hide Rive if visible
      if (isRiveVisible) setRiveVisible(false);
      if (isPopupVisible) setPopupVisible(false);

      // Clear existing timer
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }

      // Start new idle timer
      idleTimerRef.current = window.setTimeout(() => {
        setRiveVisible(true);
        if (rive) rive.play();
      }, IDLE_TIMEOUT_MS);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isRiveVisible, isPopupVisible, rive]);

  // Press Enter to dismiss
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && isPopupVisible) {
        setPopupVisible(false);
        setRiveVisible(false);
        if (rive) {
          rive.pause();
          // rive.reset(); // if you'd like to reset the animation
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupVisible, rive]);
  

  return (
    <>
      {isRiveVisible && (
        <div
          style={{
            position: 'fixed',
            left: mouseX,
            top: mouseY,
            pointerEvents: 'none',
            width: 150,
            height: 150,
            transform: 'translate(-50%, -50%)',
            zIndex: 999999,
          }}
        >
          <RiveComponent />
        </div>
      )}

      {isPopupVisible && (
        <div
          style={{
            position: 'fixed',
            left: mouseX,
            top: mouseY,
            transform: 'translate(20px, 20px)',
            background: 'white',
            border: '2px solid #00f',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            zIndex: 999999,
            pointerEvents: 'none',
            fontFamily: 'sans-serif',
          }}
        >
          <p>I am here if you need me</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#666' }}>
            Press Enter to continue
          </p>
        </div>
      )}
    </>
  );
}
