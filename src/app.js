import { memo, useCallback, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import useLocalStorage from '@/utils/hooks/useLocalStorage';

import Solve from '@/Components/Solve/Solve.js';
import Faq from '@/Components/Faq/Faq.js';
import Navbar from '@/Components/Navbar/Navbar.js';

/**
 * This defines the entire website in terms of components, including all routes.
 *
 * This component is wrapped in a fakeBodyDiv so that we can modify the divs height to be the viewport height.
 * @usage Used in index.js
 */
function App() {
  // * states
  // tracks the user's local storage data on if they are in dark mode or not
  // this is held at the app level since we need it in the navbar, but also to pass the color to the joyride to control the button colors
  const [darkModeState, setDarkModeState] = useLocalStorage('darkKey', 'dark');

  // * useEffects
  // when the darkModeState changes, this will add or remove a class to the body which creates the different visual style
  // if we refresh the website, it reads the cookie and determines if it should start on dark mode or not
  useEffect(() => {
    if (darkModeState === 'dark') {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [darkModeState]);

  // * functions
  // whenever we click the darkmode toggle, this function changes the local storage state, re-rendering the function with the new style
  const handleDarkClick = useCallback(() => {
    if (darkModeState === 'dark') {
      setDarkModeState('light');
    } else {
      setDarkModeState('dark');
    }
    // setter never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkModeState]);

  return (
    <>
      <Navbar darkModeState={darkModeState} handleDarkClick={handleDarkClick} />
      <Routes>
        <Route path="/" element={<Solve darkModeState={darkModeState} />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </>
  );
}

export default memo(App);
