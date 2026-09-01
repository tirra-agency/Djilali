import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // We search by either slug or id to be safe
            client.fetch(`*[_type == "post" && (slug.current == $id || _id == $id)][0]`, { id })
                .then((data) => {
                    setPost(data);
                    setLoading(false);
                })
                .catch(console.error);
        } else {
            setLoading(false);
        }
    }, [id]);

    const formattedDate = post?.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase()
        : '8 JANVIER 2025';

    return (
        <main>
            <section className="section" style={{ paddingTop: '40px' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Link to="/writings" style={{ color: 'var(--primary-color)', display: 'inline-block', marginBottom: '20px' }}>
                        &larr; Retour aux articles
                    </Link>
                    
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
                    ) : (
                        <>
                            <span className="date" style={{ display: 'block', marginBottom: '10px' }}>{formattedDate}</span>
                            <motion.h1 
                                style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '30px' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {post?.title || 'Le Monde et le Chaos'}
                            </motion.h1>
                            
                            <motion.img 
                                src={post?.image ? urlFor(post.image).width(1200).url() : "/assets/images/article_chaos.png"} 
                                alt={post?.title || "Le Monde et le Chaos"} 
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '40px' }}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            />
                            
                            <motion.div 
                                className="article-content" 
                                style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-color)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {post?.body ? (
                                    <PortableText value={post.body} />
                                ) : (
                                    <>
                                        <p style={{ marginBottom: '20px' }}>
                                            Dans le langage courant, le chaos désigne un état de désordre total. L'absence de
                                            sens et la perte de la raison d'être collectif sont souvent au fondement de l'exacerbation des
                                            contradictions.
                                        </p>
                                        <p style={{ marginBottom: '20px' }}>
                                            L'humanité traverse aujourd'hui une phase critique de son histoire, marquée par des bouleversements
                                            géopolitiques profonds. Les anciennes certitudes s'effondrent, laissant place à une instabilité
                                            structurelle.
                                        </p>
                                        <p style={{ marginBottom: '20px' }}>
                                            Pour l'Algérie, ce contexte mondial impose une vigilance de tous les instants et une capacité
                                            d'adaptation rapide. La cohésion nationale n'est plus seulement un idéal, elle devient une nécessité
                                            absolue pour la survie politique et économique.
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ArticleDetail;
