
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
// Import other pages as they are created
import Biography from './pages/Biography';
import Writings from './pages/Writings';
import ArticleDetail from './pages/ArticleDetail';
import Videos from './pages/Videos';
import VideoDetail from './pages/VideoDetail';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/writings/:id" element={<ArticleDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
