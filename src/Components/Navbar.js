import React from 'react';
import cx from '../Tools/cx';
import useLocalStorage from '../Tools/useLocalStorage';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useNavigate } from 'react-router-dom';
import Toggle from './SolveComponents/Toggle.js';

/**
 * This function defines the Navbar component, which is a shared component across the page. The navbar serves to route users
 * to the appropriate page.
 * @usage Used in index.js
 */
function Navbar() {

  // * states
  // localStorageStatecomponent tracks the user's local storage data on if they are in dark mode or not
  const [localStorageState, setLocalStorageState] = useLocalStorage('darkStatus', 'dark');
  // this state tracks which page of the app we are on so that we can highlight the correct tab
  const [clickedNavbarItem, setClickedNavbarItem] = React.useState("/");

  // * handlers
  // whenever we click the darkmode toggle, this function changes the local storage state, re-rendering the function with the new style
  function handleSpecialDarkModeComponentChange() {
    console.log('ran');
      if (localStorageState === 'dark') {
        setLocalStorageState('light');
      } else {
        setLocalStorageState('dark');
      }
  }

  // * other hooks
  // when the localStorageState changes, this will add or remove a class to the body which creates the different visual style
  // if we refresh the website, it reads the cookie and determines if it should start on dark mode or not
  React.useEffect(() => {
    if (localStorageState === "dark") {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [localStorageState]);

  // * misc
  // necessary for react-router-dom routing
  const history = useNavigate();

  // * jsx
  return (
    <div className="navBarDiv">

      <ul className="navbarUl">
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history("/");
              setClickedNavbarItem("/")
            }}
            className={cx(clickedNavbarItem === "/" && "active")}
            href="/"
            >Solve
          </a>
        </li>
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history("/documentation");
              setClickedNavbarItem("/documentation")
            }}
            className={cx(clickedNavbarItem === "/documentation" && "active")}
            href="/documentation"
            >Documentation
          </a>
        </li>
      </ul>

      <Toggle clickAction={handleSpecialDarkModeComponentChange}/>

    </div>
  )
}

export default Navbar;