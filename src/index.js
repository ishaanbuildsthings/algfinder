import ReactDOM from 'react-dom/client';

import { HashRouter } from 'react-router-dom';

import App from './App';

import './index.css';

/**
 * This module renders the whole app with support for react-router-dom.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
