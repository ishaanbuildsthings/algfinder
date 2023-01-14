import { useNavigate, useLocation } from 'react-router-dom';
import cx from '../../Utils/cx';

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
            className={cx(location.pathname === route && 'active accentColor')}
            href={route}
          >
            {tabName}
          </a>
        </li>
  );
}