jest.mock('../utils/stockPrice', () => ({
  fetchStockPrice: jest.fn().mockResolvedValue(100),
}));

const request = require('supertest');
const app = require('../app');
const { fetchStockPrice } = require('../utils/stockPrice');
const { setup, teardown, clearDB } = require('./setup');

beforeAll(setup);
afterAll(teardown);
afterEach(clearDB);

async function registerUser(username, balance) {
  const body = { username, password: 'pass123' };
  if (balance !== undefined) body.balance = balance;
  const res = await request(app).post('/api/user/register').send(body);
  return res.body;
}

describe('POST /api/transactions/buy', () => {
  it('deducts balance and adds stock to portfolio', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { _id, token } = await registerUser('buyer1');

    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL', shares: 10 });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(9000); // 10000 - 10*100

    const portfolio = await request(app)
      .get(`/api/user/${_id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    expect(portfolio.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ symbol: 'AAPL', shares: 10, avgPrice: 100 }),
      ])
    );
  });

  it('recalculates weighted average price when buying more of the same stock', async () => {
    fetchStockPrice
      .mockResolvedValueOnce(100)  // first buy at $100
      .mockResolvedValueOnce(200); // second buy at $200
    const { _id, token } = await registerUser('buyer2');

    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'MSFT', shares: 10 });

    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'MSFT', shares: 10 });

    const portfolio = await request(app)
      .get(`/api/user/${_id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    const holding = portfolio.body.find(s => s.symbol === 'MSFT');
    expect(holding.shares).toBe(20);
    expect(holding.avgPrice).toBe(150); // (10*100 + 10*200) / 20
  });

  it('returns 400 when balance is insufficient', async () => {
    fetchStockPrice.mockResolvedValue(10000);
    const { token } = await registerUser('buyer3', 500); // only $500

    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL', shares: 1 }); // costs $10,000

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/insufficient/i);
  });

  it('returns 400 for fractional shares', async () => {
    const { token } = await registerUser('buyer4');
    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL', shares: 1.5 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for zero shares', async () => {
    const { token } = await registerUser('buyer5');
    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL', shares: 0 });
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative shares', async () => {
    const { token } = await registerUser('buyer6');
    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL', shares: -3 });
    expect(res.status).toBe(400);
  });

  it('returns 400 when symbol is missing', async () => {
    const { token } = await registerUser('buyer7');
    const res = await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ shares: 5 });
    expect(res.status).toBe(400);
  });

  it('returns 401 without an auth token', async () => {
    const res = await request(app)
      .post('/api/transactions/buy')
      .send({ symbol: 'AAPL', shares: 1 });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/transactions/sell', () => {
  it('credits revenue and removes a fully-sold position from portfolio', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { _id, token } = await registerUser('seller1');

    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'GOOGL', shares: 5 }); // costs 500, balance → 9500

    fetchStockPrice.mockResolvedValue(150);
    const res = await request(app)
      .post('/api/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'GOOGL', shares: 5 });

    expect(res.status).toBe(200);
    expect(res.body.revenue).toBe(750); // 5 * 150
    expect(res.body.balance).toBe(10250); // 9500 + 750

    const portfolio = await request(app)
      .get(`/api/user/${_id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    expect(portfolio.body.find(s => s.symbol === 'GOOGL')).toBeUndefined();
  });

  it('partial sell reduces share count without removing position', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { _id, token } = await registerUser('seller1b');

    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AMZN', shares: 10 });

    const res = await request(app)
      .post('/api/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AMZN', shares: 4 });

    expect(res.status).toBe(200);

    const portfolio = await request(app)
      .get(`/api/user/${_id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    const holding = portfolio.body.find(s => s.symbol === 'AMZN');
    expect(holding.shares).toBe(6);
  });

  it('returns 400 when user does not own the stock', async () => {
    const { token } = await registerUser('seller2');
    const res = await request(app)
      .post('/api/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'TSLA', shares: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/don't own/i);
  });

  it('returns 400 when selling more shares than owned', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { token } = await registerUser('seller3');
    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'NVDA', shares: 3 });

    const res = await request(app)
      .post('/api/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'NVDA', shares: 10 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/only have/i);
  });

  it('returns 400 when shares field is missing', async () => {
    const { token } = await registerUser('seller4');
    const res = await request(app)
      .post('/api/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL' });
    expect(res.status).toBe(400);
  });

  it('returns 401 without an auth token', async () => {
    const res = await request(app)
      .post('/api/transactions/sell')
      .send({ symbol: 'AAPL', shares: 1 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/transactions/:userId/history', () => {
  it('returns transaction history for the authenticated owner', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { _id, token } = await registerUser('hist1');

    await request(app)
      .post('/api/transactions/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AMZN', shares: 2 });

    const res = await request(app)
      .get(`/api/transactions/${_id}/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ symbol: 'AMZN', shares: 2, type: 'buy' });
  });

  it('respects the limit query parameter', async () => {
    fetchStockPrice.mockResolvedValue(100);
    const { _id, token } = await registerUser('hist2');

    for (let i = 0; i < 6; i++) {
      await request(app)
        .post('/api/transactions/buy')
        .set('Authorization', `Bearer ${token}`)
        .send({ symbol: 'META', shares: 1 });
    }

    const res = await request(app)
      .get(`/api/transactions/${_id}/history?limit=3`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  it('returns 401 without a token', async () => {
    const { _id } = await registerUser('hist3');
    const res = await request(app).get(`/api/transactions/${_id}/history`);
    expect(res.status).toBe(401);
  });

  it('returns 403 when requesting another user\'s history', async () => {
    const { token } = await registerUser('hist4');
    const other = await registerUser('hist5');
    const res = await request(app)
      .get(`/api/transactions/${other._id}/history`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
