const request = require('supertest');
const app = require('../app');
const { setup, teardown, clearDB } = require('./setup');

beforeAll(setup);
afterAll(teardown);
afterEach(clearDB);

async function registerUser(username, password = 'pass123', balance) {
  const body = { username, password };
  if (balance !== undefined) body.balance = balance;
  const res = await request(app).post('/api/user/register').send(body);
  return res.body;
}

describe('POST /api/user/register', () => {
  it('creates a new user and returns a token with default balance', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ username: 'alice', password: 'secret' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ username: 'alice', balance: 10000 });
    expect(res.body.token).toBeDefined();
    expect(res.body._id).toBeDefined();
  });

  it('returns 400 when username is missing', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ password: 'secret' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ username: 'alice' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for a duplicate username', async () => {
    await registerUser('alice');
    const res = await request(app)
      .post('/api/user/register')
      .send({ username: 'alice', password: 'other' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/taken/i);
  });
});

describe('POST /api/user/login', () => {
  beforeEach(async () => {
    await registerUser('bob', 'mypass');
  });

  it('returns a token and user info on valid credentials', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ username: 'bob', password: 'mypass' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.username).toBe('bob');
    expect(res.body._id).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ username: 'bob', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown username', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({ username: 'nobody', password: 'pass' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when credentials are missing', async () => {
    const res = await request(app).post('/api/user/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/user/:userId/portfolio', () => {
  it('returns the portfolio array for the authenticated owner', async () => {
    const { _id, token } = await registerUser('carol');
    const res = await request(app)
      .get(`/api/user/${_id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 403 when requesting another user\'s portfolio', async () => {
    const { token } = await registerUser('carol2');
    const other = await registerUser('dave');
    const res = await request(app)
      .get(`/api/user/${other._id}/portfolio`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('returns 401 without a token', async () => {
    const { _id } = await registerUser('eve');
    const res = await request(app).get(`/api/user/${_id}/portfolio`);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/user/:userId/balance', () => {
  it('returns the correct starting balance', async () => {
    const { _id, token } = await registerUser('frank');
    const res = await request(app)
      .get(`/api/user/${_id}/balance`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(10000);
  });

  it('returns 401 without a token', async () => {
    const { _id } = await registerUser('frank2');
    const res = await request(app).get(`/api/user/${_id}/balance`);
    expect(res.status).toBe(401);
  });
});

describe('Watchlist endpoints', () => {
  let userId, token;

  beforeEach(async () => {
    const user = await registerUser('grace');
    userId = user._id;
    token = user.token;
  });

  it('returns an empty watchlist for a new user', async () => {
    const res = await request(app)
      .get(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.watchlist).toEqual([]);
  });

  it('adds a symbol (case-insensitive) to the watchlist', async () => {
    const res = await request(app)
      .post(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'aapl' });
    expect(res.status).toBe(200);
    expect(res.body.watchlist).toContain('AAPL');
  });

  it('does not duplicate symbols already in the watchlist', async () => {
    await request(app)
      .post(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL' });
    await request(app)
      .post(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'AAPL' });
    const res = await request(app)
      .get(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.watchlist.filter(s => s === 'AAPL').length).toBe(1);
  });

  it('removes a symbol from the watchlist', async () => {
    await request(app)
      .post(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`)
      .send({ symbol: 'TSLA' });
    const res = await request(app)
      .delete(`/api/user/${userId}/watchlist/TSLA`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.watchlist).not.toContain('TSLA');
  });

  it('returns 400 when symbol is missing from add request', async () => {
    const res = await request(app)
      .post(`/api/user/${userId}/watchlist`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });
});
