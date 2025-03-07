const fs = require('fs');

// Read the current .env file
const envContent = fs.readFileSync('.env', 'utf8');

// Fix the API key by removing any newlines
const lines = envContent.split('\n');
let fixedContent = '';
let apiKeyLine = '';

for (const line of lines) {
  if (line.startsWith('OPENAI_API_KEY=')) {
    apiKeyLine = line;
  } else if (apiKeyLine && !line.startsWith('PORT=') && !line.startsWith('NODE_ENV=')) {
    apiKeyLine += line;
  } else {
    if (apiKeyLine) {
      fixedContent += apiKeyLine + '\n';
      apiKeyLine = '';
    }
    fixedContent += line + '\n';
  }
}

if (apiKeyLine) {
  fixedContent += apiKeyLine;
}

// Write the fixed content back to .env
fs.writeFileSync('.env', fixedContent);
console.log('Fixed .env file by joining any split API key lines.'); 