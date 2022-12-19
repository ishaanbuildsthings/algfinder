import React from 'react';
import cx from '../../../Tools/cx';
import useLocalStorage from '../../../Tools/useLocalStorage';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useNavigate } from 'react-router-dom';

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

      <div className="darkModeToggleDiv">
        <DarkModeToggle
          mode={localStorageState} // responsible for animation of the toggle
          dark="Dark"
          light="Light"
          size="sm"
          inactiveLabelColor="white" // the color of both labels in dark mode, see inactiveTrackColor for options
          inactiveLabelColorOnHover="yellow"  // the color of the light label when you hover over it, when in dark mode
          activeLabelColorOnHover="black" // the color of the dark label when you hover over it, when in light mode
          activeLabelColor="#313131" // the color of both labels in light mode
          inactiveTrackColor="white"   // the color of the track in dark mode, default #e2e8f0, greyish option #E4E4E4
          inactiveTrackColorOnHover="#d5d5d5" // when in dark mode and you hover over the track
          inactiveTrackColorOnActive="#cbd5e1" // when you click the track from dark to light mode it briefly changes color
          activeTrackColor="#334155" // when you are in light mode, the color of the track
          activeTrackColorOnHover="#1e293b" // when you are in light mode, the color of the track on hover
          activeTrackColorOnActive="#0f172a" // when you click the track from light to dark mode it briefly changes to this
          inactiveThumbColor="#1e293b" // color of the dial in dark mode
          activeThumbColor="#e2e8f0" // color of the dial in light mode
          /* other unused properties:
              focusRingColor="" // not sure
              activeLabelColorOnActive="" // when you click dark mode, while in light mode, the color will briefly change to this
              activeLabelColorOnActive="" // when you click light mode, while in dark mode, the color will briefly change to this
          */
          className="darkModeToggle"
          onChange={handleSpecialDarkModeComponentChange}
          >
        </DarkModeToggle>
      </div>

    </div>
  )
}

export default Navbar;