# Deployment Guide - Render.com

This guide will help you deploy the Micro-Investment Education Platform as a live demo on Render.com (free tier).

## Prerequisites
- A GitHub account with this repository
- A Render account (sign up at https://render.com)
- API keys for Alpha Vantage and NewsAPI

## Deployment Steps

### 1. Prepare Your Repository
Make sure all changes are committed and pushed to GitHub:
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### 2. Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `mariarodr1136/MicroInvestmentPlatform`
4. Configure the service:
   - **Name**: `microinvestment-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free
5. Add Environment Variables:
   - `PORT` = `5001`
   - `REACT_APP_STOCK_API_KEY` = `your_alpha_vantage_api_key`
   - `NODE_ENV` = `production`
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. **Copy the backend URL** (e.g., `https://microinvestment-backend.onrender.com`)

### 3. Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the site:
   - **Name**: `microinvestment-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `YOUR_BACKEND_URL` (from step 2.8)
   - `REACT_APP_STOCK_API_KEY` = `your_alpha_vantage_api_key`
5. Click **"Create Static Site"**
6. Wait for deployment
7. Your live demo will be available at the provided URL!

## Testing Your Live Demo

Visit your frontend URL and:
- Register a new account or login with demo credentials
- Test buying and selling stocks
- View the leaderboard
- Check your transaction history

## Important Notes

- **Free Tier Limitations**:
  - Backend services sleep after 15 minutes of inactivity
  - First request may take 30-50 seconds to wake up
  - 750 hours/month of runtime (sufficient for demos)

- **Database**: The app uses MongoDB Memory Server by default
  - Data resets when the backend restarts
  - For persistent data, configure MongoDB Atlas in environment variables

- **API Rate Limits**:
  - Alpha Vantage free tier: 5 API requests per minute, 500/day
  - NewsAPI free tier: 100 requests/day

## Troubleshooting

If you encounter CORS errors:
- Make sure the backend URL in frontend env variables doesn't have a trailing slash
- Check that both services are deployed and running

If stock data doesn't load:
- Verify API keys are correctly set in environment variables
- Check API rate limits haven't been exceeded

## Alternative: One-Click Deploy with render.yaml

You can also deploy using the included `render.yaml` file:
1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and deploy both services

## Updating Your Deployment

Render auto-deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both services will automatically redeploy within a few minutes.

---

Need help? Check the [Render documentation](https://render.com/docs) or open an issue on GitHub.
