import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <span className="logo-avatar">
              <img src="/logo.jpg" alt="Care Of Khejuri Logo" className="logo-img" />
            </span>
            <h1>Care Of Khejuri</h1>
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/stories">Stories</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
