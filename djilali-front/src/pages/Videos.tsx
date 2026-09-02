import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { client } from '../sanity/client';

const Videos: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(`*[_type == "video"] | order(publishedAt desc)`)
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    // Helper to get YouTube thumbnail from URL
    const getYouTubeThumbnail = (url: string) => {
        if (!url) return '/assets/images/video_studio.png';
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
        return '/assets/images/video_studio.png';
    };

    return (
        <main>
            <section className="section videos bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h2>Médiathèque Vidéo</h2>
                        <hr />
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px' }}>
                            {videos.length > 0 ? (
                                videos.map((video: any) => (
                                    <VideoCard 
                                        key={video._id}
                                        id={video._id}
                                        image={getYouTubeThumbnail(video.videoUrl)}
                                        date={video.publishedAt ? formatDate(video.publishedAt) : ''}
                                        title={video.title}
                                        excerpt={video.description?.substring(0, 100) || ''}
                                    />
                                ))
                            ) : (
                                <>
                                    <VideoCard 
                                        id="1"
                                        image="/assets/images/video_studio.png"
                                        date="12 JANVIER 2025"
                                        title="La jeune génération est plus décomplexée et porteuse d'espoir de changement (Placeholder)"
                                        excerpt="Une conversation sur les transformations nécessaires pour une Algérie démocratique."
                                    />
                                    <VideoCard 
                                        id="2"
                                        image="/assets/images/video_interview.png"
                                        date="5 JANVIER 2025"
                                        title="L'Algérie face à ses défis (Placeholder)"
                                        excerpt="Analyse des perspectives économiques et des réformes structurelles."
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Videos;
