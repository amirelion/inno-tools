#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting Next.js build for Vercel deployment..."
npm run build
echo "Next.js build completed"

# Check if this is a genuine client directory with our components
if [ -d "client/src/components" ] && [ -f "client/src/components/ToolList.tsx" ]; then
  echo "Found proper client code - skipping fallback creation"
else
  echo "Client directory components not found, creating a minimal React app..."
  
  # Create a minimal client directory
  mkdir -p client/public client/src/components
  
  # Create package.json with build script
  cat > client/package.json << 'EOF'
{
  "name": "inno-tools-client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
EOF
  
  # Create index.html
  cat > client/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>InnoTools</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

  # Create minimal React app
  cat > client/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <h1>InnoTools API Server</h1>
      <p>The API is running. Access it at <code>/api</code> endpoints.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><a href="/api">/api</a> - API status</li>
        <li><a href="/api/tools">/api/tools</a> - List of tools</li>
        <li><a href="/api/recommendations">/api/recommendations</a> - Get recommendations</li>
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOF
  
  echo "Minimal client directory created"
fi

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
mkdir -p api/dist
cp -r server/dist/* api/dist/
cp server/package.json api/package.json

# Install API dependencies for serverless function
echo "Installing API dependencies..."
cd api
npm install --only=production
cd ..

# Build the frontend
echo "Building the frontend client..."
cd client
echo "Current client directory contents:"
ls -la
echo "Components directory contents:"
ls -la src/components || echo "No components directory found"
npm install
npm run build
cd ..

# Make sure client/build exists
if [ ! -d "client/build" ]; then
  echo "Error: client/build directory not found!"
  exit 1
fi

echo "Build completed successfully!" 