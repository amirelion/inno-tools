import { OpenAI } from 'openai';
import { InnovationTool, UserContext, ToolRecommendation, ImplementationGuidance } from '../types/tool';

// Initialize OpenAI client with a fallback for development
let openai: OpenAI | null = null;
try {
  // Use the API key from environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  openai = new OpenAI({
    apiKey: apiKey,
  });
  console.log("OpenAI client initialized successfully!");
} catch (error) {
  console.warn('OpenAI API key is missing or invalid. Using mock data for development.');
  console.error('Error details:', error);
  openai = null;
}

/**
 * Generate tool recommendations based on user context
 */
export const generateToolRecommendations = async (
  userContext: UserContext,
  tools: InnovationTool[]
): Promise<ToolRecommendation[]> => {
  try {
    // If OpenAI client is not available, return mock data
    if (!openai) {
      console.log('Using mock recommendation data (OpenAI API key not configured)');
      return getMockRecommendations(userContext, tools);
    }

    const prompt = `
      You are an innovation methodology expert that helps users select the right innovation tools for their context.
      
      Given the following user context:
      ${JSON.stringify(userContext, null, 2)}
      
      And the following available innovation tools:
      ${JSON.stringify(tools, null, 2)}
      
      Please recommend up to 3 tools that would be most appropriate for this user's needs.
      For each tool, provide:
      1. The tool ID
      2. The tool name
      3. A confidence score (0-100)
      4. A brief justification for why this tool is appropriate
      
      Format your response as a valid JSON array of objects with the properties: toolId, toolName, confidenceScore, and justification.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an innovation methodology expert that helps users select and implement the right innovation tools for their context." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content || '{"recommendations": []}';
    const parsedResponse = JSON.parse(content);
    
    // Extract and return the recommendations
    return parsedResponse.recommendations || [];
  } catch (error) {
    console.error('Error generating recommendations with OpenAI:', error);
    
    // Return mock data on error
    return getMockRecommendations(userContext, tools);
  }
};

/**
 * Generate customized implementation guidance for a tool based on user context
 */
export const generateImplementationGuidance = async (
  tool: InnovationTool,
  userContext: UserContext
): Promise<ImplementationGuidance> => {
  try {
    // If OpenAI client is not available, return mock data
    if (!openai) {
      console.log('Using mock guidance data (OpenAI API key not configured)');
      return getMockImplementationGuidance(tool, userContext);
    }

    const prompt = `
      You are an innovation methodology expert that helps users implement innovation tools effectively.
      
      Given the following innovation tool:
      ${JSON.stringify(tool, null, 2)}
      
      And the following user context:
      ${JSON.stringify(userContext, null, 2)}
      
      Please provide customized implementation guidance for this tool, including:
      1. An overview of how to adapt this tool to the user's specific context
      2. A list of context-specific adaptations
      3. Recommended time allocation for preparation, execution, and debrief
      4. Additional tips specific to the user's context
      
      Format your response as a valid JSON object with the properties: overview, contextSpecificAdaptations (array), recommendedTimeAllocation (object with preparation, execution, debrief in minutes), and additionalTips (array).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an innovation methodology expert that helps users select and implement the right innovation tools for their context." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const content = response.choices[0].message.content || '{}';
    const guidance = JSON.parse(content);
    
    return {
      overview: guidance.overview || '',
      contextSpecificAdaptations: guidance.contextSpecificAdaptations || [],
      recommendedTimeAllocation: guidance.recommendedTimeAllocation || {
        preparation: 0,
        execution: 0,
        debrief: 0
      },
      additionalTips: guidance.additionalTips || []
    };
  } catch (error) {
    console.error('Error generating implementation guidance with OpenAI:', error);
    
    // Return mock data on error
    return getMockImplementationGuidance(tool, userContext);
  }
};

/**
 * Generate mock recommendations for development without OpenAI
 */
function getMockRecommendations(userContext: UserContext, tools: InnovationTool[]): ToolRecommendation[] {
  // Get up to 3 tools from the available tools
  const recommendedTools = tools.slice(0, 3);
  
  // Create mock recommendations
  return recommendedTools.map((tool, index) => ({
    toolId: tool.id,
    toolName: tool.name,
    confidenceScore: 95 - (index * 10), // First tool has 95%, second 85%, third 75%
    justification: `Mock justification for ${tool.name}. This is generated because no OpenAI API key was provided. This tool would be suitable for ${userContext.goal || 'your goal'}.`
  }));
}

/**
 * Generate mock implementation guidance for development without OpenAI
 */
function getMockImplementationGuidance(tool: InnovationTool, userContext: UserContext): ImplementationGuidance {
  return {
    overview: `This is a mock overview for implementing ${tool.name} in the context of ${userContext.goal || 'your goal'}. In a real application, this would be generated by OpenAI based on your specific requirements.`,
    contextSpecificAdaptations: [
      `Mock adaptation 1 for ${tool.name}`,
      `Mock adaptation 2 for ${tool.name}`,
      `Mock adaptation 3 for ${tool.name}`
    ],
    recommendedTimeAllocation: {
      preparation: tool.duration.min * 0.3,
      execution: tool.duration.min * 0.5,
      debrief: tool.duration.min * 0.2
    },
    additionalTips: [
      `Mock tip 1 for ${tool.name}`,
      `Mock tip 2 for ${tool.name}`,
      `Mock tip 3 for ${tool.name}`
    ]
  };
} 