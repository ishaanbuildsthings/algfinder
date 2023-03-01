import DarkButton from '../DarkButton/DarkButton';
import NavbarListItem from '../NavbarListItem/NavbarListItem';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <NavbarListItem route={'/'} tabName="Home" />
        <NavbarListItem route={'/faq'} tabName="FAQ" />
      </ul>
      <DarkButton />
    </nav>
  );
}

export default Navbar;
