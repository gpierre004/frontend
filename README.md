# Getting Started with Create React App

# Stock Portfolio Tracker

A full-stack application for tracking stock investments, managing watchlists, and monitoring technical indicators. Built with React, Express, PostgreSQL, and TypeScript.

## Features

- Investment Portfolio Tracking
  - Add, edit, and delete investments
  - Real-time portfolio value updates
  - Performance tracking and analytics

- Watchlist Management
  - Add/remove stocks to watchlist
  - Real-time price updates
  - Technical indicator monitoring

- Technical Analysis
  - Multiple technical indicators (RSI, MACD, EMA, etc.)
  - Custom indicator settings
  - Alert system for technical signals

- Portfolio Optimization
  - Risk analysis
  - Portfolio rebalancing suggestions
  - Historical performance tracking

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git

## Installation

### 1. Clone the Repository
bash
git clone <repository-url>
cd stock-portfolio-tracker


### 2. Backend Setup

bash
cd backend

Install dependencies
npm install

Create .env file
cp .env.example .env

Update .env with your configurations
Edit the following variables:
PORT=5000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stock_portfolio
JWT_SECRET=your_jwt_secret_key
YAHOO_FINANCE_API_KEY=your_api_key

### 3. Frontend Setup

bash
cd ../frontend

Install dependencies
npm install


### 4. Database Setup

bash

Connect to PostgreSQL
psql -U your_postgres_username

Create database
CREATE DATABASE stock_portfolio;

Connect to the new database
\c stock_portfolio

Run the schema.sql script from the backend/src/db/schema.sql file
## Running the Application

### Development Mode

1. Start the Backend:
bash
cd backend
npm run dev


2. Start the Frontend (in a new terminal):
bash
cd frontend
npm start


The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Build

1. Build the Backend:
bash
cd backend
npm run build


2. Build the Frontend:
bash
cd frontend
npm run build


## Project Structure

stock-portfolio-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── models/         # Data models
│   │   ├── db/            # Database configuration
│   │   └── server.ts      # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── frontend/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   ├── store/         # Redux store
│   ├── hooks/         # Custom hooks
│   └── App.tsx        # Root component
└── package.json


## API Documentation

### Authentication Endpoints

POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password


### Portfolio Endpoints

GET /api/portfolio/:id
POST /api/portfolio/investments
PUT /api/portfolio/investments/:id
DELETE /api/portfolio/investments/:id


### Watchlist Endpoints

GET /api/watchlist
POST /api/watchlist
DELETE /api/watchlist/:symbol


### Technical Analysis Endpoints

GET /api/technical/:symbol
POST /api/technical/alerts
GET /api/technical/alerts


## Environment Variables

### Backend (.env)

PORT=5000
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stock_portfolio
JWT_SECRET=your_jwt_secret_key
YAHOO_FINANCE_API_KEY=your_api_key


### Frontend (.env)

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000


## Common Issues and Solutions

1. Database Connection Issues
   - Verify PostgreSQL is running
   - Check database credentials in .env
   - Ensure database exists and schema is properly loaded

2. API Connection Issues
   - Check if backend server is running
   - Verify proxy settings in frontend package.json
   - Check CORS configuration in backend

3. TypeScript Errors
   - Run `npm run build` to check for compilation errors
   - Verify tsconfig.json settings
   - Check type definitions in node_modules/@types

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Yahoo Finance API for real-time stock data
- Material-UI for the component library
- Recharts for chart visualization