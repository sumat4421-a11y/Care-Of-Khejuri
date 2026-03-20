import { useState, useEffect } from 'react';
import { getStories, resolveMediaUrl } from '../services/api';
import './Stories.css';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const openImageViewer = (src, alt) => {
    setSelectedImage({ src, alt });
  };

  const fetchStories = async () => {
    try {
      const response = await getStories();
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading stories...</div>;
  }

  return (
    <div className="stories-page">
      <div className="container">
        <h1>Our Stories</h1>
        <p className="subtitle">Journey of transformation and impact</p>

        {stories.length === 0 ? (
          <p className="no-stories">No stories available yet.</p>
        ) : (
          <div className="stories-feed">
            {stories.map((story) => (
              <div key={story._id} className="story-post">
                <div className="post-header">
                  <div className="post-info">
                    <h2 className="post-title">{story.title}</h2>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(story.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {story.location && (
                        <span className="post-location">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: '4px', verticalAlign: 'middle'}}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {story.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="post-content">
                  <p className="post-description">{story.description}</p>
                </div>

                {story.images && story.images.length > 0 && (
                  <div className={`post-images grid-${Math.min(story.images.length, 4)}`}>
                    {story.images.slice(0, 5).map((img, idx) => (
                      <div
                        key={idx}
                        className="post-image-wrapper"
                        role="button"
                        tabIndex={0}
                        onClick={() => openImageViewer(resolveMediaUrl(img), `${story.title} - ${idx + 1}`)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openImageViewer(resolveMediaUrl(img), `${story.title} - ${idx + 1}`);
                          }
                        }}
                        aria-label={`Open image ${idx + 1} from ${story.title}`}
                      >
                        <img 
                          src={resolveMediaUrl(img)} 
                          alt={`${story.title} - ${idx + 1}`}
                          className="post-image"
                        />
                        {idx === 4 && story.images.length > 5 && (
                          <div className="image-overlay">
                            +{story.images.length - 5}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="story-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="story-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="story-lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image viewer"
            >
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} className="story-lightbox-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
