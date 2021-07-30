import {Link} from 'react-router-dom';

import './Header.css';

function Header(props) {
  return (
    <section id="Header">
      <div id="Hero">
        <h1 className="title">
          <Link to="/">
            Local Artist
          </Link>
        </h1>
        <h2 className="subtitle">Paint pictures and trade</h2>
      </div>
    </section>
  );
}

export default Header;