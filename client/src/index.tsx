import ReactDOM from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react'



const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <StrictMode>
      <App />
  </StrictMode>,
  );
}
