import PDFDocument from 'pdfkit';
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { InnovationTool, ImplementationGuidance } from '../types/tool';

/**
 * Generate a PDF document for a tool with optional customized guidance
 */
export const generatePdfDocument = async (
  tool: InnovationTool,
  guidance?: ImplementationGuidance | null
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document with custom page size
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
      });
      
      // Buffer to collect PDF data
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      
      // Add document title
      doc.fontSize(24).font('Helvetica-Bold').text(tool.name, { align: 'center' });
      doc.moveDown();
      
      // Add description
      doc.fontSize(12).font('Helvetica').text(tool.description);
      doc.moveDown();
      
      // Add general info section
      doc.fontSize(16).font('Helvetica-Bold').text('General Information');
      doc.moveDown(0.5);
      
      // Table-like layout for general info
      const infoData = [
        { label: 'Duration', value: `${tool.duration.min}-${tool.duration.max} minutes` },
        { label: 'Complexity', value: tool.complexity },
        { label: 'Participants', value: `${tool.participantCount.min}-${tool.participantCount.max}` },
        { label: 'Purpose', value: tool.purpose.join(', ') },
        { label: 'Industries', value: tool.industry.join(', ') }
      ];
      
      infoData.forEach(item => {
        doc.fontSize(12)
          .font('Helvetica-Bold')
          .text(`${item.label}: `, { continued: true })
          .font('Helvetica')
          .text(item.value);
      });
      
      doc.moveDown();
      
      // Add steps section
      doc.fontSize(16).font('Helvetica-Bold').text('Implementation Steps');
      doc.moveDown(0.5);
      
      tool.steps.forEach(step => {
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .text(`${step.order}. ${step.title}`);
          
        doc.fontSize(12)
          .font('Helvetica')
          .text(step.description);
          
        doc.moveDown(0.5);
      });
      
      // Add materials section
      doc.fontSize(16).font('Helvetica-Bold').text('Materials Needed');
      doc.moveDown(0.5);
      
      doc.fontSize(12).font('Helvetica').list(tool.materials, { bulletRadius: 2 });
      doc.moveDown();
      
      // Add tips section
      doc.fontSize(16).font('Helvetica-Bold').text('Tips & Best Practices');
      doc.moveDown(0.5);
      
      doc.fontSize(12).font('Helvetica').list(tool.tips, { bulletRadius: 2 });
      doc.moveDown();
      
      // Add customized guidance if available
      if (guidance) {
        doc.addPage();
        
        doc.fontSize(20).font('Helvetica-Bold').text('Customized Implementation Guidance', { align: 'center' });
        doc.moveDown();
        
        // Overview
        doc.fontSize(16).font('Helvetica-Bold').text('Overview');
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').text(guidance.overview);
        doc.moveDown();
        
        // Context-specific adaptations
        doc.fontSize(16).font('Helvetica-Bold').text('Context-Specific Adaptations');
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').list(guidance.contextSpecificAdaptations, { bulletRadius: 2 });
        doc.moveDown();
        
        // Time allocation
        doc.fontSize(16).font('Helvetica-Bold').text('Recommended Time Allocation');
        doc.moveDown(0.5);
        
        const timeData = [
          { label: 'Preparation', value: `${guidance.recommendedTimeAllocation.preparation} minutes` },
          { label: 'Execution', value: `${guidance.recommendedTimeAllocation.execution} minutes` },
          { label: 'Debrief', value: `${guidance.recommendedTimeAllocation.debrief} minutes` },
          { label: 'Total', value: `${guidance.recommendedTimeAllocation.preparation + guidance.recommendedTimeAllocation.execution + guidance.recommendedTimeAllocation.debrief} minutes` }
        ];
        
        timeData.forEach(item => {
          doc.fontSize(12)
            .font('Helvetica-Bold')
            .text(`${item.label}: `, { continued: true })
            .font('Helvetica')
            .text(item.value);
        });
        
        doc.moveDown();
        
        // Additional tips
        doc.fontSize(16).font('Helvetica-Bold').text('Additional Tips');
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica').list(guidance.additionalTips, { bulletRadius: 2 });
      }
      
      // Add references
      doc.moveDown();
      doc.fontSize(16).font('Helvetica-Bold').text('References');
      doc.moveDown(0.5);
      
      tool.references.forEach(ref => {
        doc.fontSize(12)
          .font('Helvetica-Bold')
          .text(ref.title, { continued: true })
          .font('Helvetica')
          .text(`: ${ref.url}`);
      });
      
      // Add footer
      const footerText = `Generated by InnoTools - ${new Date().toLocaleDateString()}`;
      const footerX = (doc.page.width - doc.widthOfString(footerText)) / 2;
      
      doc.fontSize(10)
        .font('Helvetica')
        .text(footerText, footerX, doc.page.height - 50, { align: 'center' });
      
      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

/**
 * Generate a DOCX document for a tool with optional customized guidance
 */
