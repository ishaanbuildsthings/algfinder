import { useRef } from 'react';

import { Routes, Route } from 'react-router-dom';

import Faq from './Components/Faq/Faq.js';
import Navbar from './Components/Navbar/Navbar.js';
import Solve from './Components/Solve/Solve.js';

/**
 * This defines the entire website in terms of components, including all routes.
 *
 * This component is wrapped in a fakeBodyDiv so that we can modify the divs height to be the viewport height.
 * @usage Used in index.js
 */

export default function App() {
  // this tracks how many times the solve component has been mounted, if it has been mounted more than once do not render the joyride
  const solveComponentMountedMoreThanOnce = useRef(false);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Solve
          solveComponentMountedMoreThanOnce={solveComponentMountedMoreThanOnce}
        />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </>
  );
};