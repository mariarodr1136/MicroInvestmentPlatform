import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
  const API_URL = `https://newsapi.org/v2/everything?q=stocks&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(API_URL);
        setNews(response.data.articles);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      }
    };

    fetchNews();
  }, [API_URL]); 

  return (
    <div>
      <div className="section-header blue">Latest Stock News</div>
      <div className="section-body">
        {error && <div className="form-error">{error}</div>}
        {news.length > 0 ? (
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
          <p className="news-empty">No news available.</p>
        )}
      </div>
    </div>
  );
};

export default LatestNews;
