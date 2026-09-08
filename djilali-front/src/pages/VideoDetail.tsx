import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { hasArabic, getLocalizedText } from '../utils/localization';

const VideoDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { lang, setLang } = useLanguage();

    useEffect(() => {
        if (id) {
            client.fetch(`*[_type == "video" && _id == $id][0]`, { id })
                .then((data) => {
                    setVideo(data);
                    setLoading(false);
                })
                .catch(console.error);
        } else {
            setLoading(false);
        }
    }, [id]);

    const formattedDate = video?.publishedAt
        ? new Date(video.publishedAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase()
        : '';

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

    const embedUrl = getEmbedUrl(video?.videoUrl);
    const isArabicMissing = lang === 'ar' && video && !hasArabic(video, 'title');
    const videoTitle = video ? getLocalizedText(video, 'title', lang) : '';
    const videoDesc = video ? getLocalizedText(video, 'description', lang) : '';

    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', minHeight: '60vh' }}>
                    <Link to="/videos" className="back-link">
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
                                    to="/videos" 
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

                            {formattedDate && <span className="date">{formattedDate}</span>}
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
            </section>
        </main>
    );
};

export default VideoDetail;
