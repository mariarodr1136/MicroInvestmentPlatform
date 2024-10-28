# Micro-Investment Education Platform

The Micro-Investment Education Platform is an innovative educational app crafted to empower beginners in the world of investing. By simulating micro-investments within a risk-free environment using virtual money, this platform allows users to explore various investment strategies and gain insights into market dynamics without the fear of losing real funds. Our goal is to instill the knowledge and confidence necessary for users to navigate the complexities of investing, enabling them to understand market trends, evaluate risks, and appreciate the potential rewards of their investment decisions in a safe and engaging manner. 📈

<img width="1443" alt="Screenshot 2024-10-28 at 11 51 56 AM" src="https://github.com/user-attachments/assets/f01a5d4f-a0f9-404b-b457-58c608d5b168">


## Table of Contents
- [Features](#features)
- [Code Structure](#code-structure)
- [Installation](#installation)
- [Requirements](#requirements)
- [Using Postman](#using-postman)
- [Contributing](#contributing)
- [Contact](#contact)

## Features ✏️

- **Virtual Money Management**: Each user receives a set amount of virtual currency to simulate real-world investing.
- **Real-Time Market Data**: Users can access up-to-date stock prices and market conditions through integrated stock market APIs.
- **Leaderboard & Gamification**: Track portfolio performance and foster healthy competition through a leaderboard showcasing top-performing users.
- **User-Friendly Interface**: A responsive and interactive UI built with React, providing a seamless user experience.

## Code Structure 🔌

The platform is built using the following technologies:

- **Frontend**: Developed with React for an engaging user interface.
- **Backend**: Node.js with Express for handling user authentication, data processing, and API integrations.
- **Database**: MongoDB for storing user profiles, transaction history, and leaderboard data.
- **API**: Integrated with stock market APIs (Alpha Vantage) for real-time market data.

## Installation 💻

1. Clone the repository:
   ```bash
   gh repo clone mariarodr1136/MicroInvestmentPlatform
- Alternatively, if you prefer to use HTTPS:
   ```bash
   https://github.com/mariarodr1136/MicroInvestmentPlatform.git

2. Navigate to the backend directory:
   ```bash
   cd MicroInvestmentEducationPlatform/backend
3. Install backend dependencies:
   ```bash
   npm install
4. Set up the database and configure environment variables.
5. Start the backend server:
   ```bash
   node index.js
6. In a new terminal, navigate to the frontend directory:
   ```bash
   cd MicroInvestmentEducationPlatform/client
7. Install frontend dependencies:
   ```bash
   npm install
8. Start the frontend server:
   ```bash
   npm start

## Requirements 📌
- Node.js (v14 or later)
- MongoDB
- React (v17 or later)
- Stock market API access key (e.g., Alpha Vantage)

## Fixing the URL in Your Frontend
Once you have a user ID, update your App.js to view data in frontend:

- const userId = '60d21b4667d0d8992e610c85'

## Using Postman 📫

You can use Postman to interact with the API and perform various actions. Below are some common operations:

<p align="center">
 - Add Stocks & Register a New User -
</p>

![IMG_9185](https://github.com/user-attachments/assets/33676fe3-f19a-4fb0-b4f3-16462332fc61)

<p align="center">
- Fetch Current Balance & Portfolio -
</p>

![IMG_9184](https://github.com/user-attachments/assets/492e2dfd-f01d-44eb-acab-fa77363149f4)

## Contributing 📖
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

## Contact 🌐
If you have any questions or feedback, feel free to reach out at [mrodr.contact@gmail.com](mailto:mrodr.contact@gmail.com).
