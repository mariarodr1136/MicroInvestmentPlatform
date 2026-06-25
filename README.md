# VestLab: Full-Stack Micro-Investment Platform

![Node.js](https://img.shields.io/badge/Node.js-Node.js-brightgreen) ![Express](https://img.shields.io/badge/Express-Express-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-MongoDB-darkgreen) ![React](https://img.shields.io/badge/React-React-lightblue) ![JavaScript](https://img.shields.io/badge/JavaScript-Programming_Language-yellow) ![API](https://img.shields.io/badge/Alpha%20Vantage-API-orange) ![NewsAPI](https://img.shields.io/badge/NewsAPI-API-red) ![Chart.js](https://img.shields.io/badge/Chart.js-Charts-ff6384) ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)

**VestLab: Micro-Investment Platform** is a highly scalable and robust **educational application** designed to empower beginners in the domain of **investment strategies**. By leveraging **virtual currency** to simulate micro-investments in a **risk-free environment**, this platform allows users to **experiment with real-world investment strategies** while avoiding the potential downsides of actual financial exposure.

The platform integrates with **real-time stock data** through the **Alpha Vantage API**, providing users with actionable insights into **market trends** and **stock performance**. It uses **MongoDB** with an **in-memory database** layer for rapid prototyping, and **React.js** for a dynamic, responsive user interface.

---

Live Application: https://microinvestmentplatform-frontend.onrender.com/

*Note: The live app is hosted on Render's free tier, so the backend may take 1-2 minutes to wake up after inactivity.*

---

### Demo Recording


https://github.com/user-attachments/assets/209aa449-844b-4291-9f85-5c7b797e50c5

---

### Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Architecture Overview](#architecture-overview)
- [Environment and Config](#environment-and-config)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Requirements](#requirements)
- [API Interaction with Postman](#api-interaction-with-postman)
- [Contributing](#contributing)
- [Contact](#contact)

---

### Features

**Trading & Portfolio**
- **Secure Authentication**: Registration and login with bcrypt-hashed passwords and JWT tokens. All user-specific routes are protected and ownership-verified.
- **Guest Mode**: Explore the app instantly with seeded demo data — no account required.
- **Virtual Money Management**: Every user starts with a $10,000 virtual balance to simulate real trading.
- **Buy & Sell Stocks**: Simulated trades update portfolio and balance in real time with toast notifications.
- **Live Price Preview**: Typing a stock symbol in the buy/sell form fetches the current price and shows the estimated cost or revenue before you trade.
- **Trade Confirmation Modal**: Every buy and sell shows a confirmation dialog with symbol, share count, current price, and estimated total — preventing accidental trades.
- **Colour-Coded Portfolio Cards**: Each held stock shows a live gain/loss badge (▲/▼ % and $) comparing the current price to your average cost.
- **Portfolio Allocation Chart**: Donut chart showing the percentage breakdown of your holdings by market value.
- **Portfolio Performance Chart**: Line chart tracking your total portfolio value over time, computed from your full transaction history.
- **Watchlist**: Persist a list of stocks to monitor — prices refresh every 30 seconds. Add from the Stock Lookup or type directly.
- **Stock Lookup**: Search any ticker symbol to see its current price before committing to a trade, with a one-click add to your watchlist.
- **CSV Export**: Download your full transaction history as a CSV file.

**Market Data & Insights**
- **Market Indices Bar**: Live-ticking strip showing S&P 500, NASDAQ, DOW Jones, Russell 2000, and VIX at the top of the dashboard.
- **Interactive Stock Charts**: 30-day price trends for 15 tickers rendered with Chart.js. Buttons scroll horizontally — no wrapping.
- **Latest Stock News**: Market headlines powered by NewsAPI, cached server-side and scrollable without pagination buttons.
- **Popular Stocks**: 39 tickers as pill buttons linking to Yahoo Finance for quick research.

**Stats & Gamification**
- **Leaderboard**: Top 8 users ranked by total portfolio value (cash balance + holdings at avg cost).
- **User Stats Card**: Total trades, buy/sell count, win rate, unique stocks traded, total invested, and realized P&L — all with hover tooltips explaining each metric.
- **What-If Simulator**: Enter any ticker, share count, and time horizon (1W–1Y) to see a simulated projected return without placing a real trade.

**UI & Experience**
- **Redesigned Dashboard Layout**: Chart and trade forms side by side, three-column row for Popular Stocks / Leaderboard / News, full-width sections for Portfolio and Transactions.
- **Semantic Color System**: Each section has its own color — green for Buy, red for Sell, blue for Chart/News, amber for Leaderboard/Simulator, teal for Popular/Watchlist, purple for Transactions.
- **Glossary Tooltips**: Hover the `?` icon on any stat label for a plain-English explanation.
- **Shimmer Skeleton Loaders**: Shown while portfolio data is loading.
- **Slide-in Toast Notifications**: Success and error feedback on every trade.
- **Floating Scroll-Spy Nav**: Dot navigation on the right side highlights the active section and jumps to any section on click.
- **Scrollable Sections**: Transaction history and news both scroll within a fixed-height container — no show-more buttons.
- **Seeded Demo Data**: Eight pre-built users with portfolios and transactions for instant demo use.

---

### Code Structure

```
MicroInvestmentPlatform/
├── backend/
│   ├── index.js                  # Server entry, DB seed, route mounting
│   ├── app.js                    # Express app factory (imported by index.js and tests)
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (portfolio, watchlist)
│   │   ├── Transaction.js        # Trade record schema
│   │   └── Leaderboard.js
│   ├── routes/
│   │   ├── userRoutes.js         # Auth, portfolio, balance, watchlist CRUD
│   │   ├── transactionRoutes.js  # Buy, sell, history
│   │   ├── stockRoutes.js        # Price lookup (Alpha Vantage + cache)
│   │   ├── leaderboardRoutes.js  # Top 8 users by total value
│   │   └── newsRoutes.js         # Headlines (NewsAPI + cache)
│   ├── utils/
│   │   └── stockPrice.js
│   └── __tests__/
│       ├── setup.js              # Shared MongoDB Memory Server lifecycle helpers
│       ├── userRoutes.test.js    # Auth, portfolio, balance, watchlist tests
│       ├── transactionRoutes.test.js  # Buy, sell, history tests
│       └── stockPrice.test.js    # Price fetching, caching, and fallback tests
└── client/
    └── src/
        ├── App.js                # Root layout and state
        ├── App.css
        ├── index.css             # Global design system (CSS variables, all component styles)
        ├── config.js             # API base URL and auth header helper
        ├── components/
        │   ├── AuthScreen.js
        │   ├── WelcomeBanner.js
        │   ├── MarketIndices.js          # Live indices strip
        │   ├── Portfolio.js              # Carousel + allocation donut
        │   ├── Portfolio.css
        │   ├── PortfolioAllocation.js    # Donut chart (Chart.js)
        │   ├── PortfolioPerformance.js   # Value-over-time line chart
        │   ├── StockChart.js             # 30-day price trends
        │   ├── BuyStock.js
        │   ├── SellStock.js
        │   ├── StockSearch.js            # Ticker lookup + watchlist add
        │   ├── Watchlist.js              # Persistent watchlist with live prices
        │   ├── WhatIfSimulator.js        # Hypothetical return calculator
        │   ├── PopularStocks.js          # 39 ticker chips
        │   ├── Leaderboard.js            # Top 8 users
        │   ├── LatestNews.js             # Scrollable news feed
        │   ├── TransactionHistory.js     # Scrollable table + CSV export
        │   ├── UserStats.js              # Trade stats with tooltips
        │   ├── Tooltip.js                # Reusable hover tooltip
        │   ├── ConfirmModal.js           # Trade confirmation dialog
        │   └── ScrollNav.js              # Floating dot navigation
        ├── context/
        │   └── ToastContext.js
        └── hooks/
            └── useDebounce.js
```

---

### Architecture Overview

- **React UI** renders dashboards and sends authenticated requests to the backend.
- **Express API** handles auth (bcrypt + JWT), trades, news proxying, and leaderboard logic.
- **Auth Middleware** verifies JWT tokens and enforces per-user data ownership on all protected routes.
- **Alpha Vantage** provides stock prices used in buy/sell flows and charts, served via a 5-minute in-memory cache.
- **NewsAPI** provides market headlines through a backend proxy with a 30-minute cache.
- **MongoDB Memory Server** stores users, portfolios, watchlists, and transactions in-memory by default.

---

### Environment and Config

Environment variables are split by layer:
- `backend/.env`: `ALPHA_VANTAGE_API_KEY`, `NEWS_API_KEY`, `PORT`, `JWT_SECRET`, `MONGODB_URI` (optional)
- `client/.env`: `REACT_APP_STOCK_API_KEY` (optional, only for local stock charts)

---

### Installation

1. **Clone the repository**:
   ```bash
   gh repo clone mariarodr1136/MicroInvestmentPlatform
   ```
   If you prefer HTTPS:
   ```bash
   git clone https://github.com/mariarodr1136/MicroInvestmentPlatform.git
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd MicroInvestmentPlatform/backend
   ```

3. **Install backend dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables (backend)**:
   Create a `.env` file in `backend/` with:
   ```bash
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   NEWS_API_KEY=your_newsapi_key
   PORT=5001
   JWT_SECRET=your-strong-random-secret-here
   ```
   Optional — use MongoDB Atlas instead of in-memory storage:
   ```bash
   MONGODB_URI=your_mongodb_uri
   ```

5. **Start the backend server**:
   ```bash
   node index.js
   ```

6. **In a new terminal, navigate to the frontend directory**:
   ```bash
   cd MicroInvestmentPlatform/client
   ```

7. **Install frontend dependencies**:
   ```bash
   npm install
   ```

8. **Set up environment variables (frontend)**:
   Create a `.env` file in `client/` only if you want live stock charts locally:
   ```bash
   REACT_APP_STOCK_API_KEY=your_alpha_vantage_api_key
   ```

9. **Start the frontend**:
   ```bash
   npm start
   ```
   The app runs on `http://localhost:5002` by default.

API keys:
- Alpha Vantage: https://www.alphavantage.co
- NewsAPI: https://newsapi.org

---

<img width="1470" height="790" alt="Screenshot 2026-06-25 at 3 55 10 PM" src="https://github.com/user-attachments/assets/5935a21b-624a-4de4-897b-591a0ca6b251" />


---


<img width="1470" height="800" alt="Screenshot 2026-06-25 at 3 58 31 PM" src="https://github.com/user-attachments/assets/90aec1f4-b5d4-441b-96bd-05066981559e" />


---


### API Reference

Base URL: `http://localhost:5001`

**Public endpoints** (no auth required):
- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/leaderboard`
- `GET /api/news`

**Protected endpoints** (require `Authorization: Bearer <token>` header):
- `GET /api/user/{id}/portfolio`
- `GET /api/user/{id}/balance`
- `GET /api/user/{id}/username`
- `GET /api/user/{id}/watchlist`
- `POST /api/user/{id}/watchlist`
- `DELETE /api/user/{id}/watchlist/{symbol}`
- `POST /api/transactions/buy`
- `POST /api/transactions/sell`
- `GET /api/transactions/{userId}/history`
- `GET /api/stocks/price/{symbol}`

---

### Testing

The backend has an automated test suite built with **Jest** and **Supertest**, using **mongodb-memory-server** to spin up a real isolated MongoDB instance per test run — no mocks for the database layer.

**Run the tests**
```bash
cd backend
npm test
```

**Test suite overview — 41 tests across 3 files**

| File | Tests | What's covered |
|---|---|---|
| `userRoutes.test.js` | 18 | Auth (register/login), portfolio, balance, and full watchlist CRUD |
| `transactionRoutes.test.js` | 18 | Buy/sell trade flows, input validation, and transaction history |
| `stockPrice.test.js` | 5 | Alpha Vantage price parsing, rate-limit fallback, error fallback, and 5-min cache |

**Key scenarios tested**

- **Registration**: creates user with $10,000 default balance and returns a signed JWT; rejects missing fields; rejects duplicate usernames.
- **Login**: returns token for valid credentials; returns 401 for wrong password or unknown user.
- **Auth middleware**: all protected routes return 401 with no token and 403 when a user requests another user's data.
- **Buy flow**: deducts balance, adds position to portfolio, and recalculates weighted-average cost basis when adding to an existing position. Rejects insufficient funds, fractional shares, zero/negative shares, and missing fields.
- **Sell flow**: credits revenue, removes fully-sold positions from portfolio, and handles partial sells correctly. Rejects selling unowned stock and over-selling.
- **Transaction history**: returns results sorted newest-first and respects the `limit` query parameter.
- **Price caching**: verifies that a second fetch for the same symbol within the 5-minute TTL skips the API call entirely.
- **API fallback**: confirms the fallback mock-price table is used when Alpha Vantage is rate-limited or unreachable.

---

### Requirements
- Node.js v18 or later
- MongoDB (optional — in-memory mode is built-in)
- React v18
- Alpha Vantage API key
- NewsAPI key

---

## API Interaction with Postman

1. **Register a user**
   - **Endpoint**: `POST /api/user/register`
   - **Body**:
     ```json
     { "username": "string", "password": "string", "balance": 10000 }
     ```
   - **Response**:
     ```json
     { "_id": "string", "username": "string", "balance": 10000, "token": "eyJ..." }
     ```

2. **Login**
   - **Endpoint**: `POST /api/user/login`
   - **Body**:
     ```json
     { "username": "string", "password": "string" }
     ```
   - **Response**:
     ```json
     { "_id": "string", "username": "string", "balance": 10000, "token": "eyJ..." }
     ```

3. **Get portfolio**
   - **Endpoint**: `GET /api/user/{id}/portfolio`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     [{ "symbol": "AAPL", "shares": 5, "avgPrice": 178.5 }]
     ```

4. **Get / manage watchlist**
   - `GET /api/user/{id}/watchlist` → `{ "watchlist": ["AAPL", "NVDA"] }`
   - `POST /api/user/{id}/watchlist` body `{ "symbol": "TSLA" }` → updated watchlist
   - `DELETE /api/user/{id}/watchlist/TSLA` → updated watchlist

5. **Buy a stock**
   - **Endpoint**: `POST /api/transactions/buy`
   - **Headers**: `Authorization: Bearer <token>`
   - **Body**: `{ "symbol": "AAPL", "shares": 2 }`
   - **Response**: `{ "message": "Stock purchased successfully", "balance": 9643.0 }`

6. **Sell a stock**
   - **Endpoint**: `POST /api/transactions/sell`
   - **Headers**: `Authorization: Bearer <token>`
   - **Body**: `{ "symbol": "AAPL", "shares": 1 }`
   - **Response**: `{ "message": "Stock sold successfully", "balance": 10178.5, "soldShares": 1, "revenue": 178.5 }`

7. **Transaction history**
   - **Endpoint**: `GET /api/transactions/{userId}/history?limit=100`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**: Array of transactions (most recent first), each with `symbol`, `shares`, `pricePerShare`, `type`, `date`, and `buyPricePerShare` on sell rows.

8. **Stock price**
   - **Endpoint**: `GET /api/stocks/price/{symbol}`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**: `{ "symbol": "AAPL", "price": 178.50 }`

9. **Leaderboard**
   - **Endpoint**: `GET /api/leaderboard`
   - **Response**: Array of top 8 users with `username` and `totalValue`.

---

### Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes and commit with a clear message:
   ```bash
   git commit -m "your commit message"
   ```
4. Push your branch and open a pull request with a clear description of your changes.

---

### Contact

For questions or feedback: mrodr.contact@gmail.com
