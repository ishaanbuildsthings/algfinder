import React from 'react';
import cx from '../tools/cx';
import useLocalStorage from '../tools/useLocalStorage';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const history = useNavigate();

  // our local storage for the darkmode component
  const [localStorageStateComponent, setLocalStorageStateComponent] = useLocalStorage('darkStatus', 'dark');

  // whenever we click the special darkmode component, this function runs
  // the function will set the state of our component, causing it to rerender
  function handleSpecialDarkModeComponentChange() {
      if (localStorageStateComponent === 'dark') {
        setLocalStorageStateComponent('light');
      } else {
        setLocalStorageStateComponent('dark');
      }
  }

  const [clickedNavbarItem, setClickedNavbarItem] = React.useState("/");

  // whenever the component re-renders, if the state has changed, update the light mode on the body
  // useful for page refresh as well
  React.useEffect(() => {
    if (localStorageStateComponent === "dark") {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [localStorageStateComponent]);

  //! const [mouseOnSunMoonIconState, setMouseOnSunMoonIconState] = React.useState(false);
  //! const [localStorage, setLocalStorage] = useLocalStorage("moon");

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
        // responsible for animation of the toggle
          mode={localStorageStateComponent}
        dark="Dark"
        light="Light"
        size="sm"

        // the color of both labels in dark mode, see inactiveTrackColor for options
        inactiveLabelColor="white"
        // the color of the light label when you hover over it, when in dark mode
        inactiveLabelColorOnHover="yellow"
        // the color of the dark label when you hover over it, when in light mode
        activeLabelColorOnHover="black"
        // when you click light mode, while in dark mode, it will briefly change to this
        // inactiveLabelColorOnActive=""
        // the color of both labels in light mode
        activeLabelColor="#313131"
        // when you click dark mode, while in light mode, it will briefly change to this
        // activeLabelColorOnActive=""
        // the color of the track in dark mode, default #e2e8f0, greyish option #E4E4E4
        inactiveTrackColor="white"
        // when in dark mode and you hover over the track
        inactiveTrackColorOnHover="#d5d5d5"
        // when you click the track from dark to light mode it briefly changes color
        inactiveTrackColorOnActive="#cbd5e1"
        // when you are in light mode, the color of the track
        activeTrackColor="#334155"
        // when you are in light mode, the color of the track on hover
        activeTrackColorOnHover="#1e293b"
        // when you click the track from light to dark mode it briefly changes to this
        activeTrackColorOnActive="#0f172a"
        // color of the dial in dark mode
        inactiveThumbColor="#1e293b"
        // color of the dial in light mode
        activeThumbColor="#e2e8f0"
        // not sure
        // focusRingColor=""
        className="darkModeToggle"
        onChange={handleSpecialDarkModeComponentChange}
        ></DarkModeToggle>
      </div>

    </div>
  )
}

export default Navbar;