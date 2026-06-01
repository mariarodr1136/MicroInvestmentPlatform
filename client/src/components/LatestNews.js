import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/news`);
        setNews(response.data.articles || []);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []); 

  return (
    <div>
      <div className="section-header blue">Latest Stock News</div>
      <div className="section-body">
        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <div className="news-empty-state">
            <div className="skeleton skeleton-line" style={{ marginBottom: 10 }} />
            <div className="skeleton skeleton-line" style={{ marginBottom: 10 }} />
            <div className="skeleton skeleton-line short" />
          </div>
        ) : news.length > 0 ? (
          <>
            {news.slice(0, visibleCount).map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
              >
                <div className="news-title">{article.title}</div>
              </a>
            ))}
            <div className="news-buttons">
              {visibleCount < news.length && (
                <button
                  className="news-toggle-btn"
                  onClick={() => setVisibleCount(visibleCount + 5)}
                >
                  Show More
                </button>
              )}
              {visibleCount > 5 && (
                <button
                  className="news-toggle-btn"
                  onClick={() => setVisibleCount(Math.max(visibleCount - 5, 5))}
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="news-empty-state">
            <span className="news-empty-icon">📰</span>
            <p className="news-empty-text">No headlines available right now.</p>
            <p className="news-empty-sub">Check back later for market news.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;
