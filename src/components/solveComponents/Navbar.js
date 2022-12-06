import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  return (
    <ul className="navbarUl">
      <li className="navbarItem"><a className="active" href="/Solve">Solve</a></li>
      <li className="navbarItem"><a href="/About">About</a></li>
      <li className="navbarItem"><a href="/How this tool works">How this tool works</a></li>
      <li className="navbarSunMoon"><button className="sunMoonButton"><FontAwesomeIcon icon={faSun} /></button></li>
    </ul>
  )
}

export default Navbar;