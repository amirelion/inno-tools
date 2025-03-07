/**
 * Interface representing an innovation tool
 */
export interface InnovationTool {
  id: string;
  name: string;
  description: string;
  duration: {
    min: number;
    max: number;
  };
  complexity: 'low' | 'medium' | 'high';
  participantCount: {
    min: number;
    max: number;
  };
  purpose: string[];
  industry: string[];
  steps: {
    order: number;
    title: string;
    description: string;
  }[];
  materials: string[];
  tips: string[];
  references: {
    title: string;
    url: string;
  }[];
}

/**
 * Interface for user context data
 */
export interface UserContext {
  goal: string;
  duration?: number;
  participantCount?: number;
  expertiseLevel?: 'novice' | 'intermediate' | 'expert';
  industry?: string;
  problemDomain?: string;
}

/**
 * Interface for tool recommendation result
 */
export interface ToolRecommendation {
  toolId: string;
  toolName: string;
  confidenceScore: number;
  justification: string;
}

/**
 * Interface for customized implementation guidance
 */
export interface ImplementationGuidance {
  overview: string;
  contextSpecificAdaptations: string[];
  recommendedTimeAllocation: {
    preparation: number;
    execution: number;
    debrief: number;
  };
  additionalTips: string[];
} 