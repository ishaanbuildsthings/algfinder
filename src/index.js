import React from 'react';
import ReactDOM from 'react-dom/client';

import './CSS/index.css';
import './CSS/navbar.css';
import './CSS/toggle.css';
import './CSS/queryFormWithSpacing.css';
import './CSS/topRightHalf.css'
import './CSS/bottomHalf.css';
import './CSS/documentation.css';

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

