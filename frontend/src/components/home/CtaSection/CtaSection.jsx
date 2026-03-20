import './CtaSection.css';

const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Be Part of the Change</h2>
          <p>Your support helps us create lasting impact in communities across Khejuri</p>
          <button 
            className="btn btn-donate-cta"
            onClick={() => window.open('https://forms.gle/8Zi2bsRPW3rAWa9s8', '_blank')}
          >
            Support Our Cause
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
