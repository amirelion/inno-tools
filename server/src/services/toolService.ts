import fs from 'fs';
import path from 'path';
import { InnovationTool } from '../types/tool';

// Path to tool data JSON files
const TOOLS_DIR = path.join(__dirname, '../data/tools');

/**
 * Get all tools with optional filtering
 */
export const getTools = async (filters: any): Promise<InnovationTool[]> => {
  try {
    // For now, we'll read from a JSON file - in production this would be a database
    const toolsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/tools.json'), 'utf8'));
    
    // Apply filters if provided
    let filteredTools = [...toolsData];
    
    if (filters) {
      // Filter by purpose
      if (filters.purpose) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.purpose.some((p: string) => p.toLowerCase() === filters.purpose.toLowerCase())
        );
      }
      
      // Filter by complexity
      if (filters.complexity) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.complexity.toLowerCase() === filters.complexity.toLowerCase()
        );
      }
      
      // Filter by duration max
      if (filters.durationMax) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.duration.max <= parseInt(filters.durationMax)
        );
      }
      
      // Filter by minimum participants
      if (filters.participantsMin) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.participantCount.min <= parseInt(filters.participantsMin)
        );
      }
      
      // Filter by maximum participants
      if (filters.participantsMax) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.participantCount.max >= parseInt(filters.participantsMax)
        );
      }
      
      // Filter by industry
      if (filters.industry) {
        filteredTools = filteredTools.filter((tool: InnovationTool) => 
          tool.industry.includes('all') || tool.industry.includes(filters.industry.toLowerCase())
        );
      }
    }
    
    return filteredTools;
  } catch (error) {
    console.error('Error reading tools data:', error);
    
    // Create base directory structure and return empty array if data file doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await ensureDataDirectories();
      return [];
    }
    
    throw error;
  }
};

/**
 * Get a specific tool by ID
 */
export const getToolData = async (id: string): Promise<InnovationTool | null> => {
  try {
    const tools = await getTools({});
    const tool = tools.find((t: InnovationTool) => t.id === id);
    return tool || null;
  } catch (error) {
    console.error(`Error fetching tool with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Ensure data directories exist
 */
export const ensureDataDirectories = async (): Promise<void> => {
  const dataDir = path.join(__dirname, '../data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Create sample tools.json if it doesn't exist
  const toolsJsonPath = path.join(dataDir, 'tools.json');
  if (!fs.existsSync(toolsJsonPath)) {
    const sampleTools = [
      {
        "id": "scamper",
        "name": "SCAMPER",
        "description": "A creative thinking technique that uses a set of directed questions to help generate new ideas or improve existing ones.",
        "duration": { "min": 30, "max": 60 },
        "complexity": "medium",
        "participantCount": { "min": 1, "max": 15 },
        "purpose": ["ideation", "problem-solving"],
        "industry": ["all"],
        "steps": [
          { "order": 1, "title": "Select subject", "description": "Choose a product, service or process to improve" },
          { "order": 2, "title": "Apply SCAMPER questions", "description": "Use each letter of SCAMPER as a prompt for brainstorming" },
          { "order": 3, "title": "Record ideas", "description": "Document all ideas generated" },
          { "order": 4, "title": "Evaluate and refine", "description": "Review, combine and improve promising ideas" }
        ],
        "materials": ["sticky notes", "markers", "whiteboard"],
        "tips": [
          "Encourage wild ideas during the process",
          "Focus on quantity over quality initially",
          "Avoid criticism during ideation phase"
        ],
        "references": [
          { "title": "SCAMPER Technique", "url": "https://www.mindtools.com/pages/article/newCT_02.htm" }
        ]
      },
      {
        "id": "customer-journey-map",
        "name": "Customer Journey Mapping",
        "description": "A visualization technique that maps out the story of a customer's experience with your product or service across all touchpoints.",
        "duration": { "min": 120, "max": 240 },
        "complexity": "high",
        "participantCount": { "min": 3, "max": 10 },
        "purpose": ["analysis", "customer-understanding"],
        "industry": ["all", "retail", "service"],
        "steps": [
          { "order": 1, "title": "Define scope and personas", "description": "Identify which customer journey to map and create relevant personas" },
          { "order": 2, "title": "List touchpoints", "description": "Identify all interactions between customer and organization" },
          { "order": 3, "title": "Map current journey", "description": "Plot the current journey with actions, emotions, and pain points" },
          { "order": 4, "title": "Analyze and identify opportunities", "description": "Look for pain points and areas for improvement" },
          { "order": 5, "title": "Design improved journey", "description": "Create an improved future state customer journey" }
        ],
        "materials": ["large paper sheets", "sticky notes", "markers", "persona templates"],
        "tips": [
          "Use real customer data when possible",
          "Include customer emotions at each stage",
          "Involve cross-functional team members"
        ],
        "references": [
          { "title": "How to Create a Customer Journey Map", "url": "https://www.nngroup.com/articles/customer-journey-mapping/" }
        ]
      }
    ];
    
    fs.writeFileSync(toolsJsonPath, JSON.stringify(sampleTools, null, 2), 'utf8');
  }
}; 