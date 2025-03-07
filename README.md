# InnoTools - Innovation Tools Recommendation Platform

InnoTools is a web application that helps teams and organizations find the right innovation tools and methodologies for their specific needs. The platform provides a curated catalog of innovation tools, personalized recommendations based on project context, and detailed implementation guidance.

## Features

- **Tool Catalog**: Browse a curated collection of innovation tools and methodologies
- **Personalized Recommendations**: Get tool recommendations based on your project's specific context
- **Implementation Guidance**: Receive detailed, context-specific guidance on how to implement recommended tools
- **Export Functionality**: Export recommendations and implementation guides as PDF documents

## Tech Stack

- **Frontend**: Next.js, React, Material UI
- **Backend**: Next.js API Routes (serverless)
- **AI Integration**: OpenAI API for generating personalized recommendations and implementation guidance
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inno-tools.git
   cd inno-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The application is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy

## Project Structure

```
/inno-tools/
  /src
    /app             # Next.js app directory
      /api           # API routes (serverless functions)
      /tools         # Tool catalog and details pages
      /recommendations # Recommendation pages
    /components      # Reusable UI components
    /hooks           # Custom React hooks
    /lib             # Shared utilities
      /openai.ts     # OpenAI client setup
    /data            # Static data files
      /tools.json    # Innovation tool definitions
    /types           # TypeScript type definitions
    /styles          # CSS or styled-component styles
  /public            # Static assets
  next.config.js     # Next.js configuration
  tsconfig.json      # TypeScript configuration
  .env.local         # Local environment variables (not committed)
  .env.example       # Example environment variables (committed)
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- The innovation community for the methodologies and tools featured in the application 