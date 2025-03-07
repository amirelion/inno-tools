# InnoTools - Innovation Tools Recommendation Application

InnoTools is a web application that helps innovation managers, practitioners, and facilitators discover and utilize the right innovation tools for their specific needs. The application leverages AI to provide personalized recommendations and guidance on implementing innovation methodologies.

## Features

- **Tool Catalog**: Browse and filter a collection of innovation tools and methodologies
- **AI-Powered Recommendations**: Get personalized tool suggestions based on your context
- **Detailed Tool Information**: View comprehensive information about each tool
- **Customized Implementation Guidance**: Receive AI-generated guidance tailored to your specific situation
- **Document Generation**: Download PDF or Word documents with customized instructions

## Project Structure

The project consists of two main parts:

- **Client**: React frontend application
- **Server**: Node.js backend API

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for components
- React Router for navigation
- React Hook Form for form handling
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- OpenAI API integration
- PDF and Word document generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

### Installation and Setup

1. Clone the repository
2. Set up the backend:
   ```
   cd server
   npm install
   cp .env.example .env
   ```
   Edit the `.env` file to add your OpenAI API key.

3. Set up the frontend:
   ```
   cd client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Browsing Tools

Navigate to the "Browse Tools" section to see all available innovation tools. Use the filters to narrow down the tools based on:
- Complexity
- Duration
- Participant count
- Purpose
- Industry

### Getting Recommendations

1. Go to the "Get Recommendations" section
2. Follow the multi-step form to provide information about:
   - Your goal/purpose
   - Available time
   - Participant information
   - Context (industry, problem domain)
3. View the recommended tools with confidence scores and justifications

### Viewing Tool Details

Click on any tool to view detailed information, including:
- Description
- Implementation steps
- Materials needed
- Tips and best practices
- References

### Generating Documents

From the tool detail page:
1. Fill in the implementation guidance form with your specific context
2. Click "Generate PDF" or "Generate Word Doc"
3. Download and save the customized document

## License

[MIT License](LICENSE)

## Acknowledgements

- OpenAI for providing the AI capabilities
- Material UI for the component library
- All the innovation methodologies included in the tool catalog 