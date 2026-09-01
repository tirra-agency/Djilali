import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';

const Biography: React.FC = () => {
    const [bioData, setBioData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(`*[_type == "biography"][0]`)
            .then((data) => {
                setBioData(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="section-heading">
                        <h2>{bioData?.title || 'Biographie'}</h2>
                        <hr />
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
                    ) : (
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginTop: '40px', flexWrap: 'wrap' }}>
                            <motion.img 
                                src={bioData?.profileImage ? urlFor(bioData.profileImage).width(400).url() : "/assets/images/hero.png"} 
                                alt={bioData?.title || "Soufiane Djilali"} 
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
                                <div className="biography-content">
                                    {bioData?.content ? (
                                        <PortableText value={bioData.content} />
                                    ) : (
                                        <>
                                            <h3>Parcours Politique et Intellectuel</h3>
                                            <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: '1.8' }}>
                                                Contenu de la biographie sera bientôt disponible. 
                                                Veuillez l'ajouter depuis le tableau de bord Sanity.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Biography;
