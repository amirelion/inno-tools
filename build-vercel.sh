#!/bin/bash

# Build server first
echo "Building server..."
cd server
npm install
npm run build
cd ..

# Copy data files to api directory
echo "Copying data files..."
mkdir -p api/data
cp server/src/data/tools.json api/data/

# Build client
echo "Building client..."
cd client
npm install
npm run build
cd ..

echo "Build completed successfully." 