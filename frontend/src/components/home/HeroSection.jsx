import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1 className="hero-title">Care Of Khejuri</h1>
          <p className="hero-subtitle-bengali">
            মানবতার স্বার্থে, মানুষের পাশে
          </p>
          <p className="hero-subtitle-english">
            For Humanity, Beside the People
          </p>
          
          <div className="mission-statement">
            "To build a resilient coastal community through focused action in nutrition, rural health, youth development, and biodiversity protection."
          </div>

          <div className="hero-buttons">
            <button 
              className="btn btn-donate-hero"
              onClick={() => window.open('https://forms.gle/8Zi2bsRPW3rAWa9s8', '_blank')}
            >
              Donate Now
            </button>
            <Link to="/events" className="btn btn-secondary-hero">
              Our Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
