import express, { Request, Response, NextFunction } from 'express';
import { getAllTools, getToolById } from '../controllers/toolController';

const router = express.Router();

// Get all tools
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  getAllTools(req, res).catch(next);
});

// Get tool by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  getToolById(req, res).catch(next);
});

export default router; 