import ReactDOM from 'react-dom/client';
import RiveCursor from './RiveCursor';
import './style.css'; // optional

// 1. Create a container for our React app
const appContainer = document.createElement('div');
appContainer.id = 'my-rive-extension-container';

// Style this container to ensure it's on top
Object.assign(appContainer.style, {
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  pointerEvents: 'none', // so it doesn't block clicks
  zIndex: '9999999',
});

// 2. Append it to body
document.body.appendChild(appContainer);

// 3. Render our RiveCursor app
const root = ReactDOM.createRoot(appContainer);
root.render(<RiveCursor />);
