import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { hasArabic, getLocalizedText, getLocalizedBlocks } from '../utils/localization';

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { lang, setLang } = useLanguage();

    useEffect(() => {
        if (id) {
            client.fetch(`*[_type == "book" && _id == $id][0] {
                ...,
                "pdfUrl": pdf.asset->url
            }`, { id })
                .then((data) => {
                    setBook(data);
                    setLoading(false);
                })
                .catch(console.error);
        } else {
            setLoading(false);
        }
    }, [id]);

    const formattedDate = book?.publicationDate 
        ? new Date(book.publicationDate).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase() 
        : (book?.publishedYear || '');

    const isArabicMissing = lang === 'ar' && book && !hasArabic(book, 'title');
    const bookTitle = book ? getLocalizedText(book, 'title', lang) : '';
    const bookAuthor = book ? (getLocalizedText(book, 'author', lang) || book.author) : '';
    const bookDesc = book ? (getLocalizedBlocks(book, 'description', lang) || (lang === 'fr' ? book.description : null)) : null;

    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', minHeight: '60vh' }}>
                    <Link to="/books" className="back-link">
                        <span className="back-arrow">←</span>
                        <span>{t('back_to_books', lang)}</span>
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
                                لم تتم إضافة تفاصيل هذا الكتاب باللغة العربية بعد. يمكنك الاطلاع على النسخة الأصلية باللغة الفرنسية.
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
                                    to="/books" 
                                    className="back-link-btn"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '6px', border: '1px solid #ccc', textDecoration: 'none', color: '#333' }}
                                >
                                    <span className="back-arrow">←</span>
                                    <span>{t('back_to_books', lang)}</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <motion.div 
                                style={{ flex: '1 1 350px', maxWidth: '400px' }}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img 
                                    src={book?.coverImage ? urlFor(book.coverImage).width(600).url() : "/assets/images/book_1.png"} 
                                    alt={bookTitle || "Livre"} 
                                    style={{ width: '100%', borderRadius: '12px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }} 
                                />
                            </motion.div>
                            
                            <motion.div 
                                style={{ flex: '1 1 400px' }}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {formattedDate && (
                                    <span className="date" style={{ fontWeight: 600, color: 'var(--primary-light)' }}>
                                        {t('publication_date', lang)} {formattedDate}
                                    </span>
                                )}
                                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', margin: '15px 0 5px', color: 'var(--primary-color)', lineHeight: 1.1 }}>
                                    {bookTitle || (lang === 'ar' ? 'كتاب بدون عنوان' : 'Livre sans titre')}
                                </h1>
                                {bookAuthor && (
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-light)', marginBottom: '25px', fontStyle: 'italic' }}>
                                        {t('author_prefix', lang)} {bookAuthor}
                                    </h3>
                                )}
                                <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '35px' }}>
                                    {bookDesc && bookDesc.length > 0 ? (
                                        <PortableText value={bookDesc} />
                                    ) : (
                                        <p style={{ fontStyle: 'italic', color: '#777' }}>
                                            {lang === 'ar' ? 'لا يوجد وصف متاح لهذا الكتاب.' : 'Aucune description disponible pour ce livre.'}
                                        </p>
                                    )}
                                </div>
                                {book?.pdfUrl && (
                                    <a 
                                        href={book.pdfUrl} 
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-submit btn-with-icon" 
                                        style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                                            gap: '10px', 
                                            padding: '14px 32px', 
                                            background: 'var(--primary-color)', 
                                            color: 'white', 
                                            textDecoration: 'none', 
                                            borderRadius: '6px', 
                                            fontSize: '1rem', 
                                            transition: 'opacity 0.3s' 
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        <span>{t('download_pdf', lang)}</span>
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BookDetail;
