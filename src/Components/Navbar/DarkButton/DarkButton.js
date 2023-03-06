import { useCallback, useEffect } from 'react';

import { Brightness4, Brightness7 } from '@mui/icons-material';

import useLocalStorage from '@/utils/hooks/useLocalStorage';

import '@/Components/Navbar/DarkButton/DarkButton.css';

// this is the button that toggles the dark mode status of the site
export default function DarkButton() {
  // * states
  // localStorageStatecomponent tracks the user's local storage data on if they are in dark mode or not
  const [localStorageState, setLocalStorageState] = useLocalStorage(
    'darkKey',
    'dark'
  );

  // * useEffects
  // when the localStorageState changes, this will add or remove a class to the body which creates the different visual style
  // if we refresh the website, it reads the cookie and determines if it should start on dark mode or not
  useEffect(() => {
    if (localStorageState === 'dark') {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [localStorageState]);

  // * functions
  // whenever we click the darkmode toggle, this function changes the local storage state, re-rendering the function with the new style
  const handleClick = useCallback(() => {
    if (localStorageState === 'dark') {
      setLocalStorageState('light');
    } else {
      setLocalStorageState('dark');
    }
    // setter never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageState]);

  return (
    <button type="button" className="darkButton" onClick={handleClick}>
      {localStorageState === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </button>
  );
}
