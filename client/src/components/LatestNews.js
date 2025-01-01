import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const API_KEY = 
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
    <div className="latest-news">
      <h3 className="text-xl font-semibold mb-4 underline">Latest Stock News</h3>
      {error && <p className="error">{error}</p>}
      {news.length > 0 ? (
        <div className="news-item">
          <a href={news[0].url} target="_blank" rel="noopener noreferrer">
            <h4 className="news-title">{news[0].title}</h4>
          </a>
        </div>
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
};

export default LatestNews;
