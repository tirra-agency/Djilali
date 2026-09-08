import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CategoryItem {
    name: string;
    slug?: string;
}

interface ArticleCardProps {
    id: string;
    image: string;
    date: string;
    title: string;
    excerpt: string;
    categories?: (string | CategoryItem)[];
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
                        {categories.map((cat, index) => {
                            const isObj = typeof cat === 'object' && cat !== null;
                            const name = isObj ? cat.name : cat;
                            const slug = isObj ? cat.slug : undefined;

                            return slug ? (
                                <Link key={index} to={`/writings?category=${slug}`} className="card-tag">
                                    {name}
                                </Link>
                            ) : (
                                <span key={index} className="card-tag">{name}</span>
                            );
                        })}
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
