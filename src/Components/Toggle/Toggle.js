import { useEffect } from 'react';
import useLocalStorage from '../../Hooks/useLocalStorage';
import './Toggle.css';

function Toggle() {
  // * states
  // localStorageStatecomponent tracks the user's local storage data on if they are in dark mode or not
  const [localStorageState, setLocalStorageState] = useLocalStorage(
    "darkStatus",
    "dark"
  );

  // * handlers
  // whenever we click the darkmode toggle, this function changes the local storage state, re-rendering the function with the new style
  function handleClick() {
    if (localStorageState === 'dark') {
      setLocalStorageState('light');
    } else {
      setLocalStorageState('dark');
    }
  }

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
    <div className="toggle" onClick={handleClick}>
      <button className="thumb"></button>
    </div>
  );
}

export default Toggle;
