# Deploying to Vercel

This guide covers deploying the full InnoTools application (frontend + backend) to Vercel.

## Pre-requisites

1. [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) (optional, for local testing)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository has the correct structure. The client directory should NOT contain a separate `.git` directory (run `rm -rf client/.git` if needed).

### 2. Connect Vercel to your GitHub repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." -> "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: Leave empty (we use vercel.json configuration)
   - Output Directory: Leave empty (we use vercel.json configuration)

### 3. Configure Environment Variables

In the Vercel project settings (Settings > Environment Variables), add the following:

- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Set to "production"
- `PORT`: Set to "5001" (or your preferred port)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## How it Works

This deployment approach combines both frontend and backend in a single deployment:

1. Frontend (React app):
   - Built and served from `client/build`
   - Static assets are served directly by Vercel
   - Client-side routing handled by React Router

2. Backend (Node.js API):
   - API endpoints are handled via serverless functions in the `/api` directory
   - Each API request triggers the serverless function
   - Data files are copied to the correct locations during build

## Configuration Files

The repository contains several configuration files for Vercel deployment:

- `vercel.json`: Main configuration file that defines build settings, output directory, and API routes
- `build-vercel.sh`: Custom build script that builds both server and client components
- `.nvmrc`: Defines the Node.js version to use for deployment

## Troubleshooting

### API Routes Not Working

Make sure:
- The `vercel.json` file is properly configured with the right rewrites
- Your API functions in the `/api` directory are correctly implemented
- Environment variables are set correctly

### Build Issues

If your build fails, check the Vercel build logs. Common issues include:
- Missing dependencies
- Environment variables not set
- File paths not resolving correctly
- Permission issues with build script (needs to be executable)

### Data Files Missing

If the tools data is not available, check if `api/data/tools.json` exists and is properly copied during build.

## Local Testing

To test your Vercel deployment locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel dev` from the project root

## Important Notes

- The API routes use serverless functions, which have limitations:
  - Max execution time: 10 seconds for hobby accounts (can be increased on paid plans)
  - Memory limits: 1024MB by default (configured in vercel.json)
  - Cold starts can occur after periods of inactivity
- All client-side routes will return the index.html file (configured in vercel.json rewrites) 