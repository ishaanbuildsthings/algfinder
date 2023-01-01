import { useNavigate, useLocation } from 'react-router-dom';
import cx from '../../cx';
import Toggle from '../Toggle/Toggle.js';
import './Navbar.css';

function Navbar() {
  // * misc
  // necessary for react-router-dom routing
  const history = useNavigate();
  // necessary for parsing the current URL to display the correct .active CSS coloring
  const location = useLocation();

  return (
    <nav className="navbarDiv">
      <ul className="navbarUl">
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history('/');
            }}
            className={cx(location.pathname === '/' && 'active accentColor')}
            href="/"
          >
            Solve
          </a>
        </li>
        <li className="navbarItem">
          <a
            onClick={(e) => {
              e.preventDefault();
              history("/documentation");
            }}
            className={cx(location.pathname === '/documentation' && 'active accentColor')}
            href="/documentation"
          >
            Documentation
          </a>
        </li>
      </ul>

      <Toggle />
    </nav>
  );
}

export default Navbar;
