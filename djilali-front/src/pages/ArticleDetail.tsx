import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { hasArabic, getLocalizedText, getLocalizedBlocks, getLocalizedCategory } from '../utils/localization';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { lang, setLang } = useLanguage();

    useEffect(() => {
        if (id) {
            client.fetch(`*[_type == "post" && (slug.current == $id || _id == $id)][0]{
                ...,
                categories[]->{_id, title, title_ar, slug}
            }`, { id })
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
        ? new Date(post.publishedAt).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase()
        : '';

    const postCategories = post?.categories
        ?.map((c: any) => ({
            name: getLocalizedCategory(c, lang),
            slug: c.slug?.current
        }))
        .filter((c: any) => c.name.length > 0) || [];

    const postTitle = post ? getLocalizedText(post, 'title', lang) : '';
    const postBlocks = post ? (getLocalizedBlocks(post, 'body', lang) || (lang === 'fr' ? post.body : null)) : null;
    const isArabicMissing = lang === 'ar' && post && !hasArabic(post, 'title');

    return (
        <main>
            <section className="section" style={{ paddingTop: '40px', minHeight: '60vh' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Link to="/writings" className="back-link">
                        <span className="back-arrow">←</span>
                        <span>{t('back_to_writings', lang)}</span>
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
                                لم تتم ترجمة هذا المقال إلى اللغة العربية بعد من قِبل الكاتب. يمكنك قراءته بنسخته الأصلية باللغة الفرنسية.
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
                                    to="/writings" 
                                    className="back-link-btn"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '6px', border: '1px solid #ccc', textDecoration: 'none', color: '#333' }}
                                >
                                    <span className="back-arrow">←</span>
                                    <span>{t('back_to_writings', lang)}</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                {formattedDate && (
                                    <span className="date" style={{ margin: 0 }}>{formattedDate}</span>
                                )}
                                {postCategories.length > 0 && (
                                    <div className="card-tags">
                                        {postCategories.map((cat: { name: string; slug?: string }, index: number) => (
                                            cat.slug ? (
                                                <Link 
                                                    key={index} 
                                                    to={`/writings?category=${cat.slug}`}
                                                    className="card-tag"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ) : (
                                                <span key={index} className="card-tag">{cat.name}</span>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                            <motion.h1 
                                style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '30px' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {postTitle || (lang === 'ar' ? 'مقال بدون عنوان' : 'Article sans titre')}
                            </motion.h1>
                            
                            {post?.image && (
                                <motion.img 
                                    src={urlFor(post.image).width(1200).url()} 
                                    alt={postTitle} 
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '40px' }}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                />
                            )}
                            
                            <motion.div 
                                className="article-content" 
                                style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-color)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {postBlocks && postBlocks.length > 0 ? (
                                    <PortableText value={postBlocks} />
                                ) : (
                                    <p style={{ fontStyle: 'italic', color: '#777' }}>
                                        {lang === 'ar' ? 'لا يوجد نص متوفر لهذا المقال.' : 'Aucun contenu disponible pour cet article.'}
                                    </p>
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
