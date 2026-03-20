import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getStats,
  updateStats,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getStories,
  createStory,
  updateStory,
  deleteStory,
  resolveMediaUrl
} from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [statsForm, setStatsForm] = useState({
    peopleHelped: 0,
    treesPlanted: 0,
    mealsDistributed: 0,
    eventsOrganized: 0
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    status: 'upcoming'
  });

  const [storyForm, setStoryForm] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });

  const [storyImages, setStoryImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editingStory, setEditingStory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, storiesRes] = await Promise.all([
        getStats(),
        getEvents(),
        getStories()
      ]);
      setStats(statsRes.data);
      setStatsForm(statsRes.data);
      setEvents(eventsRes.data);
      setStories(storiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Stats handlers
  const handleStatsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStats(statsForm);
      toast.success('Stats updated successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update stats');
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, eventForm);
        toast.success('Event updated successfully!');
        setEditingEvent(null);
      } else {
        await createEvent(eventForm);
        toast.success('Event created successfully!');
      }
      setEventForm({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: '',
        status: 'upcoming'
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      status: event.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  // Story handlers
  const handleStorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', storyForm.title);
      formData.append('description', storyForm.description);
      formData.append('location', storyForm.location);
      formData.append('date', storyForm.date);

      if (editingStory) {
        // Include existing images when editing
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      // Add new image files
      storyImages.forEach(file => {
        formData.append('images', file);
      });

      if (editingStory) {
        await updateStory(editingStory._id, formData);
        toast.success('Story updated successfully!');
        setEditingStory(null);
      } else {
        await createStory(formData);
        toast.success('Story created successfully!');
      }

      setStoryForm({
        title: '',
        description: '',
        location: '',
        date: ''
      });
      setStoryImages([]);
      setExistingImages([]);
      // Reset file input
      const fileInput = document.getElementById('story-images');
      if (fileInput) fileInput.value = '';

      fetchData();
    } catch (error) {
      toast.error('Failed to save story');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryEdit = (story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      description: story.description,
      location: story.location || '',
      date: new Date(story.date).toISOString().slice(0, 10)
    });
    setExistingImages(story.images || []);
    setStoryImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(id);
        toast.success('Story deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete story');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          Stories
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>Update Statistics</h2>
            <form onSubmit={handleStatsSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Rural Families Supported</label>
                  <input
                    type="number"
                    value={statsForm.peopleHelped}
                    onChange={(e) => setStatsForm({...statsForm, peopleHelped: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Trees Planted</label>
                  <input
                    type="number"
                    value={statsForm.treesPlanted}
                    onChange={(e) => setStatsForm({...statsForm, treesPlanted: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Meals Distributed</label>
                  <input
                    type="number"
                    value={statsForm.mealsDistributed}
                    onChange={(e) => setStatsForm({...statsForm, mealsDistributed: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Health Camps Conducted</label>
                  <input
                    type="number"
                    value={statsForm.eventsOrganized}
                    onChange={(e) => setStatsForm({...statsForm, eventsOrganized: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Statistics'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleEventSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({...eventForm, status: e.target.value})}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({...eventForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
                {editingEvent && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingEvent(null);
                      setEventForm({
                        title: '',
                        description: '',
                        date: '',
                        location: '',
                        imageUrl: '',
                        status: 'upcoming'
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 className="list-title">All Events</h3>
            <div className="items-list">
              {events.map((event) => (
                <div key={event._id} className="item-card">
                  <div className="item-info">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <span className={`status-badge ${event.status}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleEventEdit(event)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleEventDelete(event._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="stories-section">
            <h2>{editingStory ? 'Edit Story' : 'Create New Story'}</h2>
            <form onSubmit={handleStorySubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={storyForm.description}
                  onChange={(e) => setStoryForm({...storyForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload Images (Multiple) *</label>
                <input
                  id="story-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setStoryImages(Array.from(e.target.files))}
                />
                <small style={{display: 'block', marginTop: '8px', color: '#666'}}>
                  You can select multiple images (JPEG, PNG, GIF, WebP). Max 5MB per image.
                </small>
              </div>
              {existingImages.length > 0 && (
                <div className="form-group">
                  <label>Existing Images</label>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'}}>
                    {existingImages.map((img, idx) => (
                      <div key={idx} style={{position: 'relative', display: 'inline-block'}}>
                        <img 
                          src={resolveMediaUrl(img)} 
                          alt={`Existing ${idx + 1}`}
                          style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <button
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            lineHeight: '1'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {storyImages.length > 0 && (
                <div className="form-group">
                  <label>New Images to Upload ({storyImages.length})</label>
                  <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px'}}>
                    {Array.from(storyImages).map((file, idx) => (
                      <div key={idx} style={{textAlign: 'center'}}>
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${idx + 1}`}
                          style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        <small style={{display: 'block', marginTop: '4px', fontSize: '11px'}}>
                          {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={storyForm.location}
                    onChange={(e) => setStoryForm({...storyForm, location: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={storyForm.date}
                    onChange={(e) => setStoryForm({...storyForm, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingStory ? 'Update Story' : 'Create Story')}
                </button>
                {editingStory && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingStory(null);
                      setStoryForm({
                        title: '',
                        description: '',
                        location: '',
                        date: ''
                      });
                      setStoryImages([]);
                      setExistingImages([]);
                      const fileInput = document.getElementById('story-images');
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 className="list-title">All Stories</h3>
            <div className="items-list">
              {stories.map((story) => (
                <div key={story._id} className="item-card">
                  <div className="item-info">
                    <h4>{story.title}</h4>
                    <p>{story.description}</p>
                    {story.images && story.images.length > 0 && (
                      <small style={{color: '#3498db', marginTop: '8px', display: 'block'}}>
                       {story.images.length} image{story.images.length !== 1 ? 's' : ''}
                      </small>
                    )}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleStoryEdit(story)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStoryDelete(story._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
