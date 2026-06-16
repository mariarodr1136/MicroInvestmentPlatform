const axios = require('axios');

const priceCache = new Map();
const PRICE_CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

// Periodically evict stale entries so symbols never re-fetched don't linger forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of priceCache.entries()) {
    if (now - value.timestamp >= PRICE_CACHE_TTL) priceCache.delete(key);
  }
}, PRICE_CACHE_TTL);

async function fetchStockPrice(symbol) {
  const key = symbol.toUpperCase();
  const cached = priceCache.get(key);
  if (cached) {
    if (Date.now() - cached.timestamp < PRICE_CACHE_TTL) return cached.price;
    priceCache.delete(key); // evict stale entry on access
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: { function: 'TIME_SERIES_DAILY', symbol, apikey: apiKey },
    });

    if (response.data['Error Message']) {
      throw new Error(`Invalid stock symbol: ${symbol}`);
    }
    if (response.data['Note'] || response.data['Information']) {
      return getMockStockPrice(symbol);
    }

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) return getMockStockPrice(symbol);

    const latestTimestamp = Object.keys(timeSeries)[0];
    const price = parseFloat(timeSeries[latestTimestamp]['4. close']);

    // Evict oldest entry if cache is at capacity before inserting.
    if (priceCache.size >= MAX_CACHE_SIZE) {
      priceCache.delete(priceCache.keys().next().value);
    }
    priceCache.set(key, { price, timestamp: Date.now() });
    return price;
  } catch {
    return getMockStockPrice(symbol);
  }
}

function getMockStockPrice(symbol) {
  const mockPrices = {
    'AAPL': 178.50, 'GOOGL': 141.25, 'TSLA': 245.00, 'MSFT': 375.00,
    'AMZN': 150.25, 'META': 485.50, 'NFLX': 620.00, 'NVDA': 875.50, 'BABA': 85.75,
  };
  return mockPrices[symbol.toUpperCase()] ?? parseFloat((Math.random() * 200 + 50).toFixed(2));
}

module.exports = { fetchStockPrice };
