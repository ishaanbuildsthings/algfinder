import DarkButton from './DarkButton/DarkButton';
import NavbarListItem from './NavbarListItem/NavbarListItem';

import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <NavbarListItem route={'/'} tabName="Home" />
        <NavbarListItem route={'/faq'} tabName="FAQ" />
      </ul>
      <DarkButton />
    </nav>
  );
};