# InnoTools Server

Backend server for the InnoTools application, which helps innovation managers discover and utilize appropriate innovation tools.

## Features

- RESTful API for innovation tools catalog
- AI-powered tool recommendations based on user context
- Customized implementation guidance generation
- PDF and Word document generation

## Tech Stack

- Node.js with Express
- TypeScript
- OpenAI API integration
- PDF and Word document generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```
   PORT=5000
   NODE_ENV=development
   OPENAI_API_KEY=your-openai-api-key-here
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm run build
npm start
```

## API Endpoints

### Tools

- `GET /api/tools` - Get all tools (with optional filtering)
- `GET /api/tools/:id` - Get a specific tool by ID

### Recommendations

- `POST /api/recommendations` - Get tool recommendations based on user context

### Documents

- `POST /api/documents/pdf` - Generate a PDF document for a tool
- `POST /api/documents/docx` - Generate a Word document for a tool

## Data Structure

Innovation tools are stored as JSON with the following structure:

```json
{
  "id": "unique-identifier",
  "name": "Tool Name",
  "description": "Brief description of the tool",
  "duration": { "min": 30, "max": 120 },
  "complexity": "low|medium|high",
  "participantCount": { "min": 3, "max": 15 },
  "purpose": ["ideation", "problem-solving", "analysis"],
  "industry": ["all", "tech", "healthcare", "education"],
  "steps": [
    { "order": 1, "title": "Step Title", "description": "Step description" }
  ],
  "materials": ["flipcharts", "sticky notes", "markers"],
  "tips": ["Tip 1", "Tip 2"],
  "references": [
    { "title": "Reference Title", "url": "https://example.com" }
  ]
}
``` 