import Navbar from './Components/Navbar/Navbar.js';
import Solve from './Components/Solve/Solve.js';
import Documentation from './Components/Documentation/Documentation.js';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

/**
 * This defines the entire website in terms of components, including all routes.
 *
 * This component is wrapped in a fakeBodyDiv so that we can modify the divs height to be the viewport height.
 * @usage Used in index.js
 */
function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Solve />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </>
  )
}

export default App;