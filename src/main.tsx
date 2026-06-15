import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ConvexProvider, convexClient} from './lib/convex';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

const app = convexClient ? (
  <ConvexProvider client={convexClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </ConvexProvider>
) : (
  <StrictMode>
    <App />
  </StrictMode>
);

root.render(app);
