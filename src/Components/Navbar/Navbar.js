import DarkButton from '@/Components/Navbar/DarkButton/DarkButton';
import NavbarListItem from '@/Components/Navbar/NavbarListItem/NavbarListItem';

import '@/Components/Navbar/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <NavbarListItem route="/" tabName="Home" />
        <NavbarListItem route="/faq" tabName="FAQ" />
      </ul>
      <DarkButton />
    </nav>
  );
}
