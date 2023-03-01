import { Routes, Route } from 'react-router-dom';
import Faq from './Components/Faq/Faq.js';
import LandingModal from './Components/LandingModal/LandingModal.js';
import Navbar from './Components/Navbar/Navbar.js';
import Solve from './Components/Solve/Solve.js';

/**
 * This defines the entire website in terms of components, including all routes.
 *
 * This component is wrapped in a fakeBodyDiv so that we can modify the divs height to be the viewport height.
 * @usage Used in index.js
 */
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Solve />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
      <LandingModal />
    </>
  );
}

export default App;
