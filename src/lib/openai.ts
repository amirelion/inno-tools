import OpenAI from 'openai';

// Initialize OpenAI client with a fallback for development
let openai: OpenAI | null = null;
let usingMockData = false;

try {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  if (apiKey === 'your_api_key_here' || apiKey === 'your_actual_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY contains the placeholder value from .env.example');
  }
  
  openai = new OpenAI({
    apiKey: apiKey,
  });
  console.log("OpenAI client initialized successfully!");
  usingMockData = false;
} catch (error) {
  console.warn('⚠️ OpenAI API configuration error. Using mock data for development.');
  console.error('Error details:', error);
  openai = null;
  usingMockData = true;
}

export { openai, usingMockData }; 