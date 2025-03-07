#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting build process for Vercel deployment..."

# Build the API
echo "Building the backend API..."
cd server
npm install
npm run build
cd ..

# Copy tools.json to the API directory
echo "Setting up API functions..."
mkdir -p api/data
cp server/src/data/tools.json api/data/

# Copy any other necessary API files
mkdir -p api
cp -r server/dist api/dist
cp server/package.json api/package.json

# Build the frontend
echo "Building the frontend client..."
cd client
npm install
npm run build
cd ..

# Make sure client/build exists
if [ ! -d "client/build" ]; then
  echo "Error: client/build directory not found!"
  exit 1
fi

echo "Build completed successfully!" 