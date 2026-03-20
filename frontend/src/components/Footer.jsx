import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.jpg" alt="Care Of Khejuri Logo" className="footer-logo-img" />
              <h3>Care Of Khejuri</h3>
            </div>
            <p>Making a difference in our community, one step at a time.</p>
            <ul className="footer-registration-list">
              <li>Government Registered Non-Profit</li>
              <li>NGO Darpan Registered (NITI Aayog)</li>
              <li>12A &amp; 80G Certified</li>
              <li>CSR-1 Registered</li>
            </ul>
            {/* <p className="footer-bengali">কেয়ার অফ খেজুরী</p> */}
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/stories">Stories</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: careofkhejuri@gmail.com</p>
            <p>Phone: +91 7063029326</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; 2025 Care Of Khejuri. All rights reserved.</p>
            <p className="developer-note">
              Developed by SM. If you want to build something and need tech-related consulting, text to{' '}
              <a href="mailto:smchowdhuri69@gmail.com">smchowdhuri69@gmail.com</a>.
            </p>
          </div>
          <Link to="/admin/login" className="admin-link" title="Admin">
            <small style={{ opacity: 0.5, cursor: 'pointer' }}>Admin</small>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
