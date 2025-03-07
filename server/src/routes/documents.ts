import express, { Request, Response, NextFunction } from 'express';
import { generatePdf, generateDocx } from '../controllers/documentController';

const router = express.Router();

// Generate PDF document
router.post('/pdf', (req: Request, res: Response, next: NextFunction) => {
  generatePdf(req, res).catch(next);
});

// Generate Word document
router.post('/docx', (req: Request, res: Response, next: NextFunction) => {
  generateDocx(req, res).catch(next);
});

export default router; 