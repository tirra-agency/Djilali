import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    // Format date beautifully if it exists
    const formattedDate = book?.publicationDate 
        ? new Date(book.publicationDate).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase() 
        : (book?.publishedYear || 'INCONNUE');

    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    <Link to="/books" style={{ color: 'var(--primary-color)', display: 'inline-block', marginBottom: '30px', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        &larr; Retour aux livres
                    </Link>
                    
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
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
                                    alt={book?.title || "La modernité"} 
                                    style={{ width: '100%', borderRadius: '12px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }} 
                                />
                            </motion.div>
                            
                            <motion.div 
                                style={{ flex: '1 1 400px' }}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <span className="date" style={{ fontWeight: 600, color: 'var(--primary-light)' }}>
                                    DATE DE PUBLICATION : {formattedDate}
                                </span>
                                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', margin: '15px 0 5px', color: 'var(--primary-color)', lineHeight: 1.1 }}>
                                    {book?.title || 'La modernité (Placeholder)'}
                                </h1>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-light)', marginBottom: '25px', fontStyle: 'italic' }}>
                                    Par {book?.author || 'Soufiane Djilali'}
                                </h3>
                                <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '35px' }}>
                                    {book?.description ? (
                                        <PortableText value={book.description} />
                                    ) : (
                                        <p>
                                            Une analyse approfondie des défis liés à la modernité dans le contexte algérien.
                                            L'auteur y explore les dynamiques sociales, politiques et intellectuelles qui façonnent
                                            la société contemporaine et son rapport au progrès et à la tradition.
                                        </p>
                                    )}
                                </div>
                                {book?.pdfUrl && (
                                    <a 
                                        href={book.pdfUrl} 
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-submit" 
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '1rem', transition: 'opacity 0.3s' }}
                                    >
                                        <svg xmlns="http://www.w3.org/-2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Télécharger le PDF
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
