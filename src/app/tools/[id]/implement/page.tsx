'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle,
  Schedule as TimelineIcon,
  Assignment as StepsIcon,
  Inventory as MaterialsIcon,
  EmojiEvents as OutcomesIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { InnovationTool, UserContext, ImplementationResponse } from '@/types';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Constants
const EXPERIENCE_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
];

const TEAM_SIZES = [
  { value: '1-3 people', label: 'Small (1-3 people)' },
  { value: '4-10 people', label: 'Medium (4-10 people)' },
  { value: '10+ people', label: 'Large (10+ people)' }
];

const TIME_FRAMES = [
  { value: '15-30 minutes', label: '15-30 minutes' },
  { value: '30-60 minutes', label: '30-60 minutes' },
  { value: '60-90 minutes', label: '60-90 minutes' },
  { value: '90-120 minutes', label: '90-120 minutes' },
  { value: '120+ minutes', label: 'Over 2 hours' }
];

// Custom styles for markdown rendering
const markdownStyles = {
  h1: {
    fontSize: '2rem',
    fontWeight: 600,
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: '0.75rem',
    marginBottom: '0.5rem',
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginTop: '0.75rem',
    marginBottom: '0.5rem',
  },
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

export default function ImplementationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const [tool, setTool] = useState<InnovationTool | null>(null);
  const [formData, setFormData] = useState<UserContext>({
    goal: '',
    teamSize: '',
    timeAvailable: '',
    experienceLevel: '',
    industry: '',
    additionalContext: ''
  });
  
  const [implementation, setImplementation] = useState<ImplementationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [toolLoading, setToolLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Fetch the tool details
  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`/api/tools/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tool not found');
          }
          throw new Error('Failed to fetch tool details');
        }
        const data = await response.json();
        setTool(data);
        setToolLoading(false);
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setToolLoading(false);
        console.error('Error fetching tool:', err);
      }
    };

    fetchTool();
  }, [params.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.goal.trim()) {
      setError('Please describe your goal or challenge');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tools/${params.id}/implementation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate implementation guidance');
      }
      
      const data = await response.json();
      setImplementation(data);
      setLoading(false);
      
      // Scroll to the implementation section
      document.getElementById('implementation-results')?.scrollIntoView({ behavior: 'smooth' });
      
    } catch (err) {
      console.error('Error generating implementation guidance:', err);
      setError('Failed to generate implementation guidance. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleExportPDF = () => {
    if (!implementation || !tool) return;
    
    setExportLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(`Implementation Guide: ${tool.name}`, 20, 20);
      
      // Add context
      doc.setFontSize(12);
      doc.text(`Goal: ${formData.goal}`, 20, 35);
      
      let yPosition = 45;
      
      if (formData.teamSize) {
        doc.text(`Team Size: ${formData.teamSize}`, 20, yPosition);
        yPosition += 7;
      }
      
      if (formData.timeAvailable) {
        doc.text(`Time Available: ${formData.timeAvailable}`, 20, yPosition);
        yPosition += 7;
      }
      
      if (formData.experienceLevel) {
        doc.text(`Experience Level: ${formData.experienceLevel}`, 20, yPosition);
        yPosition += 7;
      }
      
      yPosition += 10;
      
      // Add implementation guide
      doc.setFontSize(16);
      doc.text('Implementation Guide', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      const splitGuide = doc.splitTextToSize(implementation.guide, 170);
      doc.text(splitGuide, 20, yPosition);
      yPosition += splitGuide.length * 7 + 10;
      
      // Add page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add custom steps
      doc.setFontSize(16);
      doc.text('Custom Steps', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      implementation.customSteps.forEach((step, index) => {
        // Add page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${index + 1}. ${step}`, 20, yPosition);
        yPosition += 7;
      });
      
      yPosition += 10;
      
      // Add page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add materials
      doc.setFontSize(16);
      doc.text('Materials Needed', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      implementation.materials.forEach((material, index) => {
        // Add page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`• ${material}`, 20, yPosition);
        yPosition += 7;
      });
      
      yPosition += 10;
      
      // Add page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add timeline
      doc.setFontSize(16);
      doc.text('Timeline', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      const splitTimeline = doc.splitTextToSize(implementation.timeline, 170);
      doc.text(splitTimeline, 20, yPosition);
      yPosition += splitTimeline.length * 7 + 10;
      
      // Add page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add expected outcomes
      doc.setFontSize(16);
      doc.text('Expected Outcomes', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      implementation.expectedOutcomes.forEach((outcome, index) => {
        // Add page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`• ${outcome}`, 20, yPosition);
        yPosition += 7;
      });
      
      // Save the PDF
      doc.save(`${tool.name.toLowerCase().replace(/\s+/g, '-')}-implementation-guide.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setExportLoading(false);
    }
  };
  
  if (toolLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading tool details...
        </Typography>
      </Container>
    );
  }
  
  if (error && !tool) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button component={Link} href="/tools" variant="contained" sx={{ mt: 2 }}>
          Back to Tools
        </Button>
      </Container>
    );
  }
  
  if (!tool) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Tool not found
        </Typography>
        <Button component={Link} href="/tools" variant="contained" sx={{ mt: 2 }}>
          Back to Tools
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {implementation ? (
        // Implementation guidance display
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {tool.name} Implementation Guide
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Customized for: {formData.goal}
            </Typography>
          </Box>
          
          {implementation.usingMockData && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Using Mock Data
              </Typography>
              <Typography variant="body2">
                This is a sample implementation guide using mock data. For accurate AI-powered guidance, 
                please add a valid OpenAI API key to your .env.local file. The correct format is: 
                OPENAI_API_KEY=sk-... (your actual key)
              </Typography>
            </Alert>
          )}

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Implementation Guide
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <Typography variant="h4" gutterBottom style={markdownStyles.h1} {...props} />,
                  h2: ({node, ...props}) => <Typography variant="h5" gutterBottom style={markdownStyles.h2} {...props} />,
                  h3: ({node, ...props}) => <Typography variant="h6" gutterBottom style={markdownStyles.h3} {...props} />,
                  h4: ({node, ...props}) => <Typography variant="subtitle1" gutterBottom style={markdownStyles.h4} {...props} />,
                  p: ({node, ...props}) => <Typography component="p" variant="body1" paragraph style={markdownStyles.p} {...props} />,
                  ul: ({node, ...props}) => <Box component="ul" style={markdownStyles.ul} {...props} />,
                  ol: ({node, ...props}) => <Box component="ol" style={markdownStyles.ol} {...props} />,
                  li: ({node, ...props}) => <Box component="li" style={markdownStyles.li} {...props} />,
                  strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                }}
              >
                {implementation.guide}
              </ReactMarkdown>
            </Box>
          </Paper>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customized Steps
                  </Typography>
                  <List>
                    {implementation.customSteps.map((step, index) => (
                      <ListItem key={index} alignItems="flex-start">
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <ReactMarkdown
                              components={{
                                p: ({node, ...props}) => <Typography component="p" variant="body1" {...props} />,
                                strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                              }}
                            >
                              {step}
                            </ReactMarkdown>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Materials Needed
                  </Typography>
                  <List>
                    {implementation.materials.map((material, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <ReactMarkdown
                              components={{
                                p: ({node, ...props}) => <Typography component="p" variant="body1" {...props} />,
                                strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                              }}
                            >
                              {material}
                            </ReactMarkdown>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Paper elevation={2} sx={{ p: 3, my: 4 }}>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <Typography variant="h4" gutterBottom style={markdownStyles.h1} {...props} />,
                  h2: ({node, ...props}) => <Typography variant="h5" gutterBottom style={markdownStyles.h2} {...props} />,
                  h3: ({node, ...props}) => <Typography variant="h6" gutterBottom style={markdownStyles.h3} {...props} />,
                  h4: ({node, ...props}) => <Typography variant="subtitle1" gutterBottom style={markdownStyles.h4} {...props} />,
                  p: ({node, ...props}) => <Typography component="p" variant="body1" paragraph style={markdownStyles.p} {...props} />,
                  ul: ({node, ...props}) => <Box component="ul" style={markdownStyles.ul} {...props} />,
                  ol: ({node, ...props}) => <Box component="ol" style={markdownStyles.ol} {...props} />,
                  li: ({node, ...props}) => <Box component="li" style={markdownStyles.li} {...props} />,
                  strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                }}
              >
                {implementation.timeline}
              </ReactMarkdown>
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Expected Outcomes
            </Typography>
            <List>
              {implementation.expectedOutcomes.map((outcome, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <Typography component="p" variant="body1" {...props} />,
                          strong: ({node, ...props}) => <Box component="strong" style={markdownStyles.strong} {...props} />,
                        }}
                      >
                        {outcome}
                      </ReactMarkdown>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => setImplementation(null)}
            >
              Adjust Context
            </Button>
            <Button 
              startIcon={<DownloadIcon />}
              variant="contained"
              onClick={handleExportPDF}
            >
              Export as PDF
            </Button>
          </Box>
        </>
      ) : (
        // Context form
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {tool.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Get Implementation Guidance
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Provide your project context to get customized implementation guidance for this innovation tool.
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="What is your project goal or challenge?"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Describe what you're trying to achieve with this tool"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Team Size"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {TEAM_SIZES.map(size => (
                      <MenuItem key={size.value} value={size.value}>
                        {size.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Time Available"
                    name="timeAvailable"
                    value={formData.timeAvailable}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {TIME_FRAMES.map(time => (
                      <MenuItem key={time.value} value={time.value}>
                        {time.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Experience Level"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {EXPERIENCE_LEVELS.map(level => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Industry or Domain"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Healthcare, Education, Finance"
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Context"
                    name="additionalContext"
                    value={formData.additionalContext}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Any other relevant information about your project or organization"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={() => router.push(`/tools/${params.id}`)}
              >
                Back to Tool Details
              </Button>
              <Button 
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}
              >
                {loading ? 'Generating...' : 'Get Implementation Guidance'}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Container>
  );
} 