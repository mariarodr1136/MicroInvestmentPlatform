# Micro-Investment Education Platform

The Micro-Investment Education Platform is an innovative educational app crafted to empower beginners in the world of investing. By simulating micro-investments within a risk-free environment using virtual money, this platform allows users to explore various investment strategies and gain insights into market dynamics without the fear of losing real funds. The goal is to instill the knowledge and confidence necessary for users to navigate the complexities of investing, enabling them to understand market trends, evaluate risks, and appreciate the potential rewards of their investment decisions safely and engagingly. 📈

![Node.js](https://img.shields.io/badge/Node.js-Node.js-brightgreen) ![Express](https://img.shields.io/badge/Express-Express-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-MongoDB-darkgreen) ![React](https://img.shields.io/badge/React-React-lightblue) ![JavaScript](https://img.shields.io/badge/JavaScript-JavaScript-yellow) ![Alpha Vantage](https://img.shields.io/badge/API-Alpha%20Vantage-orange)

<img width="1451" alt="Screenshot 2024-10-30 at 4 00 09 PM" src="https://github.com/user-attachments/assets/7aa5e4df-401e-4d7d-a631-ccf29ce1abaa">

### Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Installation](#installation)
- [Requirements](#requirements)
- [API Interaction with Postman](#api-interaction-with-postman)
- [Contributing](#contributing)
- [Contact](#contact-)

---

### Features 

- **Virtual Money Management**: Each user receives a set amount of virtual currency to simulate real-world investing.
- **Real-Time Market Data**: Users can access up-to-date stock prices and market conditions through integrated stock market APIs.
- **Latest Stock News**: The platform provides the latest stock news through a news API, keeping users informed about market trends and events.
- **Transaction History**: Users can view their transaction histories for buying and selling in a detailed table format, including price per share, date, and time.
- **Popular Stocks Section**: A dedicated section displays current popular stocks with clickable links to view their live prices.
- **Leaderboard & Gamification**: Track portfolio performance and foster healthy competition through a leaderboard showcasing top-performing users.
- **User-Friendly Interface**: A responsive and interactive UI built with React, providing a seamless user experience.

---

### Code Structure 

The platform is built using the following technologies:

- **Frontend**: Developed with React for an engaging user interface.
- **Backend**: Node.js with Express for handling user authentication, data processing, and API integrations.
- **Database**: MongoDB stores user profiles, transaction history, and leaderboard data.
- **API**: Integrated with stock market APIs (Alpha Vantage) for real-time market data and news.

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
   cd MicroInvestmentEducationPlatform/backend
3. **Install backend dependencies**:
   ```bash
   npm install
4. **Set up the database and configure environment variables**
5. **Start the backend server**:
   ```bash
   node index.js
6. **In a new terminal, navigate to the frontend directory**:
   ```bash
   cd MicroInvestmentEducationPlatform/client
7. **Install frontend dependencies**:
   ```bash
   npm install
8. **Start the frontend server**:
   ```bash
   npm start

---

### Requirements 
- Node.js (v14 or later)
- MongoDB
- React (v17 or later)
- Stock market API access key (e.g., Alpha Vantage)

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
        "password": "string",
      }
      ```
    - **Response**: The created `User` object with balance, portfolio, and ID.
  
2. **Retrieve All Users**
    - **Endpoint**: `api/user`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves all registered `User` objects
  
    - **Response**: All `User` objects with `id, username, balance`, and `stock portfolio`.

3. **Retrieve a User Portfolio by ID**
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

4. **Create a Transaction**
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
      
5. **Retrieve User Current Balance**
    - **Endpoint**: `/api/user/{id}/balance`
    - **HTTP Method**: `GET`
    - **Description**: Retrieves `User` current balance
    - **Response**:
      ```json
      {
        "balance": "integer"
      }
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
