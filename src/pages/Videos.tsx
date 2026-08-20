import React from 'react';
import VideoCard from '../components/VideoCard';

const Videos: React.FC = () => {
    return (
        <main>
            <section className="section videos bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h2>Médiathèque Vidéo</h2>
                        <hr />
                    </div>
                    <div className="cards-grid" style={{ marginTop: '40px' }}>
                        <VideoCard 
                            id="1"
                            image="/assets/images/video_studio.png"
                            date="12 JANVIER 2025"
                            title="La jeune génération est plus décomplexée et porteuse d'espoir de changement"
                            excerpt="Une conversation sur les transformations nécessaires pour une Algérie démocratique."
                        />
                        <VideoCard 
                            id="2"
                            image="/assets/images/video_interview.png"
                            date="5 JANVIER 2025"
                            title="L'Algérie face à ses défis"
                            excerpt="Analyse des perspectives économiques et des réformes structurelles."
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Videos;
