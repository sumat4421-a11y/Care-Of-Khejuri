import './ImpactSection.css';

const ImpactSection = ({ stats }) => {
  const impactItems = [
    {
      key: 'meals',
      label: 'Meals Distributed',
      value: stats?.mealsDistributed?.toLocaleString() || 0,
      image: '/images/impact/meals-distributed.png',
      fallback: '/logo.jpg',
    },
    {
      key: 'families',
      label: 'Rural Families Supported',
      value: stats?.peopleHelped?.toLocaleString() || 0,
      image: '/images/impact/rural-families-supported.png',
      fallback: '/logo.jpg',
    },
    {
      key: 'trees',
      label: 'Trees Plantation',
      value: stats?.treesPlanted?.toLocaleString() || 0,
      image: '/images/impact/trees-planted.png',
      fallback: '/logo.jpg',
    },
    {
      key: 'health-camps',
      label: 'Health Camps Conducted',
      value: stats?.eventsOrganized?.toLocaleString() || 0,
      image: '/images/impact/health-camps-conducted.png',
      fallback: '/logo.jpg',
    },
  ];

  return (
    <section className="impact-section">
      <div className="container">
        <h2 className="section-title">Our Impact</h2>
        <p className="section-subtitle">Creating meaningful change in communities</p>
        <div className="stats-grid">
          {impactItems.map((item) => (
            <div className="stat-card" key={item.key}>
              <div className="stat-icon">
                <img
                  src={item.image}
                  alt={item.label}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = item.fallback;
                  }}
                />
              </div>
              <div className="stat-number">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
