import { Request, Response } from 'express';
import { getTools, getToolData } from '../services/toolService';

/**
 * Get all innovation tools
 */
export const getAllTools = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const tools = await getTools(filters);
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ message: 'Failed to fetch tools' });
  }
};

/**
 * Get a specific tool by ID
 */
export const getToolById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tool = await getToolData(id);
    
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    console.error(`Error fetching tool with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch tool' });
  }
}; 