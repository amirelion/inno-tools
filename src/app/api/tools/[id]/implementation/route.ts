import { NextRequest, NextResponse } from 'next/server';
import { InnovationTool, UserContext, ImplementationResponse } from '@/types';
import tools from '@/data/tools.json';
import { openai, usingMockData } from '@/lib/openai';

// API route to generate implementation guidance for a specific tool
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the tool by ID
    const tool = (tools as InnovationTool[]).find(t => t.id === params.id);
    
    if (!tool) {
      return NextResponse.json(
        { error: `Tool with ID ${params.id} not found` },
        { status: 404 }
      );
    }
    
    // Get user context from request body
    const userContext = await request.json() as UserContext;
    
    if (!userContext.goal) {
      return NextResponse.json(
        { error: 'Goal is required in the user context' },
        { status: 400 }
      );
    }
    
    // Generate implementation guidance
    let implementationGuidance: ImplementationResponse;
    
    if (openai && !usingMockData) {
      try {
        implementationGuidance = await generateImplementationGuidance(tool, userContext);
      } catch (error) {
        console.error('Error calling OpenAI:', error);
        return NextResponse.json(
          { error: 'Failed to generate implementation guidance. Using mock data as fallback.', usingMockData: true },
          { status: 500 }
        );
      }
    } else {
      console.log('Using mock data for implementation guidance (OpenAI API not configured)');
      implementationGuidance = generateMockImplementation(tool, userContext);
    }
    
    return NextResponse.json({
      ...implementationGuidance,
      usingMockData: !openai || usingMockData
    });
  } catch (error) {
    console.error('Error in implementation guidance API:', error);
    return NextResponse.json(
      { error: 'Failed to process implementation guidance request' },
      { status: 500 }
    );
  }
}

async function generateImplementationGuidance(
  tool: InnovationTool,
  userContext: UserContext
): Promise<ImplementationResponse> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  // Construct a prompt for the OpenAI API
  const prompt = `
    You are an expert innovation consultant who helps teams implement innovation methodologies effectively.
    I need detailed implementation guidance for using the "${tool.name}" innovation tool in the following context:
    
    USER CONTEXT:
    Goal: ${userContext.goal}
    Team Size: ${userContext.teamSize || 'Not specified'}
    Time Available: ${userContext.timeAvailable || 'Not specified'} (This is the time they can spend on the activity in minutes)
    Experience Level: ${userContext.experienceLevel || 'Not specified'}
    Industry: ${userContext.industry || 'Not specified'}
    Additional Context: ${userContext.additionalContext || 'None provided'}
    
    TOOL INFORMATION:
    Name: ${tool.name}
    Description: ${tool.description}
    Category: ${tool.category}
    Standard Steps: ${tool.steps.join('\n')}
    Standard Materials: ${tool.materials.join(', ')}
    Difficulty: ${tool.difficulty}
    Standard Time Required: ${tool.timeRequired}
    Standard Team Size: ${tool.teamSize}
    Tips: ${tool.tips.join('\n')}
    
    Please provide:
    1. A comprehensive implementation guide tailored to their specific context and goal
    2. A list of customized steps for their particular situation
    3. A list of specific materials they will need
    4. A timeline broken down by phases that accounts for their time constraints in minutes
    5. A list of expected outcomes they can anticipate
    
    IMPORTANT: The user has specified time in minutes, so make sure your implementation guidance and timeline fit within their available time of ${userContext.timeAvailable || 'the unspecified time'}.
    
    FORMAT INSTRUCTIONS:
    - Use markdown formatting for the implementation guide
    - Use headings (##, ###) to structure the content
    - Use **bold** for emphasis on important points
    - Use bullet points and numbered lists where appropriate
    - Include clear section breaks
    
    Format your response as valid JSON matching this structure:
    {
      "guide": "Comprehensive implementation guidance as string with markdown formatting",
      "customSteps": ["Step 1", "Step 2", "Step 3", ...],
      "materials": ["Material 1", "Material 2", "Material 3", ...],
      "timeline": "Detailed timeline as string with markdown formatting",
      "expectedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3", ...]
    }
  `;

  try {
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: "system", 
          content: "You are an expert innovation consultant who provides detailed implementation guidance in JSON format. Use markdown formatting with headings, bold text, and lists in your guidance content." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    const guidance = JSON.parse(content) as ImplementationResponse;
    
    // Additional validation could go here
    return guidance;
  } catch (error) {
    console.error('Error generating implementation guidance:', error);
    throw error;
  }
}

