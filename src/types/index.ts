export interface InnovationTool {
  id: string;
  name: string;
  description: string;
  category: string;
  benefits: string[];
  useCase: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  teamSize: string;
  materials: string[];
  steps: string[];
  tips: string[];
  references: string[];
  imageUrl?: string;
}

export interface UserContext {
  goal: string;
  teamSize?: string;
  timeAvailable?: string;
  experienceLevel?: string;
  industry?: string;
  additionalContext?: string;
}

export interface ToolRecommendation {
  tool: InnovationTool;
  score: number;
  reasoning: string;
  implementationGuide?: string;
}

export interface RecommendationResponse {
  recommendations: ToolRecommendation[];
  summary: string;
  usingMockData?: boolean;
}

export interface ImplementationRequest {
  toolId: string;
  context: UserContext;
}

export interface ImplementationResponse {
  guide: string;
  customSteps: string[];
  materials: string[];
  timeline: string;
  expectedOutcomes: string[];
  usingMockData?: boolean;
} 