import React from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Biography from './pages/Biography';
import Writings from './pages/Writings';
import ArticleDetail from './pages/ArticleDetail';
import Videos from './pages/Videos';
import VideoDetail from './pages/VideoDetail';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Contact from './pages/Contact';
import { useLanguage } from './contexts/LanguageProvider';

// Redirects root / to the current active language prefix (e.g. /fr or /ar)
const RootRedirect: React.FC = () => {
  const { lang } = useLanguage();
  return <Navigate to={`/${lang}`} replace />;
};

// Redirects legacy paths like /writings to /:lang/writings
const LegacyRedirect: React.FC<{ to: string }> = ({ to }) => {
  const { lang } = useLanguage();
  const location = useLocation();
  return <Navigate to={`/${lang}/${to}${location.search}${location.hash}`} replace />;
};

// Redirects legacy paths with :id like /writings/:id to /:lang/writings/:id
const LegacyParamRedirect: React.FC<{ section: string }> = ({ section }) => {
  const { lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  return <Navigate to={`/${lang}/${section}/${id || ''}${location.search}${location.hash}`} replace />;
};

// Route wrapper validating that :lang is either 'fr' or 'ar'
const LanguageRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  if (lang !== 'fr' && lang !== 'ar') {
    return <Navigate to="/fr" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Language Routes */}
        <Route path="/:lang" element={<LanguageRoute><Home /></LanguageRoute>} />
        <Route path="/:lang/biography" element={<LanguageRoute><Biography /></LanguageRoute>} />
        <Route path="/:lang/writings" element={<LanguageRoute><Writings /></LanguageRoute>} />
        <Route path="/:lang/writings/:id" element={<LanguageRoute><ArticleDetail /></LanguageRoute>} />
        <Route path="/:lang/videos" element={<LanguageRoute><Videos /></LanguageRoute>} />
        <Route path="/:lang/videos/:id" element={<LanguageRoute><VideoDetail /></LanguageRoute>} />
        <Route path="/:lang/books" element={<LanguageRoute><Books /></LanguageRoute>} />
        <Route path="/:lang/books/:id" element={<LanguageRoute><BookDetail /></LanguageRoute>} />
        <Route path="/:lang/contact" element={<LanguageRoute><Contact /></LanguageRoute>} />

        {/* Backward Compatibility for legacy URLs without language prefix */}
        <Route path="/biography" element={<LegacyRedirect to="biography" />} />
        <Route path="/writings" element={<LegacyRedirect to="writings" />} />
        <Route path="/writings/:id" element={<LegacyParamRedirect section="writings" />} />
        <Route path="/videos" element={<LegacyRedirect to="videos" />} />
        <Route path="/videos/:id" element={<LegacyParamRedirect section="videos" />} />
        <Route path="/books" element={<LegacyRedirect to="books" />} />
        <Route path="/books/:id" element={<LegacyParamRedirect section="books" />} />
        <Route path="/contact" element={<LegacyRedirect to="contact" />} />

        {/* Catch-all */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
