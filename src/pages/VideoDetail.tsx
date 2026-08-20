import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VideoDetail: React.FC = () => {
    return (
        <main>
            <section className="section">
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Link to="/videos" style={{ color: 'var(--primary-color)', display: 'inline-block', marginBottom: '20px' }}>
                        &larr; Retour aux vidéos
                    </Link>
                    
                    <motion.div 
                        style={{ position: 'relative', paddingBottom: '56.25%', height: '0', overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: '8px', marginBottom: '30px' }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                <div style={{ width: '0', height: '0', borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '25px solid white', marginLeft: '10px' }}></div>
                            </div>
                            <p>Lecteur Vidéo (YouTube / Vimeo)</p>
                        </div>
                    </motion.div>

                    <span className="date">12 JANVIER 2025</span>
                    <motion.h1 
                        style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '10px 0 20px' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        La jeune génération est plus décomplexée et porteuse d'espoir de changement
                    </motion.h1>
                    <motion.p 
                        style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-light)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Une conversation approfondie sur les transformations nécessaires pour une Algérie démocratique. 
                        Analyse des attentes de la jeunesse et des défis politiques contemporains face à un ordre mondial 
                        en pleine mutation.
                    </motion.p>
                </div>
            </section>
        </main>
    );
};

export default VideoDetail;
