import Navbar from './Components/SharedComponents/Navbar/Navbar.js';
import Solve from './Pages/solve';
import Documentation from './Pages/documentation';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

/**
 * This defines the entire website in terms of components, including all routes.
 *
 * This component is wrapped in a fakeBodyDiv so that we can modify the divs height to be the viewport height,
 * as we cannot access the body directly in vanilla React with declarative methods.
 * @usage Used in index.js
 */
function App() {

  return (
    <div className="fakeBodyDiv">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Solve />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </div>
  )
}

export default App;