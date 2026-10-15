import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { hasArabic, getLocalizedText, filterByLang } from '../utils/localization';
import VideoCard from '../components/VideoCard';

const VideoDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<any>(null);
    const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
    const [isSeriesMode, setIsSeriesMode] = useState<boolean>(false);
    const [seriesData, setSeriesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { lang, setLang } = useLanguage();
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollPrev = () => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector('.card') as HTMLElement;
            const scrollDistance = card ? card.offsetWidth + 20 : 300;
            carouselRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector('.card') as HTMLElement;
            const scrollDistance = card ? card.offsetWidth + 20 : 300;
            carouselRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    };

    const fetchRecentVideos = (currentId: string) => {
        client.fetch(`*[_type == "video" && _id != $currentId] | order(publishedAt desc)[0...6]{
            _id,
            title,
            title_ar,
            videoUrl,
            publishedAt,
            description,
            description_ar,
            episode,
            seriesOrder,
            series->{_id, title, title_ar, slug}
        }`, { currentId })
            .then((recentItems) => {
                setRelatedVideos(recentItems || []);
                setIsSeriesMode(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            setIsSeriesMode(false);
            setSeriesData(null);

            client.fetch(`*[_type == "video" && _id == $id][0]{
                _id,
                title,
                title_ar,
                videoUrl,
                publishedAt,
                description,
                description_ar,
                episode,
                seriesOrder,
                series->{_id, title, title_ar, slug, description, description_ar}
            }`, { id })
                .then((data) => {
                    setVideo(data);
                    setLoading(false);

                    if (!data) return;
                    const currentId = data._id;

                    // If video belongs to a series -> fetch other episodes of that series
                    if (data.series?._id) {
                        const seriesId = data.series._id;
                        client.fetch(`*[_type == "video" && series._ref == $seriesId && _id != $currentId] | order(episode asc, seriesOrder asc, publishedAt asc){
                            _id,
                            title,
                            title_ar,
                            videoUrl,
                            publishedAt,
                            description,
                            description_ar,
                            episode,
                            seriesOrder,
                            series->{_id, title, title_ar, slug}
                        }`, { seriesId, currentId })
                            .then((seriesItems) => {
                                if (seriesItems && seriesItems.length > 0) {
                                    setRelatedVideos(seriesItems);
                                    setIsSeriesMode(true);
                                    setSeriesData(data.series);
                                } else {
                                    fetchRecentVideos(currentId);
                                }
                            })
                            .catch((err) => {
                                console.error('Error fetching series videos:', err);
                                fetchRecentVideos(currentId);
                            });
                    } else {
                        fetchRecentVideos(currentId);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id]);

    const formattedDate = video?.publishedAt
        ? new Date(video.publishedAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase()
        : '';

    const formatCardDate = (dateString: string) => {
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

    // Helper to convert standard youtube links to embed links
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
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

    const embedUrl = getEmbedUrl(video?.videoUrl);
    const isArabicMissing = lang === 'ar' && video && !hasArabic(video, 'title');
    const videoTitle = video ? getLocalizedText(video, 'title', lang) : '';
    const videoDesc = video ? getLocalizedText(video, 'description', lang) : '';

    const currentEpisodeNum = video?.episode ?? video?.seriesOrder;
    const currentEpisodeBadge = currentEpisodeNum !== undefined && currentEpisodeNum !== null
        ? `${t('episode_number', lang)} ${currentEpisodeNum}`
        : null;

    const filteredRelatedVideos = filterByLang(relatedVideos, lang);

    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', minHeight: '60vh' }}>
                    <Link to={`/${lang}/videos`} className="back-link">
                        <span className="back-arrow">←</span>
                        <span>{t('back_to_videos', lang)}</span>
                    </Link>
                    
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>{t('loading', lang)}</p>
                    ) : isArabicMissing ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            background: '#f9f9f9',
                            borderRadius: '12px',
                            border: '1px solid #eaeaea',
                            margin: '30px 0'
                        }}>
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '15px' }}>ℹ️</span>
                            <h2 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>
                                {t('no_arabic_content', lang)}
                            </h2>
                            <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.05rem' }}>
                                لم تتم إضافة عنوان أو وصف هذا الفيديو باللغة العربية بعد. يمكنك مشاهدته والاطلاع على النسخة الفرنسية.
                            </p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={() => setLang('fr')} 
                                    className="btn-submit"
                                    style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    {t('view_in_french', lang)}
                                </button>
                                <Link 
                                    to={`/${lang}/videos`} 
                                    className="back-link-btn"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '6px', border: '1px solid #ccc', textDecoration: 'none', color: '#333' }}
                                >
                                    <span className="back-arrow">←</span>
                                    <span>{t('back_to_videos', lang)}</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <motion.div 
                                style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: '8px', marginBottom: '30px' }}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                {embedUrl ? (
                                    <iframe 
                                        src={embedUrl} 
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        allowFullScreen
                                        title={videoTitle || "Video"}
                                    ></iframe>
                                ) : (
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                            <div style={{ width: '0', height: '0', borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '25px solid white', marginLeft: '10px' }}></div>
                                        </div>
                                        <p>{lang === 'ar' ? 'قارئ الفيديو (YouTube / Vimeo)' : 'Lecteur Vidéo (YouTube / Vimeo)'}</p>
                                    </div>
                                )}
                            </motion.div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', margin: '5px 0 15px' }}>
                                {formattedDate && <span className="date" style={{ margin: 0 }}>{formattedDate}</span>}
                                {video?.series && (
                                    <span 
                                        className="card-tag card-tag-series"
                                        style={{
                                            background: 'var(--primary-color, #1a202c)',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.78rem',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {getLocalizedText(video.series, 'title', lang) || video.series.title}
                                        {currentEpisodeBadge ? ` • ${currentEpisodeBadge}` : ''}
                                    </span>
                                )}
                                {!video?.series && currentEpisodeBadge && (
                                    <span 
                                        className="card-tag card-tag-series"
                                        style={{
                                            background: 'var(--primary-color, #1a202c)',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.78rem',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {currentEpisodeBadge}
                                    </span>
                                )}
                            </div>

                            <motion.h1 
                                style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '10px 0 20px' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {videoTitle || (lang === 'ar' ? 'فيديو بدون عنوان' : 'Vidéo sans titre')}
                            </motion.h1>
                            <motion.p 
                                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)', whiteSpace: 'pre-line' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {videoDesc || (lang === 'ar' ? 'لا يوجد وصف متاح لهذا الفيديو.' : 'Aucune description disponible pour cette vidéo.')}
                            </motion.p>
                        </>
                    )}
                </div>

                {/* --- RECOMMENDED / SERIES VIDEOS SECTION --- */}
                {filteredRelatedVideos.length > 0 && !isArabicMissing && (
                    <motion.div 
                        className="container" 
                        style={{ 
                            maxWidth: '1240px', 
                            margin: '80px auto 30px auto', 
                            paddingTop: '50px',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ marginBottom: '35px' }}>
                            <h3 style={{ 
                                fontFamily: 'var(--font-serif)', 
                                fontSize: '2rem', 
                                color: 'var(--primary-color)', 
                                margin: '0 0 10px 0',
                                lineHeight: 1.3
                            }}>
                                {isSeriesMode 
                                    ? `${t('in_same_series', lang)} : ${getLocalizedText(seriesData, 'title', lang) || seriesData?.title || ''}`
                                    : t('recommended_videos', lang)
                                }
                            </h3>

                            {isSeriesMode && getLocalizedText(seriesData, 'description', lang) && (
                                <p style={{ color: '#666', fontSize: '1.05rem', margin: 0, maxWidth: '700px' }}>
                                    {getLocalizedText(seriesData, 'description', lang)}
                                </p>
                            )}
                            {!isSeriesMode && (
                                <p style={{ color: '#666', fontSize: '1.05rem', margin: 0 }}>
                                    {t('explore_more_videos', lang)}
                                </p>
                            )}
                        </div>

                        {filteredRelatedVideos.length > 4 ? (
                            <div className="related-carousel-wrapper">
                                <button className="carousel-btn prev-btn" aria-label="Previous" onClick={scrollPrev}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <div className="related-grid-carousel" ref={carouselRef}>
                                    {filteredRelatedVideos.map((item: any, index: number) => {
                                        const epNum = item.episode ?? item.seriesOrder;
                                        const seriesBadge = isSeriesMode
                                            ? `${t('episode_number', lang)} ${epNum !== undefined && epNum !== null ? epNum : index + 1}`
                                            : (epNum !== undefined && epNum !== null ? `${t('episode_number', lang)} ${epNum}` : undefined);

                                        return (
                                            <VideoCard 
                                                key={item._id}
                                                id={item._id}
                                                image={getYouTubeThumbnail(item.videoUrl)}
                                                date={item.publishedAt ? formatCardDate(item.publishedAt) : ''}
                                                title={getLocalizedText(item, 'title', lang)}
                                                excerpt={getLocalizedText(item, 'description', lang)?.substring(0, 100) || ''}
                                                seriesBadge={seriesBadge}
                                            />
                                        );
                                    })}
                                </div>
                                <button className="carousel-btn next-btn" aria-label="Next" onClick={scrollNext}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="related-grid-static">
                                {filteredRelatedVideos.map((item: any, index: number) => {
                                    const epNum = item.episode ?? item.seriesOrder;
                                    const seriesBadge = isSeriesMode
                                        ? `${t('episode_number', lang)} ${epNum !== undefined && epNum !== null ? epNum : index + 1}`
                                        : (epNum !== undefined && epNum !== null ? `${t('episode_number', lang)} ${epNum}` : undefined);

                                    return (
                                        <VideoCard 
                                            key={item._id}
                                            id={item._id}
                                            image={getYouTubeThumbnail(item.videoUrl)}
                                            date={item.publishedAt ? formatCardDate(item.publishedAt) : ''}
                                            title={getLocalizedText(item, 'title', lang)}
                                            excerpt={getLocalizedText(item, 'description', lang)?.substring(0, 100) || ''}
                                            seriesBadge={seriesBadge}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </section>
        </main>
    );
};

export default VideoDetail;
