// Each test uses jest.isolateModules to get a fresh module instance with its own
// in-memory price cache, preventing cache state from leaking between tests.
describe('fetchStockPrice', () => {
  it('parses the closing price from an Alpha Vantage time series response', async () => {
    await jest.isolateModules(async () => {
      jest.mock('axios');
      const axios = require('axios');
      axios.get.mockResolvedValue({
        data: {
          'Time Series (Daily)': {
            '2024-01-15': { '4. close': '192.50' },
          },
        },
      });
      const { fetchStockPrice } = require('../utils/stockPrice');
      const price = await fetchStockPrice('AAPL');
      expect(price).toBe(192.5);
    });
  });

  it('returns the known mock price when the API responds with a rate-limit Note', async () => {
    await jest.isolateModules(async () => {
      jest.mock('axios');
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: { Note: 'API call frequency limit reached' } });
      const { fetchStockPrice } = require('../utils/stockPrice');
      expect(await fetchStockPrice('GOOGL')).toBe(141.25);
      expect(await fetchStockPrice('MSFT')).toBe(375.0);
    });
  });

  it('returns a numeric fallback in the $50–$250 range for unknown symbols', async () => {
    await jest.isolateModules(async () => {
      jest.mock('axios');
      const axios = require('axios');
      axios.get.mockResolvedValue({ data: { Note: 'rate limited' } });
      const { fetchStockPrice } = require('../utils/stockPrice');
      const price = await fetchStockPrice('ZZZUNK');
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThanOrEqual(50);
      expect(price).toBeLessThanOrEqual(250);
    });
  });

  it('falls back to the mock price table on network error', async () => {
    await jest.isolateModules(async () => {
      jest.mock('axios');
      const axios = require('axios');
      axios.get.mockRejectedValue(new Error('Network error'));
      const { fetchStockPrice } = require('../utils/stockPrice');
      expect(await fetchStockPrice('TSLA')).toBe(245.0);
    });
  });

  it('caches the price so a second call skips the API', async () => {
    await jest.isolateModules(async () => {
      jest.mock('axios');
      const axios = require('axios');
      axios.get.mockResolvedValue({
        data: {
          'Time Series (Daily)': {
            '2024-01-15': { '4. close': '300.00' },
          },
        },
      });
      const { fetchStockPrice } = require('../utils/stockPrice');
      await fetchStockPrice('CACHED');
      await fetchStockPrice('CACHED');
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
