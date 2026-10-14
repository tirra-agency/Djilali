import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../sanity/client';
import { PortableText } from '@portabletext/react';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { 
    hasArabic, 
    getLocalizedText, 
    getLocalizedBlocks, 
    getReadingTime, 
    getLocalizedCategory,
    getLocalizedSlug,
    filterByLang
} from '../utils/localization';
import ArticleCard from '../components/ArticleCard';

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [isSeriesMode, setIsSeriesMode] = useState<boolean>(false);
    const [seriesData, setSeriesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { lang, setLang, setAlternateSlug } = useLanguage();
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollPrev = () => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector('.card') as HTMLElement;
            const scrollDistance = card ? card.offsetWidth + 20 : 300;
            carouselRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (carouselRef.current) {
            const card = carouselRef.current.querySelector('.card') as HTMLElement;
            const scrollDistance = card ? card.offsetWidth + 20 : 300;
            carouselRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setRelatedPosts([]);
            setIsSeriesMode(false);
            setSeriesData(null);

            client.fetch(`*[_type == "post" && (slug.current == $id || slug_ar.current == $id || _id == $id)][0]{
                ...,
                series->{_id, title, title_ar, slug, description, description_ar},
                categories[]->{_id, title, title_ar, slug}
            }`, { id })
                .then((data) => {
                    setPost(data);
                    if (data) {
                        const targetAlt = lang === 'fr' 
                            ? (data.slug_ar?.current || data.slug?.current)
                            : (data.slug?.current || data._id);
                        setAlternateSlug(targetAlt || null);

                        const currentId = data._id;

                        // Case 1: Post is part of a series -> fetch other episodes of the series
                        if (data.series?._id) {
                            const seriesId = data.series._id;
                            client.fetch(`*[_type == "post" && series._ref == $seriesId && _id != $currentId] | order(seriesOrder asc, publishedAt asc){
                                ...,
                                series->{_id, title, title_ar, slug},
                                categories[]->{_id, title, title_ar, slug}
                            }`, { seriesId, currentId })
                            .then((seriesItems) => {
                                if (seriesItems && seriesItems.length > 0) {
                                    setRelatedPosts(seriesItems);
                                    setIsSeriesMode(true);
                                    setSeriesData(data.series);
                                } else {
                                    // If no other episodes found in this series, fallback to similar category articles
                                    fetchSimilarArticles(data);
                                }
                            })
                            .catch((err) => {
                                console.error('Error fetching series articles:', err);
                                fetchSimilarArticles(data);
                            });
                        } else {
                            // Case 2: Post is not a series -> fetch articles with similar categories
                            fetchSimilarArticles(data);
                        }
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        function fetchSimilarArticles(data: any) {
            const currentId = data._id;
            const categoryIds = data.categories?.map((c: any) => c._id).filter(Boolean) || [];

            if (categoryIds.length > 0) {
                client.fetch(`*[_type == "post" && count((categories[]->_id)[@ in $categoryIds]) > 0 && _id != $currentId] | order(publishedAt desc)[0...12]{
                    ...,
                    series->{_id, title, title_ar, slug},
                    categories[]->{_id, title, title_ar, slug}
                }`, { categoryIds, currentId })
                .then((similar) => {
                    if (similar && similar.length > 0) {
                        setRelatedPosts(similar);
                        setIsSeriesMode(false);
                    } else {
                        fetchRecentArticles(currentId);
                    }
                })
                .catch(() => fetchRecentArticles(currentId));
            } else {
                fetchRecentArticles(currentId);
            }
        }

        function fetchRecentArticles(currentId: string) {
            client.fetch(`*[_type == "post" && _id != $currentId] | order(publishedAt desc)[0...12]{
                ...,
                series->{_id, title, title_ar, slug},
                categories[]->{_id, title, title_ar, slug}
            }`, { currentId })
            .then((recent) => {
                setRelatedPosts(recent || []);
                setIsSeriesMode(false);
            })
            .catch(console.error);
        }
    }, [id, lang, setAlternateSlug]);

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
    const readingTime = post ? getReadingTime(post, lang) : null;
    const isArabicMissing = lang === 'ar' && post && !hasArabic(post, 'title');

    // Helper to format date for related article cards
    const formatCardDate = (dateString: string) => {
        if (!dateString) return '';
        if (lang === 'ar') {
            return new Date(dateString).toLocaleDateString('ar-DZ', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    // Helper to extract plain excerpt for related article cards
    const getExcerpt = (blocks: any[]) => {
        if (!blocks || blocks.length === 0) return '';
        const block = blocks.find((b: any) => b._type === 'block' && b.children);
        if (!block) return '';
        const text = block.children.map((child: any) => child.text).join('');
        return text.length > 130 ? text.substring(0, 130) + '...' : text;
    };

    // Respect language requirements for Arabic version
    const filteredRelatedPosts = filterByLang(relatedPosts, lang);

    return (
        <main>
            <section className="section" style={{ paddingTop: '40px', minHeight: '60vh' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Link to={`/${lang}/writings`} className="back-link">
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
                                    onClick={() => setLang('fr', post?.slug?.current)} 
                                    className="btn-submit"
                                    style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    {t('view_in_french', lang)}
                                </button>
                                <Link 
                                    to={`/${lang}/writings`} 
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
                                {readingTime !== null && (
                                    <span className="date" style={{ margin: 0 }}>{readingTime} {t('reading_time', lang)}</span>
                                )}
                                {postCategories.length > 0 && (
                                    <div className="card-tags">
                                        {postCategories.map((cat: { name: string; slug?: string }, index: number) => (
                                            cat.slug ? (
                                                <Link 
                                                    key={index} 
                                                    to={`/${lang}/writings?category=${cat.slug}`}
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

                {/* --- RELATED ARTICLES / SERIES SECTION --- */}
                {filteredRelatedPosts.length > 0 && !isArabicMissing && (
                    <motion.div 
                        className="container" 
                        style={{ 
                            maxWidth: '1240px', 
                            margin: '80px auto 30px auto', 
                            paddingTop: '50px',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)' 
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ marginBottom: '35px' }}>
                            <h3 style={{ 
                                fontFamily: 'var(--font-serif)', 
                                fontSize: '2rem', 
                                color: 'var(--primary-color)', 
                                margin: '0 0 10px 0',
                                lineHeight: 1.3
                            }}>
                                {isSeriesMode 
                                    ? `${t('in_same_series', lang)} : ${getLocalizedText(seriesData, 'title', lang) || seriesData?.title || ''}`
                                    : t('related_articles', lang)
                                }
                            </h3>

                            {isSeriesMode && getLocalizedText(seriesData, 'description', lang) && (
                                <p style={{ color: '#666', fontSize: '1.05rem', margin: 0, maxWidth: '700px' }}>
                                    {getLocalizedText(seriesData, 'description', lang)}
                                </p>
                            )}
                            {!isSeriesMode && (
                                <p style={{ color: '#666', fontSize: '1.05rem', margin: 0 }}>
                                    {t('explore_more_articles', lang)}
                                </p>
                            )}
                        </div>

                        {filteredRelatedPosts.length > 4 ? (
                            <div className="related-carousel-wrapper">
                                <button className="carousel-btn prev-btn" aria-label="Previous" onClick={scrollPrev}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <div className="related-grid-carousel" ref={carouselRef}>
                                    {filteredRelatedPosts.map((relatedItem: any, index: number) => {
                                        const itemTitle = getLocalizedText(relatedItem, 'title', lang);
                                        const itemBlocks = getLocalizedBlocks(relatedItem, 'body', lang) || relatedItem.body;
                                        const itemCategories = relatedItem.categories
                                            ?.map((c: any) => ({
                                                name: getLocalizedCategory(c, lang),
                                                slug: c.slug?.current
                                            }))
                                            .filter((c: any) => c.name.length > 0) || [];

                                        const seriesBadge = isSeriesMode
                                            ? `${t('part_number', lang)} ${relatedItem.seriesOrder || index + 1}`
                                            : undefined;

                                        return (
                                            <ArticleCard 
                                                key={relatedItem._id}
                                                id={getLocalizedSlug(relatedItem, lang)}
                                                image={relatedItem.image ? urlFor(relatedItem.image).width(600).url() : "/assets/images/article_chaos.png"}
                                                date={relatedItem.publishedAt ? formatCardDate(relatedItem.publishedAt) : ''}
                                                title={itemTitle}
                                                excerpt={getExcerpt(itemBlocks)}
                                                readingTime={getReadingTime(relatedItem, lang)}
                                                lang={lang}
                                                categories={itemCategories}
                                                seriesBadge={seriesBadge}
                                            />
                                        );
                                    })}
                                </div>
                                <button className="carousel-btn next-btn" aria-label="Next" onClick={scrollNext}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="related-grid-static">
                                {filteredRelatedPosts.map((relatedItem: any, index: number) => {
                                    const itemTitle = getLocalizedText(relatedItem, 'title', lang);
                                    const itemBlocks = getLocalizedBlocks(relatedItem, 'body', lang) || relatedItem.body;
                                    const itemCategories = relatedItem.categories
                                        ?.map((c: any) => ({
                                            name: getLocalizedCategory(c, lang),
                                            slug: c.slug?.current
                                        }))
                                        .filter((c: any) => c.name.length > 0) || [];

                                    const seriesBadge = isSeriesMode
                                        ? `${t('part_number', lang)} ${relatedItem.seriesOrder || index + 1}`
                                        : undefined;

                                    return (
                                        <ArticleCard 
                                            key={relatedItem._id}
                                            id={getLocalizedSlug(relatedItem, lang)}
                                            image={relatedItem.image ? urlFor(relatedItem.image).width(600).url() : "/assets/images/article_chaos.png"}
                                            date={relatedItem.publishedAt ? formatCardDate(relatedItem.publishedAt) : ''}
                                            title={itemTitle}
                                            excerpt={getExcerpt(itemBlocks)}
                                            readingTime={getReadingTime(relatedItem, lang)}
                                            lang={lang}
                                            categories={itemCategories}
                                            seriesBadge={seriesBadge}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </section>
        </main>
    );
};

export default ArticleDetail;
