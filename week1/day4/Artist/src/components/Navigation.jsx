import {Link, useLocation} from 'react-router-dom';

const constants = {
  pages: [
    {path: '/', title: 'Home'},
    {path: '/draw', title: 'Draw'},
    {path: '/trade', title: 'Trade'},
  ]
};

function Navigation(props) {
  const location = useLocation();

  return (
    <div id="Navigation">
      <div className="tabs is-boxed is-fullwidth">
        <ul>
          {constants.pages.map((page) => {
            const isActive = page.path === location.pathname;
            return (
              <li key={page.path} className={isActive ? 'is-active': ''}>
                <Link to={page.path}>{page.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;