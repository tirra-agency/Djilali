import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookDetail: React.FC = () => {
    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Link to="/books" style={{ color: 'var(--primary-color)', display: 'inline-block', marginBottom: '20px' }}>
                        &larr; Retour aux livres
                    </Link>
                    
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <motion.div 
                            style={{ flex: '1 1 300px', maxWidth: '350px' }}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <img src="/assets/images/book_1.png" alt="La modernité" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                        </motion.div>
                        
                        <motion.div 
                            style={{ flex: '2 1 400px' }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="date">Publié en 2019</span>
                            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '10px 0 20px', color: 'var(--primary-color)' }}>
                                La modernité
                            </h1>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '30px' }}>
                                Une analyse approfondie des défis liés à la modernité dans le contexte algérien.
                                L'auteur y explore les dynamiques sociales, politiques et intellectuelles qui façonnent
                                la société contemporaine et son rapport au progrès et à la tradition.
                            </p>
                            <button className="btn-submit" style={{ display: 'inline-block', padding: '12px 30px', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                                Commander le livre
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BookDetail;
