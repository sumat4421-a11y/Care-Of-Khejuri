import { useState, useEffect } from 'react';
import { getEvents, getStats } from '../services/api';
import HeroSection from '../components/home/HeroSection';
import ImpactSection from '../components/home/ImpactSection/ImpactSection';
import PillarsSection from '../components/home/PillarsSection';

import EventsSection from '../components/home/EventsSection/EventsSection';
import CtaSection from '../components/home/CtaSection/CtaSection';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        getStats(),
        getEvents()
      ]);
      
      setStats(statsRes.data);
      
      const now = new Date();
      const upcoming = eventsRes.data
        .filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now || event.status === 'live';
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      
      setRecentEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <HeroSection />
      <ImpactSection stats={stats} />
      <PillarsSection />
      <EventsSection recentEvents={recentEvents} />
      <CtaSection />
    </div>
  );
};

export default Home;
