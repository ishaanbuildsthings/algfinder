import ReactDOM from 'react-dom/client';
import './index.css';
import './Tooltips.css';
import App from './app';
import { BrowserRouter } from 'react-router-dom';

/**
 * This module renders the whole app with support for react-router-dom.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

