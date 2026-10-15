import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageProvider';

interface VideoCardProps {
    id: string;
    image: string;
    date: string;
    title: string;
    excerpt: string;
    seriesBadge?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, image, date, title, excerpt, seriesBadge }) => {
    const { lang } = useLanguage();

    return (
        <motion.article 
            className="card video-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <Link to={`/${lang}/videos/${id}`}>
                <div className="video-thumbnail">
                    <img src={image} alt={title} />
                    <div className="play-btn"></div>
                </div>
            </Link>
            <div className="card-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', margin: '10px 0 6px' }}>
                <span className="date">{date}</span>
                {seriesBadge && (
                    <span 
                        className="card-tag card-tag-series"
                        style={{
                            background: 'var(--primary-color, #1a202c)',
                            color: '#ffffff',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        {seriesBadge}
                    </span>
                )}
            </div>
            <Link to={`/${lang}/videos/${id}`}>
                <h4 className="card-title">{title}</h4>
            </Link>
            <p className="excerpt">{excerpt}</p>
        </motion.article>
    );
};

export default VideoCard;
