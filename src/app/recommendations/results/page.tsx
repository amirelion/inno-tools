'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { CheckCircle, Info as InfoIcon, ArrowBack, Download } from '@mui/icons-material';
import Link from 'next/link';
import { useRecommendationsStore } from '@/lib/store';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';

// Custom styles for markdown rendering
const markdownStyles = {
  p: {
    marginBottom: '0.75rem',
  },
  ul: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
  },
  ol: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem',
  },
  li: {
    marginBottom: '0.25rem',
  },
  strong: {
    fontWeight: 'bold',
  },
};

export default function RecommendationsResultsPage() {
  const router = useRouter();
  const { recommendations, userContext, isLoading, error } = useRecommendationsStore();
  
  // Redirect to recommendations form if no recommendations and not loading
  useEffect(() => {
    if (!recommendations && !isLoading) {
      router.push('/recommendations');
    }
  }, [recommendations, isLoading, router]);

  const handleExportPDF = () => {
    if (!recommendations) return;
    
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.text('InnoTools Recommendations', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated for: ${userContext?.goal || 'Your innovation project'}`, 20, 30);
    
    // Add summary
    doc.setFontSize(16);
    doc.text('Summary', 20, 45);
    
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(recommendations.summary, 170);
    doc.text(summaryLines, 20, 55);
    
    let yPos = 65 + summaryLines.length * 7;
    
    // Add recommendations
    doc.setFontSize(16);
    doc.text('Recommended Tools', 20, yPos);
    yPos += 10;
    
    recommendations.recommendations.forEach((rec, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${rec.tool.name} (Match: ${rec.score}%)`, 20, yPos);
      yPos += 7;
      
      doc.setFontSize(11);
      const reasoningLines = doc.splitTextToSize(`Why: ${rec.reasoning}`, 170);
      doc.text(reasoningLines, 20, yPos);
      yPos += reasoningLines.length * 6;
      
      if (rec.implementationGuide) {
        const guideLines = doc.splitTextToSize(`Implementation: ${rec.implementationGuide}`, 170);
        doc.text(guideLines, 20, yPos);
        yPos += guideLines.length * 6 + 5;
      }
    });
    
    // Save the PDF
    doc.save('innotools-recommendations.pdf');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Loading recommendations...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Error: {error}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          variant="contained"
          onClick={() => router.push('/recommendations')}
        >
          Back to Recommendations Form
        </Button>
      </Container>
    );
  }

  if (!recommendations) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          No recommendations available
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            startIcon={<ArrowBack />} 
            variant="contained"
            onClick={() => router.push('/recommendations')}
          >
            Get Recommendations
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recommendations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Based on your goal: {userContext?.goal}
        </Typography>
      </Box>

      {recommendations.usingMockData && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Using Mock Data
          </Typography>
          <Typography variant="body2">
            These are sample recommendations using mock data. For accurate AI-powered recommendations, 
            please add a valid OpenAI API key to your .env.local file. The correct format is: 
            OPENAI_API_KEY=sk-... (your actual key)
          </Typography>
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <Typography variant="body1" paragraph style={markdownStyles.p} {...props} />,
              ul: ({node, ...props}) => <Box component="ul" style={markdownStyles.ul} {...props} />,
              ol: ({node, ...props}) => <Box component="ol" style={markdownStyles.ol} {...props} />,
              li: ({node, ...props}) => <Box component="li" style={markdownStyles.li} {...props} />,
              strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
            }}
          >
            {recommendations.summary}
          </ReactMarkdown>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Recommended Tools
      </Typography>

      {recommendations.recommendations.map((recommendation, index) => (
        <Card key={recommendation.tool.id} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {recommendation.tool.name}
              </Typography>
              <Chip 
                label={`${recommendation.score}% Match`} 
                color={recommendation.score > 80 ? "success" : "primary"} 
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {recommendation.tool.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Why this is recommended:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <Typography variant="body2" paragraph style={markdownStyles.p} {...props} />,
                  ul: ({node, ...props}) => <Box component="ul" style={markdownStyles.ul} {...props} />,
                  ol: ({node, ...props}) => <Box component="ol" style={markdownStyles.ol} {...props} />,
                  li: ({node, ...props}) => <Box component="li" style={markdownStyles.li} {...props} />,
                  strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                }}
              >
                {recommendation.reasoning}
              </ReactMarkdown>
            </Box>
            
            {recommendation.implementationGuide && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Implementation Guide:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <Typography variant="body2" paragraph style={markdownStyles.p} {...props} />,
                      ul: ({node, ...props}) => <Box component="ul" style={markdownStyles.ul} {...props} />,
                      ol: ({node, ...props}) => <Box component="ol" style={markdownStyles.ol} {...props} />,
                      li: ({node, ...props}) => <Box component="li" style={markdownStyles.li} {...props} />,
                      strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                    }}
                  >
                    {recommendation.implementationGuide}
                  </ReactMarkdown>
                </Box>
              </>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Details:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={`Difficulty: ${recommendation.tool.difficulty}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={`Time Required: ${recommendation.tool.timeRequired}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={`Ideal Team Size: ${recommendation.tool.teamSize}`}
                  />
                </ListItem>
              </List>
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              startIcon={<InfoIcon />}
              onClick={() => router.push(`/tools/${recommendation.tool.id}`)}
            >
              View Details
            </Button>
          </CardActions>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          variant="outlined"
          onClick={() => router.push('/recommendations')}
        >
          Back to Recommendations Form
        </Button>
        <Button 
          startIcon={<Download />} 
          variant="contained"
          onClick={handleExportPDF}
        >
          Export as PDF
        </Button>
      </Box>
    </Container>
  );
} 