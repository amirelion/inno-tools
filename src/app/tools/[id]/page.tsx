'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Chip, Divider, 
  List, ListItem, ListItemIcon, ListItemText, 
  Paper, Button, CircularProgress, Grid
} from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  Group as TeamIcon, 
  CheckCircle,
  CheckCircle as StepIcon,
  Lightbulb as TipIcon, 
  Link as ReferenceIcon,
  Inventory as MaterialIcon
} from '@mui/icons-material';
import { InnovationTool } from '@/types';
import Link from 'next/link';

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const [tool, setTool] = useState<InnovationTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
        console.error('Error fetching tool:', err);
      }
    };

    fetchTool();
  }, [params.id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading tool details...
        </Typography>
      </Container>
    );
  }

  if (error) {
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} href="/tools" variant="outlined" sx={{ mb: 2 }}>
          Back to Tools
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom>
          {tool.name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={tool.category} />
          <Chip 
            label={tool.difficulty} 
            color={
              tool.difficulty === 'Beginner' ? 'success' : 
              tool.difficulty === 'Intermediate' ? 'primary' : 
              'error'
            }
          />
        </Box>
        
        <Typography variant="body1" paragraph>
          {tool.description}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Main content */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Implementation Steps
            </Typography>
            <List>
              {tool.steps.map((step, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon>
                    <StepIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Tips for Success
            </Typography>
            <List>
              {tool.tips.map((tip, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon>
                    <TipIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {tool.references.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                References & Resources
              </Typography>
              <List>
                {tool.references.map((reference, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemIcon>
                      <ReferenceIcon />
                    </ListItemIcon>
                    <ListItemText primary={reference} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Sidebar */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Key Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <TimeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Time Required" 
                  secondary={tool.timeRequired} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TeamIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Team Size" 
                  secondary={tool.teamSize} 
                />
              </ListItem>
            </List>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Materials Needed
            </Typography>
            <List dense>
              {tool.materials.map((material, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <MaterialIcon />
                  </ListItemIcon>
                  <ListItemText primary={material} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Benefits
            </Typography>
            <List dense>
              {tool.benefits.map((benefit, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Button 
            component={Link} 
            href={`/tools/${tool.id}/implement`}
            variant="contained" 
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Get Implementation Guidance
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
} 