import './PillarsSection.css';

const PillarsSection = () => {
  return (
    <section className="pillars-section">
      <div className="container">
        <h2 className="section-title">Our Four Pillars</h2>
        <p className="section-subtitle">Building sustainable communities through focused initiatives</p>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <img src="/plant.jpg" alt="Child Nutrition & Plant-Based Support" className="pillar-icon-img" />
            </div>
            <h3>1️⃣ Child Nutrition & Plant-Based Support</h3>
            <p>Promoting healthy living through sustainable food practices and nutrition awareness.</p>
            <div className="pillar-divider"></div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <img src="/healthandwellness.png" alt="Rural Health & TB Patient Support" className="pillar-icon-img" />
            </div>
            <h3>2️⃣ Rural Health & TB Patient Support</h3>
            <p>Providing medical camps, health awareness programs, and basic treatment facilities.</p>
            <div className="pillar-divider"></div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <img src="/skillsyouth.jpg" alt="Coastal Youth Sports & Skill Development" className="pillar-icon-img" />
            </div>
            <h3>3️⃣ Coastal Youth Sports & Skill Development</h3>
            <p>Training → Skill Development → Employment opportunities for sustainable futures.</p>
            <div className="pillar-divider"></div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon-wrapper">
              <img src="/waste.jpg" alt="Biodiversity Protection & Environmental Awreness" className="pillar-icon-img" />
            </div>
            <h3>4️⃣ Biodiversity Protection & Environmental Awreness</h3>
            <p>Recycling initiatives, environmental awareness, and eco-friendly community projects.</p>
            <div className="pillar-divider"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
