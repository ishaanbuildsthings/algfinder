import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import './Components/Toggle/Toggle.css';
import './Components/QueryForm/QueryForm.css';
import './Components/CubePanel/CubePanel.css';
import './Tooltips.css';
import './Components/SolutionsDisplay/SolutionsDisplay.css';
import './Components/Documentation/Documentation.css';
import './Components/Navbar/Navbar.css';
import './Components/CopiedPopup/CopiedPopup.css';
import './Components/BugFixing.css';

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

