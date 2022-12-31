import { useEffect } from 'react';
import cx from '../../Tools/cx';
import useLocalStorage from '../../Tools/useLocalStorage';
import { useNavigate, useLocation } from 'react-router-dom';
import Toggle from '../Toggle/Toggle.js';

function Navbar() {
  // * misc
  // necessary for react-router-dom routing
  const history = useNavigate();
  // necessary for parsing the current URL to display the correct .active CSS coloring
  let location = useLocation();

  // * states
  // localStorageStatecomponent tracks the user's local storage data on if they are in dark mode or not
  const [localStorageState, setLocalStorageState] = useLocalStorage('darkStatus', 'dark');

  // * handlers
  // whenever we click the darkmode toggle, this function changes the local storage state, re-rendering the function with the new style
  function handleDarkModeToggle() {
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
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history('/');
            }}
            className={cx(location.pathname === '/' && 'active')}
            href="/"
            >Solve
          </a>
        </li>
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history('/documentation');
            }}
            className={cx(location.pathname === '/documentation' && 'active')}
            href="/documentation"
            >Documentation
          </a>
        </li>
      </ul>

      <Toggle handleClick={handleDarkModeToggle}/>

    </nav>
  )
}

export default Navbar;