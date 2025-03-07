import { Request, Response } from 'express';
import { generatePdfDocument, generateDocxDocument } from '../services/documentService';
import { getToolData } from '../services/toolService';
import { generateImplementationGuidance } from '../services/aiService';

/**
 * Generate a PDF document for a tool with customized guidance
 */
export const generatePdf = async (req: Request, res: Response) => {
  try {
    const { toolId, userContext } = req.body;
    
    if (!toolId) {
      return res.status(400).json({ message: 'Tool ID is required' });
    }
    
    // Get tool data
    const tool = await getToolData(toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Generate customized guidance if user context is provided
    let customizedGuidance = null;
    if (userContext) {
      customizedGuidance = await generateImplementationGuidance(tool, userContext);
    }
    
    // Generate PDF
    const pdfBuffer = await generatePdfDocument(tool, customizedGuidance);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${tool.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    // Send PDF data
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

/**
 * Generate a DOCX document for a tool with customized guidance
 */
export const generateDocx = async (req: Request, res: Response) => {
  try {
    const { toolId, userContext } = req.body;
    
    if (!toolId) {
      return res.status(400).json({ message: 'Tool ID is required' });
    }
    
    // Get tool data
    const tool = await getToolData(toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Generate customized guidance if user context is provided
    let customizedGuidance = null;
    if (userContext) {
      customizedGuidance = await generateImplementationGuidance(tool, userContext);
    }
    
    // Generate DOCX
    const docxBuffer = await generateDocxDocument(tool, customizedGuidance);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${tool.name.replace(/\s+/g, '-').toLowerCase()}.docx`);
    
    // Send DOCX data
    res.send(docxBuffer);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    res.status(500).json({ message: 'Failed to generate DOCX' });
  }
}; 