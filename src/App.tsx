// App.tsx
import { useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import './styles.css';



const RiveContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, rive } = useRive({
    src: "https://cdn.rive.app/animations/vehicles.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,  // Correct enum value
      alignment: Alignment.Center  // Correct enum value
    }),
    onLoad: () => {
      console.log("Rive animation loaded successfully");
      if (rive) {
        rive.resizeDrawingSurfaceToCanvas();
      }
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (rive) {
        rive.resizeDrawingSurfaceToCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rive]);

  return (
    <div className="rive-wrapper" ref={containerRef}>
      <div className="rive-container">
        <RiveComponent />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
      <RiveContainer />
    </div>
  );
};

export default App;