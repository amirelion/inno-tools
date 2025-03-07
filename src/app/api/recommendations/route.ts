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
    Time Available: ${userContext.timeAvailable || 'Not specified'} (This is the time they can spend on the activity in minutes)
    Experience Level: ${userContext.experienceLevel || 'Not specified'}
    Industry: ${userContext.industry || 'Not specified'}
    Additional Context: ${userContext.additionalContext || 'None provided'}
    
    IMPORTANT: The user has specified time in minutes, so make sure your recommended tools can realistically be completed within their available time of ${userContext.timeAvailable || 'the unspecified time'}.
    
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
    
    FORMAT INSTRUCTIONS:
    - Use markdown formatting for the summary and implementation guidance
    - Use **bold** for emphasis on important points
    - Use bullet points where appropriate
    
    Format your response as valid JSON matching this structure:
    {
      "recommendations": [
        {
          "tool": {FULL_TOOL_OBJECT},
          "score": number,
          "reasoning": "string with markdown formatting",
          "implementationGuide": "string with markdown formatting"
        }
      ],
      "summary": "string with markdown formatting"
    }
  `;

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: "system", 
          content: "You are an expert innovation consultant who provides tool recommendations in JSON format. Use markdown formatting with bold text and lists in your content." 
        },
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
      reasoning: `[MOCK DATA] ${tool.name} aligns with your goal of "${userContext.goal}" because it ${tool.benefits[0].toLowerCase()} and ${tool.benefits[1].toLowerCase()}.

**Key Strengths:**
* Perfect match for your experience level
* Designed for teams of your size
* Can be completed within your available time of ${userContext.timeAvailable || 'any timeframe'}

The **${tool.category}** approach of this tool makes it particularly effective for your context because it focuses on structured problem-solving and collaborative engagement.`,
      implementationGuide: `[MOCK DATA] When implementing ${tool.name} for your specific context, focus on these key areas:

### 1. Customize the Process (5-10 minutes)
Adapt the standard approach to address your specific goal:
* **Prioritize activities** that directly relate to "${userContext.goal}"
* Modify templates to fit your industry context
* Adjust the depth of analysis based on your time constraints of ${userContext.timeAvailable || 'the available time'}

### 2. Team Preparation (5-10 minutes)
* Ensure everyone understands the purpose and expected outcomes
* Assign clear roles and responsibilities
* Provide any necessary background materials in advance

### 3. Follow-up Activities (5 minutes)
Document all insights and create an **action plan** for implementing the findings.`
    })),
    summary: `[MOCK DATA] Based on your goal of "${userContext.goal}" and considering your specified constraints, I've recommended tools that provide a balance of structure and flexibility. These recommendations focus on ${selectedTools[0].category.toLowerCase()} and ${selectedTools[1].category.toLowerCase()} approaches that can be implemented within your timeframe of ${userContext.timeAvailable || 'any duration'}.

**Why these recommendations work for you:**
* They align with your available time of ${userContext.timeAvailable || 'any duration'}
* They're appropriate for ${userContext.experienceLevel || 'your experience level'}
* They address your specific industry challenges in ${userContext.industry || 'your industry'}

To get the most from these tools, I suggest starting with ${selectedTools[0].name} to establish a foundation, then moving to the others as needed.

NOTE: These are MOCK RECOMMENDATIONS. To get actual AI-powered recommendations, please configure a valid OpenAI API key in your .env.local file.`,
    usingMockData: true
  };
  
  return mockRecommendations;
} 