# Micro-Investment Education Platform

![Node.js](https://img.shields.io/badge/Node.js-Node.js-brightgreen) ![Express](https://img.shields.io/badge/Express-Express-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-MongoDB-darkgreen) ![React](https://img.shields.io/badge/React-React-lightblue) ![JavaScript](https://img.shields.io/badge/JavaScript-Programming_Language-yellow) ![API](https://img.shields.io/badge/Alpha%20Vantage-API-orange) ![NewsAPI](https://img.shields.io/badge/NewsAPI-API-red) ![Chart.js](https://img.shields.io/badge/Chart.js-Charts-ff6384) ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)

The **Micro-Investment Education Platform** is a highly scalable and robust **educational application** designed to empower beginners in the domain of **investment strategies**. By leveraging **virtual currency** to simulate micro-investments in a **risk-free environment**, this platform allows users to **experiment with real-world investment strategies** while avoiding the potential downsides of actual financial exposure.

The platform's core functionality includes integration with **real-time stock data** through **Alpha Vantage API**, providing users with actionable insights into **market trends** and **stock performance**. By utilizing **MongoDB** with an **in-memory database** layer for efficient **data storage** and rapid prototyping, alongside **React.js** for a dynamic, responsive user interface, the platform ensures an engaging learning experience.

The ultimate goal is to equip users with the **technical knowledge** and **practical skills** required to assess risks, forecast market behavior, and appreciate the complexities of **portfolio management**, all while gaining the confidence to navigate the stock market with informed decision-making capabilities. 🚀📈

---

Live Application: https://microinvestmentplatform-frontend.onrender.com/

*Note: The live app is hosted on Render's free tier, so the backend may take 1-2 minutes to wake up after inactivity.*

---

### Demo Recording



https://github.com/user-attachments/assets/a87966bc-f297-478a-b2a5-e1176582867a


---

### Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Architecture Overview](#architecture-overview)
- [Environment and Config](#environment-and-config)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Ideas for Improvement and Future Enhancements](#ideas-for-improvement-and-future-enhancements)
- [Requirements](#requirements)
- [API Interaction with Postman](#api-interaction-with-postman)
- [Contributing](#contributing)
- [Contact](#contact)

---

### Features

- **Secure Authentication**: Registration and login with bcrypt-hashed passwords and JWT tokens. All user-specific routes are protected and ownership-verified.
- **Guest Mode**: Explore the app instantly with seeded demo data and no account creation.
- **Virtual Money Management**: Every user starts with a virtual balance to simulate real trading.
- **Real-Time Market Data**: Pulls current stock data using Alpha Vantage, with a 5-minute server-side cache to stay within free-tier limits.
- **Live Price Preview**: Typing a stock symbol in the buy/sell form fetches the current price after a short pause and shows the estimated cost or revenue before you trade.
- **Trade Confirmation Modal**: Every buy and sell shows a confirmation dialog with symbol, share count, current price, and estimated total — preventing accidental trades.
- **Interactive Stock Charts**: 30-day price trends rendered with Chart.js.
- **Buy & Sell Stocks**: Simulated trades update portfolio and balance in real time with toast notifications.
- **Latest Stock News**: Market headlines powered by NewsAPI, cached server-side for 30 minutes.
- **Transaction History**: Paginated trade history with prices, compact timestamps, per-trade P&L on sell rows, and a back-to-top button when expanded.
- **Popular Stocks Section**: Quick access to trending tickers and live prices.
- **Leaderboard & Gamification**: Top users ranked by total portfolio value (cash balance + holdings).
- **Colour-Coded Portfolio Cards**: Each held stock shows a live gain/loss badge (▲/▼ % and $) comparing the current price to your average cost.
- **Seeded Demo Data**: MongoDB Memory Server provides instant, zero-config demo data.
- **Polished UI**: Shimmer skeleton loaders, slide-in toast notifications, empty-state illustrations, and a floating scroll-spy dot nav to jump between sections.

---

### Code Structure

- **Frontend**: React 18 + Chart.js for interactive, data-driven visuals.
- **Backend**: Node.js + Express for authentication, trades, and API integrations.
- **Database**: MongoDB + Mongoose. Runs in-memory by default, with optional MongoDB Atlas support.
- **APIs**: Alpha Vantage (stocks) and NewsAPI (news).

---

### Architecture Overview

Client UI calls the backend API, which orchestrates external data and persistence:
- **React UI** renders dashboards and sends authenticated requests to the backend.
- **Express API** handles auth (bcrypt + JWT), trades, news proxying, and leaderboard logic.
- **Auth Middleware** verifies JWT tokens and enforces per-user data ownership on all protected routes.
- **Alpha Vantage** provides stock prices used in buy/sell flows and charts, served via a 5-minute in-memory cache.
- **NewsAPI** provides market headlines through a backend proxy with a 30-minute cache.
- **MongoDB Memory Server** stores users, portfolios, and transactions in-memory by default.

---

### Environment and Config

Environment variables are split by layer:
- `backend/.env`: `ALPHA_VANTAGE_API_KEY`, `NEWS_API_KEY`, `PORT`, `JWT_SECRET`, `MONGODB_URI` (optional)
- `client/.env`: `REACT_APP_STOCK_API_KEY` (optional, only for local stock charts)

---

<img width="1462" height="595" alt="Screenshot 2026-06-02 at 4 03 52 PM" src="https://github.com/user-attachments/assets/4c11c2d9-99d9-4a10-950e-8107e049db80" />

<img width="1462" height="763" alt="Screenshot 2026-06-02 at 4 04 15 PM" src="https://github.com/user-attachments/assets/3765fc4e-429f-4390-b07e-9733ae5f93f1" />


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
   Create a `.env` file in `backend` with the following values:
   ```bash
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
   NEWS_API_KEY=your_newsapi_key
   PORT=5001
   JWT_SECRET=your-strong-random-secret-here
   ```
   Optional: Use MongoDB Atlas instead of in-memory storage:
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
   Create a `.env` file in `client` only if you want the stock chart locally:
   ```bash
   REACT_APP_STOCK_API_KEY=your_alpha_vantage_api_key
   ```

9. **Start the frontend server**:
   ```bash
   npm start
   ```

API keys can be obtained from:
- Alpha Vantage: https://www.alphavantage.co
- NewsAPI: https://newsapi.org

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
- `POST /api/transactions/buy`
- `POST /api/transactions/sell`
- `GET /api/transactions/{userId}/history`
- `GET /api/stocks/price/{symbol}`

See **API Interaction with Postman** below for example requests and responses.

---

### Testing

There are no automated tests yet. For manual verification, use this quick smoke flow:
1. Start backend and frontend servers.
2. Click **Continue as Guest** to load seeded demo data.
3. Type a symbol in the Buy form and confirm the live price preview appears after a short pause.
4. Buy a stock and confirm the trade confirmation modal appears, then approve — a toast notification should slide in and the portfolio card should update with a gain/loss badge.
5. Open the News section and confirm headlines load.
6. Check the Leaderboard and confirm users are ranked by total portfolio value.
7. Expand transaction history past 5 rows and confirm the Back to Top button appears.
8. Scroll the page and confirm the floating dot nav on the right highlights the active section.

---

### Ideas for Improvement and Future Enhancements

1. **Personalized Recommendations**: Suggest trades based on user behavior and goals.
2. **Interactive Tutorials**: Guided lessons that teach investing fundamentals.
3. **Portfolio Growth Tracking**: Visualize portfolio performance over time.
4. **Mobile Application**: Native iOS and Android apps.

---

<img width="1463" height="790" alt="Screenshot 2026-06-02 at 4 04 05 PM" src="https://github.com/user-attachments/assets/211c5c69-6085-4ef0-b63c-cf3979b7a7ad" />

---

### Requirements
- Node.js (v14 or later)
- MongoDB (optional, in-memory mode is built-in)
- React (v17 or later)
- Alpha Vantage API key
- NewsAPI key

---

## API Interaction with Postman

Common API operations:

1. **Register a user**
   - **Endpoint**: `/api/user/register`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "username": "string",
       "password": "string",
       "balance": 10000
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "string",
       "username": "string",
       "balance": 10000,
       "token": "eyJ..."
     }
     ```

2. **Login a user**
   - **Endpoint**: `/api/user/login`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "_id": "string",
       "username": "string",
       "balance": 10000,
       "token": "eyJ..."
     }
     ```

3. **Retrieve a user portfolio**
   - **Endpoint**: `/api/user/{id}/portfolio`
   - **Method**: `GET`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     [
       {
         "symbol": "AAPL",
         "shares": 5,
         "avgPrice": 178.5
       }
     ]
     ```

4. **Buy a stock**
   - **Endpoint**: `/api/transactions/buy`
   - **Method**: `POST`
   - **Headers**: `Authorization: Bearer <token>`
   - **Body**:
     ```json
     {
       "symbol": "AAPL",
       "shares": 2
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Stock purchased successfully",
       "balance": 9643.0
     }
     ```

5. **Sell a stock**
   - **Endpoint**: `/api/transactions/sell`
   - **Method**: `POST`
   - **Headers**: `Authorization: Bearer <token>`
   - **Body**:
     ```json
     {
       "symbol": "AAPL",
       "shares": 1
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Stock sold successfully",
       "balance": 10178.5,
       "soldShares": 1,
       "revenue": 178.5
     }
     ```

6. **Transaction history**
   - **Endpoint**: `/api/transactions/{userId}/history?page=1&limit=5`
   - **Method**: `GET`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**: Array of transactions (most recent first), each including `symbol`, `shares`, `pricePerShare`, `type`, `date`, and `buyPricePerShare`/`revenue` on sell rows.

7. **Retrieve user balance**
   - **Endpoint**: `/api/user/{id}/balance`
   - **Method**: `GET`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "balance": 10000
     }
     ```

8. **Get current stock price**
   - **Endpoint**: `/api/stocks/price/{symbol}`
   - **Method**: `GET`
   - **Headers**: `Authorization: Bearer <token>`
   - **Response**:
     ```json
     {
       "symbol": "AAPL",
       "price": 178.50
     }
     ```

9. **Retrieve leaderboard**
   - **Endpoint**: `/api/leaderboard`
   - **Method**: `GET`
   - **Response**:
     ```json
     [
       {
         "username": "string",
         "totalValue": 12450.75
       }
     ]
     ```

---

### Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
   For bug fixes:
   ```bash
   git checkout -b fix/your-bug-fix-name
   ```
3. Make your changes and run tests.
4. Commit with a clear message:
   ```bash
   git commit -m "your commit message"
   ```
5. Push your branch:
   ```bash
   git push origin feat/your-feature-name
   ```
6. Open a pull request with a clear description of your changes.

---

### Contact

For questions or feedback: mrodr.contact@gmail.com
