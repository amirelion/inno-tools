# Deploying to Vercel

This guide covers deploying the InnoTools application to Vercel.

## Pre-requisites

1. [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) (optional, for local testing)

## Deployment Steps

### 1. Push your code to GitHub

Make sure your code is in a GitHub repository.

### 2. Connect Vercel to your GitHub repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." -> "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: ./build-vercel.sh
   - Output Directory: client/build

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"
- Any other environment variables your application needs

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting

### API Routes Not Working

Make sure the `vercel.json` file is properly configured with the right rewrites and functions settings.

### Build Issues

If your build fails, check the Vercel build logs. Common issues include:
- Missing dependencies
- Environment variables not set
- File paths not resolving correctly

## Local Testing

To test your Vercel deployment locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` from the project root

## Important Notes

- The API routes use serverless functions, which have limitations:
  - Max execution time: 10 seconds for hobby accounts
  - Memory limits based on your plan
- The client is configured to use relative API paths in production
- Database connections should be optimized for serverless architecture 