import express, { Request, Response, NextFunction } from 'express';
import { getRecommendations } from '../controllers/recommendationController';

const router = express.Router();

// Get recommendations based on user input
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  getRecommendations(req, res).catch(next);
});

export default router; 