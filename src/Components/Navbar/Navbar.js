import DarkButton from '@/Components/Navbar/DarkButton/DarkButton';
import NavbarListItem from '@/Components/Navbar/NavbarListItem/NavbarListItem';

import '@/Components/Navbar/Navbar.css';

/**
 * @param handleDarkClick - received from App.js, forwarded to DarkButton
 * darkModeState - received from App.js, forwarded to DarkButton
 */
export default function Navbar({ darkModeState, handleDarkClick }) {
  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <NavbarListItem route="/" tabName="Home" />
        <NavbarListItem route="/faq" tabName="FAQ" />
      </ul>
      <DarkButton
        darkModeState={darkModeState}
        handleDarkClick={handleDarkClick}
      />
    </nav>
  );
}
