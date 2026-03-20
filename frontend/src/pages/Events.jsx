import { useState, useEffect } from 'react';
import { getEvents } from '../services/api';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    const now = new Date();
    switch (filter) {
      case 'live':
        return events.filter(event => event.status === 'live');
      case 'upcoming':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && event.status !== 'live';
        });
      case 'past':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate < now && event.status !== 'live';
        });
      default:
        return events;
    }
  };

  const filteredEvents = filterEvents();

  const eventCounts = {
    all: events.length,
    live: events.filter((event) => event.status === 'live').length,
    upcoming: events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= new Date() && event.status !== 'live';
    }).length,
    past: events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < new Date() && event.status !== 'live';
    }).length,
  };

  const filterOptions = [
    { key: 'all', label: 'All Events' },
    { key: 'live', label: 'Live' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
  ];

  const getDisplayStatus = (event) => {
    if (event.status === 'live') return 'live';

    const isPast = new Date(event.date) < new Date();
    return isPast ? 'past' : 'upcoming';
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="container">
        <section className="events-hero">
          <p className="events-eyebrow">Community Calendar</p>
          <h1>Events That Move Communities Forward</h1>
          <p className="events-subtitle">
            Explore live programs, upcoming initiatives, and past events that shaped our community impact.
          </p>
          <div className="events-kpis">
            <div className="events-kpi">
              <span className="kpi-label">Total</span>
              <span className="kpi-value">{eventCounts.all}</span>
            </div>
            <div className="events-kpi">
              <span className="kpi-label">Live</span>
              <span className="kpi-value">{eventCounts.live}</span>
            </div>
            <div className="events-kpi">
              <span className="kpi-label">Upcoming</span>
              <span className="kpi-value">{eventCounts.upcoming}</span>
            </div>
            <div className="events-kpi">
              <span className="kpi-label">Past</span>
              <span className="kpi-value">{eventCounts.past}</span>
            </div>
          </div>
        </section>

        <div className="events-filter-buttons" role="tablist" aria-label="Filter events by time">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`event-filter-btn ${filter === option.key ? 'active' : ''}`}
              onClick={() => setFilter(option.key)}
            >
              <span>{option.label}</span>
              <span className="filter-count">{eventCounts[option.key]}</span>
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events-card">
            <h3>No events in this view yet</h3>
            <p>Try another filter to explore upcoming, live, or completed activities.</p>
          </div>
        ) : (
          <div className="events-list">
            {filteredEvents.map((event) => (
              <article key={event._id} className="event-item">
                <div className="event-image-wrap">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="event-image" />
                  ) : (
                    <div className="event-image-placeholder">
                      <span>{event.title.slice(0, 1).toUpperCase()}</span>
                    </div>
                  )}
                  <span className={`event-status-badge ${getDisplayStatus(event)}`}>
                    {getDisplayStatus(event) === 'live' && 'Live Now'}
                    {getDisplayStatus(event) === 'upcoming' && 'Upcoming'}
                    {getDisplayStatus(event) === 'past' && 'Completed'}
                  </span>
                </div>

                <div className="event-details">
                  <div className="event-meta-row">
                    <p className="event-date">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' • '}
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.location && (
                      <p className="event-location">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {event.location}
                      </p>
                    )}
                  </div>
                  <h2>{event.title}</h2>
                  <p className="event-description">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
