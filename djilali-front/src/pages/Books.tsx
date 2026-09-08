import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { client, urlFor } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { filterByLang, getLocalizedText } from '../utils/localization';

const Books: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();

    useEffect(() => {
        client.fetch(`*[_type == "book"] | order(publishedYear desc, publicationDate desc)`)
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const displayedBooks = filterByLang(books, lang);

    return (
        <main>
            <section className="section ouvrages">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('library', lang)}</h2>
                        <hr />
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>{t('loading', lang)}</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                            {displayedBooks.length > 0 ? (
                                displayedBooks.map((book: any) => (
                                    <BookCard 
                                        key={book._id} 
                                        id={book._id} 
                                        image={book.coverImage ? urlFor(book.coverImage).width(500).url() : "/assets/images/book_1.png"} 
                                        title={getLocalizedText(book, 'title', lang)} 
                                        year={book.publishedYear || (book.publicationDate ? book.publicationDate.substring(0, 4) : '')} 
                                    />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem 0', color: '#666' }}>
                                    {lang === 'ar' ? t('no_arabic_books', lang) : "D'autres ouvrages seront ajoutés prochainement."}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Books;
