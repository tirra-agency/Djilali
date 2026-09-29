import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import VideoCard from '../components/VideoCard';
import BookCard from '../components/BookCard';
import { client, urlFor } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';
import { filterByLang, getLocalizedText, getLocalizedBlocks, getReadingTime, getLocalizedCategory } from '../utils/localization';

const Home: React.FC = () => {
    // Book carousel logic
    const booksGridRef = useRef<HTMLDivElement>(null);
    const [scrollAmount, setScrollAmount] = useState(0);

    // Data states
    const [posts, setPosts] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const { lang } = useLanguage();

    useEffect(() => {
        const updateScrollAmount = () => {
            if (booksGridRef.current) {
                const bookCard = booksGridRef.current.querySelector('.book-card') as HTMLElement;
                if (bookCard) {
                    const cardWidth = bookCard.offsetWidth;
                    const gap = parseInt(window.getComputedStyle(booksGridRef.current).gap || '0', 10);
                    setScrollAmount(cardWidth + gap);
                }
            }
        };

        updateScrollAmount();
        window.addEventListener('resize', updateScrollAmount);
        return () => window.removeEventListener('resize', updateScrollAmount);
    }, [books]);

    const scrollPrev = () => {
        if (booksGridRef.current) {
            booksGridRef.current.scrollBy({ left: -(scrollAmount || 300), behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (booksGridRef.current) {
            booksGridRef.current.scrollBy({ left: (scrollAmount || 300), behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Fetch all needed content concurrently
        Promise.all([
            client.fetch(`*[_type == "post"] | order(publishedAt desc){..., categories[]->{title, title_ar, slug}}`),
            client.fetch(`*[_type == "video"] | order(publishedAt desc)`),
            client.fetch(`*[_type == "book"] | order(publicationDate desc)`)
        ]).then(([postsData, videosData, booksData]) => {
            setPosts(postsData);
            setVideos(videosData);
            setBooks(booksData);
        }).catch(console.error);
    }, []);

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
        return text.length > 180 ? text.substring(0, 180) + '...' : text;
    };

    // Filter items based on active language (in Arabic mode, hide untranslated content)
    const displayedPosts = filterByLang(posts, lang);
    const displayedVideos = filterByLang(videos, lang);
    const displayedBooks = filterByLang(books, lang);

    const heroPost = displayedPosts.length > 0 ? displayedPosts[0] : null;
    const heroReadingTime = heroPost ? getReadingTime(heroPost, lang) : null;
    const otherPosts = displayedPosts.slice(1, 4);

    return (
        <main>
            {/* Hero Section */}
            <Hero />

            {/* A la une (Featured Article) */}
            <section className="section a-la-une">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('featured_article', lang)}</h2>
                        <hr />
                    </div>
                    {heroPost ? (
                        <div className="une-grid">
                            <div className="une-image">
                                <img 
                                    src={heroPost.image ? urlFor(heroPost.image).width(800).url() : "/assets/images/algeria_city.png"} 
                                    alt={getLocalizedText(heroPost, 'title', lang)} 
                                />
                            </div>
                            <div className="une-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className="date" style={{ margin: 0 }}>{heroPost.publishedAt ? formatDate(heroPost.publishedAt) : ''}</span>
                                    {heroReadingTime !== null && (
                                        <span className="date" style={{ margin: 0 }}>{heroReadingTime} {t('reading_time', lang)}</span>
                                    )}
                                    {heroPost.categories && heroPost.categories.length > 0 && (
                                        <div className="card-tags">
                                            {heroPost.categories
                                                .map((c: any) => ({
                                                    name: getLocalizedCategory(c, lang),
                                                    slug: c.slug?.current
                                                }))
                                                .filter((c: any) => c.name.length > 0)
                                                .map((cat: any, index: number) => (
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
                                <h3 className="article-title-lg">{getLocalizedText(heroPost, 'title', lang)}</h3>
                                <p className="excerpt">
                                    {getExcerpt(getLocalizedBlocks(heroPost, 'body', lang) || heroPost.body)}
                                </p>
                                <Link to={`/writings/${heroPost.slug?.current || heroPost._id}`} className="read-more">
                                    {t('read_more', lang)}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                            <p style={{ fontSize: '1.1rem' }}>
                                {lang === 'ar' ? t('no_arabic_articles', lang) : "D'autres publications seront ajoutées prochainement."}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Articles Section */}
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('writings', lang)}</h2>
                        <hr />
                    </div>
                    <div className="cards-grid">
                        {otherPosts.length > 0 ? (
                            otherPosts.map((post: any) => {
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
                                {lang === 'ar' ? t('no_arabic_articles', lang) : "D'autres publications seront ajoutées prochainement."}
                            </p>
                        )}
                    </div>
                    {displayedPosts.length > 0 && (
                        <div className="text-center mt-40">
                            <Link to="/writings" className="read-more">{t('see_all_writings', lang)}</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Vidéos Section */}
            <section className="section videos bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h2>{t('videos_section', lang)}</h2>
                        <hr />
                    </div>
                    <div className="cards-grid">
                        {displayedVideos.length > 0 ? (
                            displayedVideos.map((video: any) => {
                                const getYouTubeThumbnail = (url: string) => {
                                    if (!url) return '/assets/images/video_studio.png';
                                    let videoId = '';
                                    if (url.includes('youtube.com/watch?v=')) {
                                        videoId = url.split('v=')[1]?.split('&')[0];
                                    } else if (url.includes('youtu.be/')) {
                                        videoId = url.split('youtu.be/')[1]?.split('?')[0];
                                    }
                                    if (videoId) {
                                        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                    }
                                    return '/assets/images/video_studio.png';
                                };

                                return (
                                    <VideoCard 
                                        key={video._id}
                                        id={video._id}
                                        image={getYouTubeThumbnail(video.videoUrl)}
                                        date={video.publishedAt ? formatDate(video.publishedAt) : ''}
                                        title={getLocalizedText(video, 'title', lang)}
                                        excerpt={getLocalizedText(video, 'description', lang).substring(0, 100)}
                                    />
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem 0', color: '#666' }}>
                                {lang === 'ar' ? t('no_arabic_videos', lang) : "D'autres vidéos seront ajoutées prochainement."}
                            </p>
                        )}
                    </div>
                    {displayedVideos.length > 0 && (
                        <div className="text-center mt-40">
                            <Link to="/videos" className="read-more">{t('see_all_videos', lang)}</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Ouvrages Section */}
            <section className="section ouvrages">
                <div className="container">
                    <div className="section-heading text-center">
                        <h2>{t('books_section', lang)}</h2>
                        <hr className="mx-auto" />
                    </div>
                    {displayedBooks.length > 0 ? (
                        <div className="books-carousel-wrapper">
                            <button className="carousel-btn prev-btn" aria-label="Previous" onClick={scrollPrev}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <div className="books-grid" ref={booksGridRef}>
                                {displayedBooks.map((book: any) => (
                                    <BookCard 
                                        key={book._id} 
                                        id={book._id} 
                                        image={book.coverImage ? urlFor(book.coverImage).width(500).url() : "/assets/images/book_1.png"} 
                                        title={getLocalizedText(book, 'title', lang)} 
                                        year={book.publishedYear || (book.publicationDate ? book.publicationDate.substring(0, 4) : '')} 
                                    />
                                ))}
                            </div>
                            <button className="carousel-btn next-btn" aria-label="Next" onClick={scrollNext}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>
                            {lang === 'ar' ? t('no_arabic_books', lang) : "D'autres ouvrages seront ajoutés prochainement."}
                        </p>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="section newsletter">
                <div className="container text-center">
                    <h2 className="newsletter-title">{t('newsletter_title', lang)}</h2>
                    <p className="newsletter-subtitle">{t('newsletter_subtitle', lang)}</p>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="email" placeholder={t('email_placeholder', lang)} required />
                        <button type="submit" className="btn-submit">{t('subscribe', lang)}</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Home;
