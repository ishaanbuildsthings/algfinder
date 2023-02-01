
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import { RiSunLine } from 'react-icons/ri';
import { useCallback, useEffect } from 'react';
import useLocalStorage from '../../Utils/Hooks/useLocalStorage';
import './DarkButton.css';

// this is the button that toggles the dark mode status of the site
function DarkButton() {
  // * states
  // localStorageStatecomponent tracks the user's local storage data on if they are in dark mode or not
  const [localStorageState, setLocalStorageState] = useLocalStorage('darkKey', 'dark');

  // * handlers
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

  // * other hooks
  // when the localStorageState changes, this will add or remove a class to the body which creates the different visual style
  // if we refresh the website, it reads the cookie and determines if it should start on dark mode or not
  useEffect(() => {
    if (localStorageState === 'dark') {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [localStorageState]);

  return (
    <button className="darkButton" onClick={handleClick}> {/*darkButton is bugged since safari is bugged with buttons that have display: flex */}
      <IconContext.Provider value={
        (() => {
          if (localStorageState === 'dark') {
            return { size: '60%' };
          }
          return { size: '45%' };
        })()
      }>
        {localStorageState === 'dark' ? <RiSunLine /> : <BsFillMoonStarsFill />}
      </IconContext.Provider>
    </button>
  );
}

export default DarkButton;

