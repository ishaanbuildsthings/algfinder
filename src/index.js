import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { HashRouter } from 'react-router-dom';

/**
 * This module renders the whole app with support for react-router-dom.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
