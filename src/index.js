import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/index.css';
import './css/navbar.css';
import './css/queryFormWithSpacing.css';
import './css/topRightHalf.css'
import './css/bottomHalf.css';
import './css/darkmode.css';
import './css/documentation.css';
import './css/mediaqueries.css';

import App from './app';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

