# Micro-Investment Education Platform

![Node.js](https://img.shields.io/badge/Node.js-Node.js-brightgreen) ![Express](https://img.shields.io/badge/Express-Express-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-MongoDB-darkgreen) ![React](https://img.shields.io/badge/React-React-lightblue) ![JavaScript](https://img.shields.io/badge/JavaScript-Programming_Language-yellow) ![API](https://img.shields.io/badge/Alpha%20Vantage-API-orange) ![NewsAPI](https://img.shields.io/badge/NewsAPI-API-red) ![Chart.js](https://img.shields.io/badge/Chart.js-Charts-ff6384) ![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)

The **Micro-Investment Education Platform** is a highly scalable and robust **educational application** designed to empower beginners in the domain of **investment strategies**. By leveraging **virtual currency** to simulate micro-investments in a **risk-free environment**, this platform allows users to **experiment with real-world investment strategies** while avoiding the potential downsides of actual financial exposure. The platform's core functionality includes integration with **real-time stock data** through **Alpha Vantage API**, providing users with actionable insights into **market trends** and **stock performance**. By utilizing **MongoDB** with an **in-memory database** layer for efficient **data storage** and rapid prototyping, alongside **React.js** for a dynamic, responsive user interface, the platform ensures an engaging learning experience.

The ultimate goal is to equip users with the **technical knowledge** and **practical skills** required to assess risks, forecast market behavior, and appreciate the complexities of **portfolio management**, all while gaining the confidence to navigate the stock market with informed decision-making capabilities. 🚀📈

Live Application: https://microinvestmentplatform-frontend.onrender.com/

---

### Demo Recording


https://github.com/user-attachments/assets/ccc7d0ad-ac2f-4155-8588-7f2fe20916ac

---


### Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Future Enhancements](#ideas-for-improvement-and-future-enhancements)
- [Requirements](#requirements)
- [API Interaction with Postman](#api-interaction-with-postman)
- [Contributing](#contributing)
- [Contact](#contact-)

---

### Features

- **User Authentication**: Secure login and registration system allowing users to create personalized accounts with custom starting balances.
- **Virtual Money Management**: Each user receives a set amount of virtual currency to simulate real-world investing.
- **Real-Time Market Data**: Users can access up-to-date stock prices and market conditions through integrated stock market APIs.
- **Interactive Stock Charts**: Visualize 30-day price trends for popular stocks with dynamic, interactive charts powered by Chart.js.
- **Buy & Sell Stocks**: Execute simulated buy and sell orders at real-time market prices, with automatic portfolio and balance updates.
- **Latest Stock News**: The platform provides the latest stock news through a news API, keeping users informed about market trends and events.
- **Transaction History**: Users can view their paginated transaction histories for buying and selling in a detailed table format, including price per share, revenue, date, and time.
- **Popular Stocks Section**: A dedicated section displays current popular stocks with clickable links to view their live prices.
- **Leaderboard & Gamification**: Track portfolio performance and foster healthy competition through a leaderboard showcasing top-performing users.
- **In-Memory Database with Seeded Demo Data**: Uses MongoDB Memory Server for instant setup with pre-loaded demo users and transactions, enabling immediate exploration without external database configuration.
- **User-Friendly Interface**: A responsive and interactive UI built with React, providing a seamless user experience.

---

### Code Structure

The platform is built using the following technologies:

- **Frontend**: Developed with React 18 and Chart.js for an engaging, data-driven user interface with interactive stock visualizations.
- **Backend**: Node.js with Express for handling user authentication, data processing, and API integrations.
- **Database**: MongoDB with Mongoose ODM for data modeling. Supports both **MongoDB Atlas** for persistent cloud storage and **MongoDB Memory Server** for lightweight in-memory operation with pre-seeded demo data — no external database setup required.
- **API**: Integrated with Alpha Vantage for real-time stock market data and a NEWS API for the latest news.

---

### Installation

1. **Clone the repository**:
   ```bash
   gh repo clone mariarodr1136/MicroInvestmentPlatform
- Alternatively, if you prefer to use HTTPS:
   ```bash
   https://github.com/mariarodr1136/MicroInvestmentPlatform.git

2. **Navigate to the backend directory**:
   ```bash
   cd MicroInvestmentPlatform/backend
3. **Install backend dependencies**:
   ```bash
   npm install
4. **Set up environment variables:**
- Create a `.env` file in the `backend` directory.
- Add your API keys. Example:
   ```bash
   REACT_APP_STOCK_API_KEY= your_react_stock_api
   PORT=5001
- **Note**: The platform uses **MongoDB Memory Server** by default, so no external database setup is required. The server automatically starts an in-memory MongoDB instance with pre-seeded demo data. To use a persistent **MongoDB Atlas** database instead, add your connection string:
   ```bash
   MONGODB_URI= your_mongodb_uri

5. **Start the backend server**:
   ```bash
   node index.js
6. **In a new terminal, navigate to the frontend directory**:
   ```bash
   cd MicroInvestmentPlatform/client
7. **Install frontend dependencies**:
   ```bash
   npm install
8. **Update the API key for news in the LatestNews.js file:**
- Open client/LatestNews.js and update line 7 as follows:
   ```bash
   const API_KEY = process.env.NEWS_API_KEY;
   const API_URL = `news_api_url`;

9. **Start the frontend server**:
   ```bash
   npm start

**Note**: To get the necessary API keys:
  - For stock market data, register at [Alpha Vantage](https://www.alphavantage.co).
  - For news data, register at [NewsAPI](https://newsapi.org).

---

### Deployment

Want to deploy your own live demo? The platform is ready for deployment on Render.com's free tier!

**Quick Deploy:**
1. Fork this repository to your GitHub account
2. Sign up at [Render.com](https://render.com)
3. Follow the step-by-step guide in [DEPLOYMENT.md](./DEPLOYMENT.md)

**Features:**
- Free hosting for both frontend and backend
- Auto-deploy from GitHub on every push
- Environment variable support for API keys
- In-memory database (no external DB setup required)

See the complete [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

---

### Ideas for Improvement and Future Enhancements

1. **Personalized Recommendations**: Use machine learning to suggest investments based on user preferences and past activities.
2. **Interactive Tutorials**: Add gamified tutorials to teach investment basics and advanced strategies in an engaging way.
3. **Portfolio Growth Tracking**: Extend the existing stock charts to visualize portfolio performance and growth over time.
4. **Mobile Application**: Develop a mobile app for iOS and Android to make the platform more accessible.

---

### Requirements
- Node.js (v14 or later)
- MongoDB (optional — MongoDB Memory Server is included for zero-config in-memory operation)
- React (v17 or later)
- Stock market and NEWS API access key (e.g., Alpha Vantage)

---

### Fixing the URL in Your Frontend
Once you have a user ID, update your App.js to view data in frontend:

- const userId = '60d21b4667d0d8992e610c85'

---

## API Interaction with Postman

You can use Postman to interact with the API and perform various actions. Below are some common operations:

1. **Register a User**
    - **Endpoint**: `/api/user/register`
    - **HTTP Method**: `POST`
    - **Description**: Adds a new `User` with username, email, and password.
    - **Request Body**:
      ```json
      {
        "username": "string",
        "email": "string",
        "password": "string"
      }
      ```
    - **Response**: The created `User` object with balance, portfolio, and ID.

2. **Login a User**
    - **Endpoint**: `/api/user/login`
    - **HTTP Method**: `POST`
    - **Description**: Authenticates a `User` with username and password.
    - **Request Body**:
      ```json
      {
        "username": "string",
        "password": "string"
      }
      ```
    - **Response**: The `User` object with `id, username`, and `balance`.

3. **Retrieve All Users**
    - **Endpoint**: `api/user`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves all registered `User` objects

    - **Response**: All `User` objects with `id, username, balance`, and `stock portfolio`.

4. **Retrieve a User Portfolio by ID**
    - **Endpoint**: `/api/user/{id}/portfolio`
    - **HTTP Method**: `GET`
    - **Description**: Fetches `User` portfolio by their ID.
    - **Response**:
      ```json
      {
        "symbol": "stock string",
        "shares": "integer",
        "avgPrice": "integer",
        "id": "integer"
      }
      ```

5. **Create a Transaction**
    - **Endpoint**: `/api/transactions/buy`
    - **HTTP Method**: `POST`
    - **Description**: Purchase Stock Option
    - **Request Body**:
      ```json
      {
        "userId": "integer",
        "symbol": "string - Stock symbol",
        "shares": "integer - Number of shares to buy",    
      }
      ```
    - **Response**: "Stock purchased successfully"
  
    - **Endpoint**: `/api/transactions/sell`
    - **HTTP Method**: `POST`
    - **Description**: Sell Stock Option
    - **Request Body**:
      ```json
      {
        "userId": "integer",
        "symbol": "string - Stock symbol",
        "shares": "integer - Number of shares to sell",    
      }
      ```
    - **Response**:
      ```json
      {
          "message": "Stock sold successfully",
          "balance": "integer",
          "soldShares": "integer",
          "revenue": "integer"
      }
      ```
      
6. **Retrieve Transaction History**
    - **Endpoint**: `/api/transactions/{userId}/history`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves paginated transaction history for a `User`
    - **Query Parameters**: `page` (default: 1), `limit` (default: 5)
    - **Response**:
      ```json
      {
        "transactions": [
          {
            "type": "buy | sell",
            "symbol": "string",
            "shares": "integer",
            "pricePerShare": "number",
            "date": "date"
          }
        ],
        "currentPage": "integer",
        "totalPages": "integer",
        "totalTransactions": "integer"
      }
      ```

7. **Retrieve User Current Balance**
    - **Endpoint**: `/api/user/{id}/balance`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves `User` current balance
    - **Response**:
      ```json
      {
        "balance": "integer"
      }
      ```

8. **Retrieve Leaderboard**
    - **Endpoint**: `/api/leaderboard`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves the top 5 users ranked by balance
    - **Response**:
      ```json
      [
        {
          "username": "string",
          "balance": "number"
        }
      ]
      ```

---

### Contributing
Feel free to submit issues or pull requests for improvements or bug fixes. You can also open issues to discuss potential changes or enhancements. All contributions are welcome to enhance the app’s features or functionality!

To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feat/your-feature-name
- Alternatively, for bug fixes:
   ```bash
   git checkout -b fix/your-bug-fix-name
3. Make your changes and run all tests before committing the changes and make sure all tests are passed.
4. After all tests are passed, commit your changes with descriptive messages:
   ```bash
   git commit -m 'add your commit message'
5. Push your changes to your forked repository:
   ```bash
   git push origin feat/your-feature-name.
6. Submit a pull request to the main repository, explaining your changes and providing any necessary details.

---

### Contact 🌐
If you have any questions or feedback, feel free to reach out at [mrodr.contact@gmail.com](mailto:mrodr.contact@gmail.com).
