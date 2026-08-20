import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface VideoCardProps {
    id: string;
    image: string;
    date: string;
    title: string;
    excerpt: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, image, date, title, excerpt }) => {
    return (
        <motion.article 
            className="card video-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <Link to={`/videos/${id}`}>
                <div className="video-thumbnail">
                    <img src={image} alt={title} />
                    <div className="play-btn"></div>
                </div>
            </Link>
            <span className="date">{date}</span>
            <Link to={`/videos/${id}`}>
                <h4 className="card-title">{title}</h4>
            </Link>
            <p className="excerpt">{excerpt}</p>
        </motion.article>
    );
};

export default VideoCard;
