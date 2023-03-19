import { useCallback } from 'react';

import { Brightness4, Brightness7 } from '@mui/icons-material';

import createRipple from '@/utils/createRipple.js';

import '@/Components/Navbar/DarkButton/DarkButton.css';

/**
 * this is the button that toggles the dark mode status of the site
 * @param handleDarkClick - changes the dark status on the site, received from Navbar.js
 * darkModeState - the current dark status of the site, received from Navbar.js
 */

export default function DarkButton({ darkModeState, handleDarkClick }) {
  const handleClick = useCallback(
    (event) => {
      handleDarkClick();
      createRipple(event, 0.6);
    },
    [handleDarkClick]
  );
  return (
    <button type="button" className="darkButton" onClick={handleClick}>
      {darkModeState === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </button>
  );
}
