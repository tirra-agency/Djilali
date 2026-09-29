import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { client, urlFor } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { filterByLang, getLocalizedText, getLocalizedBlocks, getReadingTime, hasCategoryArabic, getLocalizedCategory } from '../utils/localization';

const Writings: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();

    useEffect(() => {
        // Fetch all categories for filter tabs
        client.fetch(`*[_type == "category"] | order(title asc){_id, title, title_ar, slug}`)
            .then(setCategories)
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        // Build the query based on the selected category
        let query = `*[_type == "post"] | order(publishedAt desc){
            ...,
            categories[]->{title, title_ar, slug}
        }`;

        if (currentCategory !== 'all') {
            query = `*[_type == "post" && "${currentCategory}" in categories[]->slug.current] | order(publishedAt desc){
                ...,
                categories[]->{title, title_ar, slug}
            }`;
        }

        client.fetch(query)
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [currentCategory]);

    const handleCategoryChange = (slug: string) => {
        if (slug === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ category: slug });
        }
    };

    // Format date gracefully
    const formatDate = (dateString: string) => {
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

    // Helper to get excerpt from Portable Text
    const getExcerpt = (blocks: any[]) => {
        if (!blocks || blocks.length === 0) return '';
        const block = blocks.find((b: any) => b._type === 'block' && b.children);
        if (!block) return '';
        const text = block.children.map((child: any) => child.text).join('');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };

    // In Arabic mode, only show categories that have an Arabic translation in Sanity
    const displayedCategories = lang === 'ar'
        ? categories.filter(hasCategoryArabic)
        : categories;

    // Filter posts for Arabic mode (hide posts without Arabic version)
    const displayedPosts = filterByLang(posts, lang);

    return (
        <main>
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('writings_all', lang)}</h2>
                        <hr />
                    </div>

                    <div className="category-filters">
                        <button 
                            className={`filter-btn ${currentCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            {t('all_categories', lang)}
                        </button>
                        {displayedCategories.map((cat) => (
                            <button 
                                key={cat._id}
                                className={`filter-btn ${currentCategory === cat.slug?.current ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.slug?.current)}
                            >
                                {getLocalizedCategory(cat, lang)}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>{t('loading', lang)}</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px' }}>
                            {displayedPosts.length > 0 ? (
                                displayedPosts.map((post: any) => {
                                    const postTitle = getLocalizedText(post, 'title', lang);
                                    const postBlocks = getLocalizedBlocks(post, 'body', lang) || post.body;
                                    const postCategories = post.categories
                                        ?.map((c: any) => ({
                                            name: getLocalizedCategory(c, lang),
                                            slug: c.slug?.current
                                        }))
                                        .filter((c: any) => c.name.length > 0) || [];

                                    return (
                                        <ArticleCard 
                                            key={post._id}
                                            id={post.slug?.current || post._id}
                                            image={post.image ? urlFor(post.image).width(600).url() : "/assets/images/article_chaos.png"}
                                            date={post.publishedAt ? formatDate(post.publishedAt) : ''}
                                            title={postTitle}
                                            excerpt={getExcerpt(postBlocks)}
                                            readingTime={getReadingTime(post, lang)}
                                            lang={lang}
                                            categories={postCategories}
                                        />
                                    );
                                })
                            ) : (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem 0', color: '#666' }}>
                                    {lang === 'ar' ? t('no_arabic_articles', lang) : t('no_publications', lang)}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Writings;
