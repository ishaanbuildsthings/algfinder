import { useNavigate, useLocation } from 'react-router-dom';

import cx from '@/utils/cx.js';

/**
 * @param
 * route - the path for the navbar item
 * tabName - the name of the tab
 * @usage - used in Navbar.js
 */
export default function NavbarListItem({ route, tabName }) {
  // necessary for react-router-dom routing
  const history = useNavigate();
  // necessary for parsing the current URL to display the correct .active CSS coloring
  const location = useLocation();
  return (
    <li className="navbarItem">
      <a
        onClick={(e) => {
          e.preventDefault();
          history(route);
        }}
        className={cx(
          location.pathname === route && 'accentColor accentColorText',
          tabName
        )}
        href={route}
      >
        {tabName}
      </a>
    </li>
  );
}
