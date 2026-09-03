import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { client, urlFor } from '../sanity/client';

const Writings: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all categories for the filter tabs
        client.fetch(`*[_type == "category"] | order(title asc)`)
            .then(setCategories)
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        // Build the query based on the selected category
        let query = `*[_type == "post"] | order(publishedAt desc){
            ...,
            categories[]->{title, slug}
        }`;

        if (currentCategory !== 'all') {
            query = `*[_type == "post" && "${currentCategory}" in categories[]->slug.current] | order(publishedAt desc){
                ...,
                categories[]->{title, slug}
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

    return (
        <main>
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>Tous les Écrits</h2>
                        <hr />
                    </div>

                    <div className="category-filters">
                        <button 
                            className={`filter-btn ${currentCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            Tous
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat._id}
                                className={`filter-btn ${currentCategory === cat.slug?.current ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.slug?.current)}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px' }}>
                            {posts.length > 0 ? (
                                posts.map((post: any) => (
                                    <ArticleCard 
                                        key={post._id}
                                        id={post.slug?.current || post._id}
                                        image={post.image ? urlFor(post.image).width(600).url() : "/assets/images/article_chaos.png"}
                                        date={post.publishedAt ? formatDate(post.publishedAt) : ''}
                                        title={post.title}
                                        excerpt={getExcerpt(post.body)}
                                        categories={post.categories?.map((c: any) => c.title) || []}
                                    />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                                    Aucune publication trouvée pour ce thème.
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
