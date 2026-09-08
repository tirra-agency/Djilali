import React, { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { filterByLang, getLocalizedText } from '../utils/localization';

const Videos: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();

    useEffect(() => {
        client.fetch(`*[_type == "video"] | order(publishedAt desc)`)
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        if (lang === 'ar') {
            return new Date(dateString).toLocaleDateString('ar-DZ', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

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

    const displayedVideos = filterByLang(videos, lang);

    return (
        <main>
            <section className="section videos bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h2>{lang === 'ar' ? 'المكتبة المرئية' : 'Médiathèque Vidéo'}</h2>
                        <hr />
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>{t('loading', lang)}</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px' }}>
                            {displayedVideos.length > 0 ? (
                                displayedVideos.map((video: any) => (
                                    <VideoCard 
                                        key={video._id}
                                        id={video._id}
                                        image={getYouTubeThumbnail(video.videoUrl)}
                                        date={video.publishedAt ? formatDate(video.publishedAt) : ''}
                                        title={getLocalizedText(video, 'title', lang)}
                                        excerpt={getLocalizedText(video, 'description', lang).substring(0, 100)}
                                    />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem 0', color: '#666' }}>
                                    {lang === 'ar' ? t('no_arabic_videos', lang) : "D'autres vidéos seront ajoutées prochainement."}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Videos;
