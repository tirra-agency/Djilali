import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageProvider';

interface BookCardProps {
    id: string;
    image: string;
    title: string;
    year: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, image, title, year }) => {
    const { lang } = useLanguage();

    return (
        <div className="book-card">
            <Link to={`/${lang}/books/${id}`}>
                <img src={image} alt={title} />
                <h5 className="book-title">{title}</h5>
            </Link>
            <span className="book-year">{year}</span>
        </div>
    );
};

export default BookCard;
