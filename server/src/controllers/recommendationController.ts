import { Request, Response } from 'express';
import { generateToolRecommendations } from '../services/aiService';
import { getTools } from '../services/toolService';

/**
 * Get tool recommendations based on user input
 */
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userContext = req.body;
    
    // Validate required inputs
    if (!userContext.goal) {
      return res.status(400).json({ message: 'Goal is required' });
    }
    
    // Get all tools to be used for recommendation
    const allTools = await getTools({});
    
    // Generate recommendations using OpenAI
    const recommendations = await generateToolRecommendations(userContext, allTools);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
}; 