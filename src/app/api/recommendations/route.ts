import { NextRequest, NextResponse } from 'next/server';
import { UserContext, RecommendationResponse, InnovationTool } from '@/types';
import tools from '@/data/tools.json';
import { openai, usingMockData } from '@/lib/openai';

// API route to generate tool recommendations
export async function POST(request: NextRequest) {
  try {
    const userContext = await request.json() as UserContext;
    
    if (!userContext.goal) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    // Generate recommendations
    let recommendations: RecommendationResponse;
    
    if (openai && !usingMockData) {
      try {
        recommendations = await generateToolRecommendations(userContext, tools as InnovationTool[]);
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        return NextResponse.json(
          { error: 'Failed to generate recommendations. Using mock data as fallback.', usingMockData: true },
          { status: 500 }
        );
      }
    } else {
      console.log('Using mock data for recommendations (OpenAI API not configured)');
      recommendations = generateMockRecommendations(userContext, tools as InnovationTool[]);
    }

    return NextResponse.json({ 
      ...recommendations, 
      usingMockData: !openai || usingMockData
    });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to process recommendation request' },
      { status: 500 }
    );
  }
}

async function generateToolRecommendations(
  userContext: UserContext,
  tools: InnovationTool[]
): Promise<RecommendationResponse> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  // Construct a prompt for the OpenAI API
  const prompt = `
    You are an expert innovation consultant who helps teams select the most appropriate innovation tools for their needs.
    Based on the following user context, recommend the top 3-5 innovation tools from the provided list that would be most suitable.
    
    USER CONTEXT:
    Goal: ${userContext.goal}
    Team Size: ${userContext.teamSize || 'Not specified'}
    Time Available: ${userContext.timeAvailable || 'Not specified'}
    Experience Level: ${userContext.experienceLevel || 'Not specified'}
    Industry: ${userContext.industry || 'Not specified'}
    Budget Constraints: ${userContext.budget || 'Not specified'}
    Additional Context: ${userContext.additionalContext || 'None provided'}
    
    AVAILABLE TOOLS:
    ${tools.map(tool => `
      Name: ${tool.name}
      Description: ${tool.description}
      Category: ${tool.category}
      Difficulty: ${tool.difficulty}
      Time Required: ${tool.timeRequired}
      Team Size: ${tool.teamSize}
      Benefits: ${tool.benefits.join(', ')}
    `).join('\n')}
    
    For each recommended tool, please provide:
    1. A confidence score between 0-100 for how well it matches their needs
    2. Specific reasoning for why this tool is appropriate for their context
    3. Brief implementation guidance tailored to their specific situation
    
    Also provide a summary paragraph of your overall recommendation strategy.
    
    Format your response as valid JSON matching this structure:
    {
      "recommendations": [
        {
          "tool": {FULL_TOOL_OBJECT},
          "score": number,
          "reasoning": "string",
          "implementationGuide": "string"
        }
      ],
      "summary": "string"
    }
  `;

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are an expert innovation consultant who provides tool recommendations in JSON format." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    const result = JSON.parse(content) as RecommendationResponse;
    
    // Additional validation could go here
    return result;
  } catch (error) {
    console.error('Error generating tool recommendations:', error);
    throw error;
  }
}

function generateMockRecommendations(
  userContext: UserContext,
  tools: InnovationTool[]
): RecommendationResponse {
  // Select 3 random tools from the available tools for mock recommendations
  const shuffled = [...tools].sort(() => 0.5 - Math.random());
  const selectedTools = shuffled.slice(0, 3);
  
  const mockRecommendations = {
    recommendations: selectedTools.map((tool, index) => ({
      tool: tool,
      score: 95 - (index * 10), // Mock scores: 95, 85, 75
      reasoning: `[MOCK DATA] ${tool.name} aligns with your goal of "${userContext.goal}" because it ${tool.benefits[0].toLowerCase()} and ${tool.benefits[1].toLowerCase()}.`,
      implementationGuide: `[MOCK DATA] When implementing ${tool.name} for your specific context, focus on these key areas:
        1. Customize the process to address your specific goal
        2. Allocate appropriate time considering your constraints
        3. Prepare your team with necessary background information
        4. Document outcomes and learnings for future reference`
    })),
    summary: `[MOCK DATA] Based on your goal of "${userContext.goal}" and considering your specified constraints, I've recommended tools that provide a balance of structure and flexibility. These recommendations focus on ${selectedTools[0].category.toLowerCase()} and ${selectedTools[1].category.toLowerCase()} approaches that can be implemented with your team size and experience level.

NOTE: These are MOCK RECOMMENDATIONS. To get actual AI-powered recommendations, please configure a valid OpenAI API key in your .env.local file.`,
    usingMockData: true
  };
  
  return mockRecommendations;
} 