# Render Deployment Instructions

This file contains instructions for deploying this branch to Render.com.

## Steps to Deploy

1. Log in to your Render.com account
2. Go to the Dashboard and click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Select the branch "upgrade-version-2.2.3.3"
6. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
7. Set environment variables:
   - `NEXT_PUBLIC_COINMARKETCAP_API_KEY`: Your CoinMarketCap API key
   - `NEXT_PUBLIC_ORDISCAN_API_KEY`: Your Ordiscan API key
   - `NEXT_PUBLIC_RAPID_API_KEY`: Your Rapid API key
8. Click "Create Web Service"

## Troubleshooting

If the branch doesn't appear in the branch selection dropdown:
1. Make sure the branch has been pushed to GitHub
2. Try refreshing the page
3. Click on "Update Branch List" in the Render dashboard
4. Check GitHub permissions for Render

## Support

If you encounter any issues, please contact the repository maintainer or Render support.
