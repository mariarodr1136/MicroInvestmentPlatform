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

https://github.com/user-attachments/assets/ccc7d0ad-ac2f-4155-8588-7f2fe20916ac

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

- **User Authentication**: Secure login and registration with optional custom starting balances.
- **Guest Mode**: Explore the app instantly with seeded demo data and no account creation.
- **Virtual Money Management**: Every user starts with a virtual balance to simulate real trading.
- **Real-Time Market Data**: Pulls current stock data using Alpha Vantage.
- **Interactive Stock Charts**: 30-day price trends rendered with Chart.js.
- **Buy & Sell Stocks**: Simulated trades update portfolio and balance in real time.
- **Latest Stock News**: Market headlines powered by NewsAPI.
- **Transaction History**: Paginated trade history with prices and timestamps.
- **Popular Stocks Section**: Quick access to trending tickers and live prices.
- **Leaderboard & Gamification**: Track performance across top users.
- **Seeded Demo Data**: MongoDB Memory Server provides instant, zero-config demo data.
- **Responsive UI**: A clean, modern React interface built for usability.

---

### Code Structure

- **Frontend**: React 18 + Chart.js for interactive, data-driven visuals.
- **Backend**: Node.js + Express for authentication, trades, and API integrations.
- **Database**: MongoDB + Mongoose. Runs in-memory by default, with optional MongoDB Atlas support.
- **APIs**: Alpha Vantage (stocks) and NewsAPI (news).

---

### Architecture Overview

Client UI calls the backend API, which orchestrates external data and persistence:
- **React UI** renders dashboards and sends requests to the backend.
- **Express API** handles auth, trades, news proxying, and leaderboard logic.
- **Alpha Vantage** provides stock prices used in buy/sell flows and charts.
- **NewsAPI** provides market headlines through a backend proxy route.
- **MongoDB Memory Server** stores users, portfolios, and transactions in-memory by default.

---

### Environment and Config

Environment variables are split by layer:
- `backend/.env`: `ALPHA_VANTAGE_API_KEY`, `NEWS_API_KEY`, `PORT`, `MONGODB_URI` (optional)
- `client/.env`: `REACT_APP_STOCK_API_KEY` (optional, only for local stock charts)

---

<img width="1463" height="524" alt="Screenshot 2026-02-13 at 5 53 33 PM" src="https://github.com/user-attachments/assets/8d5c86e3-1c71-447d-a6bf-5a653c50e315" />

<img width="1466" height="570" alt="Screenshot 2026-02-13 at 5 53 51 PM" src="https://github.com/user-attachments/assets/1d0d99b0-2482-4333-bb99-bbe02c7df510" />

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

Core endpoints:
- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user`
- `GET /api/user/{id}/portfolio`
- `GET /api/user/{id}/username`
- `GET /api/user/{id}/balance`
- `POST /api/transactions/buy`
- `POST /api/transactions/sell`
- `GET /api/transactions/{userId}/history`
- `GET /api/leaderboard`
- `GET /api/news`

See **API Interaction with Postman** below for example requests and responses.

---

### Testing

There are no automated tests yet. For manual verification, use this quick smoke flow:
1. Start backend and frontend servers.
2. Click **Continue as Guest** to load seeded demo data.
3. Buy and sell a stock and confirm balance/portfolio updates.
4. Open the News section and confirm headlines load.

---

### Ideas for Improvement and Future Enhancements

1. **Personalized Recommendations**: Suggest trades based on user behavior and goals.
2. **Interactive Tutorials**: Guided lessons that teach investing fundamentals.
3. **Portfolio Growth Tracking**: Visualize portfolio performance over time.
4. **Mobile Application**: Native iOS and Android apps.

---

<img width="1432" height="691" alt="Screenshot 2026-02-13 at 5 57 50 PM" src="https://github.com/user-attachments/assets/f3adec95-773b-458c-a4a5-f8f865156c1c" />

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
   - **Response**: Created user object

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
       "balance": 10000
     }
     ```

3. **Retrieve all users**
   - **Endpoint**: `/api/user`
   - **Method**: `GET`
   - **Response**: All users with `id`, `username`, `balance`, and `portfolio`

4. **Retrieve a user portfolio**
   - **Endpoint**: `/api/user/{id}/portfolio`
   - **Method**: `GET`
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

5. **Buy a stock**
   - **Endpoint**: `/api/transactions/buy`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "userId": "string",
       "symbol": "AAPL",
       "shares": 2
     }
     ```
   - **Response**: Confirmation with updated user

6. **Sell a stock**
   - **Endpoint**: `/api/transactions/sell`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "userId": "string",
       "symbol": "AAPL",
       "shares": 1
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Stock sold successfully",
       "balance": 10000,
       "soldShares": 1,
       "revenue": 500
     }
     ```

7. **Transaction history**
   - **Endpoint**: `/api/transactions/{userId}/history?page=1&limit=5`
   - **Method**: `GET`
   - **Response**: Array of transactions (most recent first)

8. **Retrieve user balance**
   - **Endpoint**: `/api/user/{id}/balance`
   - **Method**: `GET`
   - **Response**:
     ```json
     {
       "balance": 10000
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
         "balance": 12000
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
