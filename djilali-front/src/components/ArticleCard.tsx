import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ArticleCardProps {
    id: string;
    image: string;
    date: string;
    title: string;
    excerpt: string;
    categories?: string[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, image, date, title, excerpt, categories }) => {
    return (
        <motion.article 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
        >
            <img src={image} alt={title} />
            <div className="card-meta">
                <span className="date">{date}</span>
                {categories && categories.length > 0 && (
                    <div className="card-tags">
                        {categories.map((cat, index) => (
                            <span key={index} className="card-tag">{cat}</span>
                        ))}
                    </div>
                )}
            </div>
            <Link to={`/writings/${id}`}>
                <h4 className="card-title">{title}</h4>
            </Link>
            <p className="excerpt">{excerpt}</p>
        </motion.article>
    );
};

export default ArticleCard;
