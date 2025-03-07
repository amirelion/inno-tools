'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { UserContext } from '../../types';
import { useRecommendationsStore } from '../../lib/store';

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

export default function RecommendationsPage() {
  const router = useRouter();
  const { setUserContext, setLoading, setError } = useRecommendationsStore();
  
  const [formData, setFormData] = useState<UserContext>({
    goal: '',
    teamSize: '',
    timeAvailable: '',
    experienceLevel: '',
    industry: '',
    additionalContext: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when the goal field is filled
    if (name === 'goal' && value.trim() && validationError) {
      setValidationError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.goal.trim()) {
      setValidationError('Please enter your project goal or challenge');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update global state
      setUserContext(formData);
      setLoading(true);
      setError(null);
      
      // Call the API
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }
      
      // Parse response data
      const data = await response.json();
      
      // Store recommendations in global state
      useRecommendationsStore.getState().setRecommendations(data);
      useRecommendationsStore.getState().setLoading(false);
      
      // Navigate to results page
      router.push('/recommendations/results');
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      useRecommendationsStore.getState().setError(error.message || 'An error occurred while getting recommendations');
      useRecommendationsStore.getState().setLoading(false);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Get Personalized Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tell us about your project and context, and we'll recommend the most appropriate innovation tools for your needs.
        </Typography>
      </Box>
      
      {validationError && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {validationError}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
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
                placeholder="Describe what you're trying to achieve or the problem you're trying to solve"
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
                helperText="How many people will be involved?"
              >
                <MenuItem value="">Select team size</MenuItem>
                {TEAM_SIZES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
                helperText="How much time can you dedicate to this activity?"
              >
                <MenuItem value="">Select time available</MenuItem>
                {TIME_FRAMES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
                helperText="Your team's experience with innovation tools"
              >
                <MenuItem value="">Select experience level</MenuItem>
                {EXPERIENCE_LEVELS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Healthcare, Technology, Education"
                variant="outlined"
                helperText="The domain you're working in"
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
                placeholder="Any other information that might be relevant"
                variant="outlined"
                helperText="Optional: Share any specific requirements or constraints"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Getting Recommendations...
                    </>
                  ) : (
                    'Get Recommendations'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
} 