'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { UserContext } from '@/types';
import { useRecommendationsStore } from '@/lib/store';

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];
const teamSizes = ['1-3 people', '4-10 people', '11-20 people', '21+ people'];
const timeFrames = ['Less than a week', '1-2 weeks', '1 month', '2-3 months', '3+ months'];

export default function RecommendationsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserContext>({
    goal: '',
    teamSize: '',
    timeAvailable: '',
    experienceLevel: '',
    industry: '',
    budget: '',
    additionalContext: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    
    // Update the store with the user context
    useRecommendationsStore.getState().setUserContext(formData);
    useRecommendationsStore.getState().setLoading(true);
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const data = await response.json();
      
      // Store the recommendations in the global store
      useRecommendationsStore.getState().setRecommendations(data);
      
      // Redirect to results page
      router.push('/recommendations/results');
      
    } catch (err) {
      console.error('Error getting recommendations:', err);
      const errorMessage = 'Failed to get recommendations. Please try again later.';
      setError(errorMessage);
      useRecommendationsStore.getState().setError(errorMessage);
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Get Personalized Tool Recommendations
      </Typography>
      
      <Typography variant="body1" paragraph>
        Tell us about your project and goals, and we'll recommend the most suitable innovation tools for your needs.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="What is your goal or challenge?"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                multiline
                rows={3}
                helperText="Describe what you're trying to achieve or the problem you're trying to solve"
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
              >
                <MenuItem value="">Select team size</MenuItem>
                {teamSizes.map(size => (
                  <MenuItem key={size} value={size}>
                    {size}
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
              >
                <MenuItem value="">Select time frame</MenuItem>
                {timeFrames.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
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
              >
                <MenuItem value="">Select experience level</MenuItem>
                {experienceLevels.map(level => (
                  <MenuItem key={level} value={level}>
                    {level}
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
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget Constraints (if any)"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., Limited budget, No budget for external consultants"
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
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? (
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