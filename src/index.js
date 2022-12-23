import React from 'react';
import ReactDOM from 'react-dom/client';

import './CSS/index.css';
import './Components/Navbar/Navbar.css';
import './Components/Toggle/Toggle.css';
import './Components/QueryForm/QueryForm.css';
import './CSS/topRightHalf.css'
import './Components/SolutionsDisplay/SolutionsDisplay.css';
import './Components/Documentation/Documentation.css';

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