function generateMockImplementation(
  tool: InnovationTool,
  userContext: UserContext
): ImplementationResponse {
  return {
    guide: `[MOCK DATA] # Implementation Guide for ${tool.name}

## Customized for: ${userContext.goal}

This implementation guide has been tailored to your specific context. The ${tool.name} methodology will help you achieve your goal by providing a structured approach to innovation.

### Key Considerations
- Adapted for a team size of ${userContext.teamSize || 'your team'}
- Modified to fit within ${userContext.timeAvailable || 'your available time'} time frame
- Adjusted for ${userContext.experienceLevel || 'your experience level'}
- Contextualized for the ${userContext.industry || 'your industry'} industry

### Getting Started

**First steps** are crucial for success with ${tool.name}. Make sure to:
1. Schedule a kickoff meeting with all stakeholders (5 minutes)
2. Set clear expectations and roles (5 minutes)
3. Prepare all necessary materials in advance (5-10 minutes)

## Implementation Process

The implementation process consists of several phases:

### Preparation Phase (10-15 minutes)
Before diving into the core activities, it's important to **establish a solid foundation**. This includes:
* Gathering relevant data
* Setting up the workspace
* Briefing your team

### Execution Phase (${tool.timeRequired.includes('30-60') ? '20-30' : tool.timeRequired.includes('15-30') ? '10-15' : '30-45'} minutes)
This is where the main work happens. Focus on:
- Following the structured process
- Encouraging participation from all team members
- Documenting insights as you go

NOTE: This is MOCK GUIDANCE. To get actual AI-powered implementation guidance, please configure a valid OpenAI API key in your .env.local file.`,

    customSteps: [
      `[MOCK DATA] **Define your specific objectives** related to "${userContext.goal}" (5 minutes)`,
      `[MOCK DATA] Prepare your team with necessary context and background (5-10 minutes)`,
      `[MOCK DATA] Execute a simplified version of ${tool.name} (${tool.timeRequired.includes('30-60') ? '20-30' : tool.timeRequired.includes('15-30') ? '10-15' : '30-45'} minutes)`,
      `[MOCK DATA] **Capture and analyze outputs** (10 minutes)`,
      `[MOCK DATA] Implement findings into your current workflows (5-10 minutes)`
    ],
    
    materials: [
      ...(tool.materials || []).slice(0, 3).map(material => `[MOCK DATA] ${material}`),
      `[MOCK DATA] Documentation templates for ${userContext.goal}`,
      `[MOCK DATA] **Customized worksheets** for your team's needs`
    ],
    
    timeline: `[MOCK DATA] ## Minute-by-Minute Timeline

### Phase 1: Setup (0-10 minutes)
- 0-5 min: Brief team members on goals and process
- 5-10 min: Distribute materials and organize workspace

### Phase 2: Core Activity (10-${tool.timeRequired.includes('30-60') ? '40' : tool.timeRequired.includes('15-30') ? '25' : '50'} minutes)
- 10-15 min: Introduce the problem and context
- 15-${tool.timeRequired.includes('30-60') ? '35' : tool.timeRequired.includes('15-30') ? '25' : '45'} min: Execute the main ${tool.name} activity
- ${tool.timeRequired.includes('30-60') ? '35-40' : tool.timeRequired.includes('15-30') ? '' : '45-50'} min: **Refine outputs**

### Phase 3: Wrap-up (Final 10 minutes)
- Summarize key findings
- Assign next steps
- Schedule follow-up if needed`,
    
    expectedOutcomes: [
      `[MOCK DATA] Clear insights related to "${userContext.goal}"`,
      `[MOCK DATA] A set of **actionable next steps** for implementation`,
      `[MOCK DATA] Team alignment on key priorities`,
      `[MOCK DATA] Documented process for future reference`
    ],
    
    usingMockData: true
  };
} 