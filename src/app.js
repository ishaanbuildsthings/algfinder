import Navbar from './Components/Navbar';
import Solve from './pages/solve';
import Documentation from './pages/documentation';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

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