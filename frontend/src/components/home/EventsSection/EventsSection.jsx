import { Link } from 'react-router-dom';
import './EventsSection.css';

const EventsSection = ({ recentEvents }) => {
  if (!recentEvents || recentEvents.length === 0) return null;

  return (
    <section className="home-events-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Join us in making a difference</p>
          </div>
          <Link to="/events" className="btn btn-outline">View All Events →</Link>
        </div>
        <div className="events-grid-home">
          {recentEvents.map((event) => (
            <div key={event._id} className="event-card-home">
              {event.status === 'live' && (
                <span className="live-badge">🔴 LIVE NOW</span>
              )}
              {event.imageUrl && (
                <div className="event-image-wrapper">
                  <img src={event.imageUrl} alt={event.title} />
                  <div className="event-overlay"></div>
                </div>
              )}
              <div className="event-content-home">
                <h3>{event.title}</h3>
                <p className="event-description">
                  {event.description.length > 140
                    ? `${event.description.substring(0, 140)}...`
                    : event.description}
                </p>

                <div className="event-meta-chips">
                  <span className="event-meta-chip">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>

                  <span className="event-meta-chip">
                    {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>

                  {event.location && (
                    <span className="event-meta-chip event-location-chip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{marginRight: '4px'}}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
