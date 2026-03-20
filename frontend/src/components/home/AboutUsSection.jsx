import { useEffect, useState } from 'react';
import './AboutUsSection.css';

const AboutUsSection = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const aboutGalleryImages = Array.from(
        { length: 12 },
        (_, index) => `/images/aboutUs/cokimg${index + 1}.jpg`
    );

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

    return (
        <section className="about-us-section">
            <div className="container">
                <div className="about-us-content">
                    <div className="about-us-text">
                        {/* <h2 className="section-title">About Us</h2> */}
                        <h3 className="about-us-subtitle">Building a Stronger, Greener, Inclusive Coastal Future</h3>
                        <p className="about-text">
                            Care of Khejuri is a community-driven voluntary organization based in Khejuri, in the coastal region of Purba Medinipur, West Bengal, India. The organization works at the grassroots level with the aim of empowering local communities, protecting the environment, and creating sustainable development opportunities.
                        </p>
                        <p className="about-text">
                            Our initiatives focus on building awareness, supporting livelihoods, and encouraging youth participation in social change. Being located in a coastal and ecologically sensitive region, we actively work on environmental conservation, wildlife awareness, and coastal sustainability.
                        </p>
                        <p className="about-text">
                            Care of Khejuri believes that meaningful development begins within the community. Through collaboration with local residents, volunteers, institutions, and government bodies, we organize awareness programs, cultural initiatives, training workshops, and social campaigns that address real challenges faced by the region.
                        </p>
                        <p className="about-text about-pillars-intro">Our work is guided by four key pillars:</p>
                        <ol className="pillars-list">
                            <li>
                                <strong>Community Development:</strong> We work with local communities to improve education, awareness, and social well-being through grassroots initiatives.
                            </li>
                            <li>
                                <strong>Environment and Wildlife Conservation:</strong> The coastal belt of Khejuri is rich in biodiversity. We conduct awareness programs, conservation activities, and campaigns to protect local ecosystems and wildlife.
                            </li>
                            <li>
                                <strong>Youth Engagement and Culture:</strong> We encourage youth leadership through cultural events, training programs, and community participation, helping young people become responsible citizens.
                            </li>
                            <li>
                                <strong>Sustainable Livelihoods:</strong> Care of Khejuri promotes innovative livelihood initiatives such as recycling projects, skill development, and community-based economic opportunities, especially for women and marginalized groups.
                            </li>
                        </ol>
                        <p className="about-text highlight">
                            Through partnerships, volunteerism, and local participation, Care of Khejuri aims to build a stronger, greener, and more inclusive future for coastal communities.
                        </p>
                        <div className="registration-info">
                            <span className="reg-badge">Government Registered Non-Profit</span>
                            <span className="reg-badge">NGO Darpan Registered (NITI Aayog)</span>
                            <span className="reg-badge">12A & 80G Certified</span>
                            <span className="reg-badge">CSR-1 Registered</span>
                        </div>
                    </div>
                    
                    <div className="about-us-gallery-panel">
                        {/* <h4 className="gallery-title">Our Work in Action</h4> */}
                        <div className="about-us-gallery">
                            {aboutGalleryImages.map((imageSrc, index) => (
                                <button
                                    type="button"
                                    className="gallery-img-container"
                                    key={imageSrc}
                                    onClick={() => setSelectedImage({
                                        src: imageSrc,
                                        alt: `Care of Khejuri Activity ${index + 1}`,
                                    })}
                                    aria-label={`Open image ${index + 1} in large view`}
                                >
                                    <img
                                        src={imageSrc}
                                        alt={`Care of Khejuri Activity ${index + 1}`}
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div
                    className="about-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Expanded photo view"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="about-lightbox-content"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="about-lightbox-close"
                            onClick={() => setSelectedImage(null)}
                            aria-label="Close photo viewer"
                        >
                            ×
                        </button>
                        <img src={selectedImage.src} alt={selectedImage.alt} className="about-lightbox-image" />
                    </div>
                </div>
            )}
        </section>
    );
};

export default AboutUsSection;
