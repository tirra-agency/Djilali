import React from 'react';
import { motion } from 'framer-motion';

const Biography: React.FC = () => {
    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Biographie</h2>
                        <hr />
                    </div>
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginTop: '40px', flexWrap: 'wrap' }}>
                        <motion.img 
                            src="/assets/images/hero.png" 
                            alt="Soufiane Djilali" 
                            style={{ flex: '1 1 300px', maxWidth: '400px', borderRadius: '8px', filter: 'grayscale(100%)' }}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                        <motion.div 
                            style={{ flex: '2 1 400px' }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3>Parcours Politique et Intellectuel</h3>
                            <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                Soufiane Djilali est un écrivain, intellectuel et acteur majeur de la scène politique algérienne.
                                Docteur d'État, il s'est toujours distingué par une réflexion profonde sur les enjeux de la modernité, 
                                la démocratie, et la construction de l'État de droit en Algérie.
                            </p>
                            <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                À travers ses nombreux écrits et prises de position publiques, il plaide pour une transition 
                                démocratique apaisée, la réhabilitation du politique, et l'intégration de la société algérienne 
                                dans la marche du monde moderne sans pour autant renier son authenticité.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Biography;