export const generateDocxDocument = async (
  tool: InnovationTool,
  guidance?: ImplementationGuidance | null
): Promise<Buffer> => {
  try {
    // Create sections for the document
    const sections = [
      // Title section
      {
        properties: {},
        children: [
          new Paragraph({
            text: tool.name,
            heading: HeadingLevel.TITLE,
            alignment: 'center'
          }),
          new Paragraph({
            text: tool.description,
            style: 'Normal'
          }),
          new Paragraph({ text: '' })
        ]
      }
    ];
    
    // General information section
    const generalInfoParagraphs = [
      new Paragraph({
        text: 'General Information',
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Duration: ', bold: true }),
          new TextRun(`${tool.duration.min}-${tool.duration.max} minutes`)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Complexity: ', bold: true }),
          new TextRun(tool.complexity)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Participants: ', bold: true }),
          new TextRun(`${tool.participantCount.min}-${tool.participantCount.max}`)
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Purpose: ', bold: true }),
          new TextRun(tool.purpose.join(', '))
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Industries: ', bold: true }),
          new TextRun(tool.industry.join(', '))
        ]
      }),
      new Paragraph({ text: '' })
    ];
    
    // Steps section
    const stepsParagraphs = [
      new Paragraph({
        text: 'Implementation Steps',
        heading: HeadingLevel.HEADING_1
      })
    ];
    
    tool.steps.forEach(step => {
      stepsParagraphs.push(
        new Paragraph({
          text: `${step.order}. ${step.title}`,
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          text: step.description
        }),
        new Paragraph({ text: '' })
      );
    });
    
    // Materials section
    const materialsParagraphs = [
      new Paragraph({
        text: 'Materials Needed',
        heading: HeadingLevel.HEADING_1
      })
    ];
    
    tool.materials.forEach(material => {
      materialsParagraphs.push(
        new Paragraph({
          text: `• ${material}`,
          style: 'ListParagraph'
        })
      );
    });
    
    materialsParagraphs.push(new Paragraph({ text: '' }));
    
    // Tips section
    const tipsParagraphs = [
      new Paragraph({
        text: 'Tips & Best Practices',
        heading: HeadingLevel.HEADING_1
      })
    ];
    
    tool.tips.forEach(tip => {
      tipsParagraphs.push(
        new Paragraph({
          text: `• ${tip}`,
          style: 'ListParagraph'
        })
      );
    });
    
    tipsParagraphs.push(new Paragraph({ text: '' }));
    
    // Customized guidance section (if available)
    const guidanceParagraphs = [];
    
    if (guidance) {
      guidanceParagraphs.push(
        new Paragraph({
          text: 'Customized Implementation Guidance',
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true
        }),
        new Paragraph({
          text: 'Overview',
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          text: guidance.overview
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Context-Specific Adaptations',
          heading: HeadingLevel.HEADING_2
        })
      );
      
      guidance.contextSpecificAdaptations.forEach(adaptation => {
        guidanceParagraphs.push(
          new Paragraph({
            text: `• ${adaptation}`,
            style: 'ListParagraph'
          })
        );
      });
      
      guidanceParagraphs.push(
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Recommended Time Allocation',
          heading: HeadingLevel.HEADING_2
        })
      );
      
      // Time allocation table
      const timeAllocationTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Phase', bold: true })]
                })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Time (minutes)', bold: true })]
                })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('Preparation')],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              }),
              new TableCell({
                children: [new Paragraph(`${guidance.recommendedTimeAllocation.preparation}`)],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('Execution')],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              }),
              new TableCell({
                children: [new Paragraph(`${guidance.recommendedTimeAllocation.execution}`)],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('Debrief')],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              }),
              new TableCell({
                children: [new Paragraph(`${guidance.recommendedTimeAllocation.debrief}`)],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Total', bold: true })]
                })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              }),
              new TableCell({
                children: [new Paragraph({
                  children: [
                    new TextRun({ 
                      text: `${guidance.recommendedTimeAllocation.preparation + guidance.recommendedTimeAllocation.execution + guidance.recommendedTimeAllocation.debrief}`,
                      bold: true
                    })
                  ]
                })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 }
                }
              })
            ]
          })
        ]
      });
      
      guidanceParagraphs.push(
        timeAllocationTable,
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Additional Tips',
          heading: HeadingLevel.HEADING_2
        })
      );
      
      guidance.additionalTips.forEach(tip => {
        guidanceParagraphs.push(
          new Paragraph({
            text: `• ${tip}`,
            style: 'ListParagraph'
          })
        );
      });
      
      guidanceParagraphs.push(new Paragraph({ text: '' }));
    }
    
    // References section
    const referencesParagraphs = [
      new Paragraph({
        text: 'References',
        heading: HeadingLevel.HEADING_1
      })
    ];
    
    tool.references.forEach(ref => {
      referencesParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: ref.title, bold: true }),
            new TextRun(`: ${ref.url}`)
          ]
        })
      );
    });
    
    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          ...generalInfoParagraphs,
          ...stepsParagraphs,
          ...materialsParagraphs,
          ...tipsParagraphs,
          ...guidanceParagraphs,
          ...referencesParagraphs,
          // Footer
          new Paragraph({
            children: [
              new TextRun(`Generated by InnoTools - ${new Date().toLocaleDateString()}`)
            ],
            alignment: 'center'
          })
        ]
      }]
    });
    
    // Generate DOCX buffer
    // Using buffer creation compatible with the current docx version
    const buffer = await Buffer.from(await (doc as any).save());
    return buffer;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw error;
  }
}; 