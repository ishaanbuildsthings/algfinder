import NavbarListItem from '../NavbarListItem/NavbarListItem';
import Toggle from '../Toggle/Toggle.js';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <NavbarListItem route={'/'} />
        <NavbarListItem route={'documentation'} />
      </ul>

      <Toggle />
    </nav>
  );
}

export default Navbar;
