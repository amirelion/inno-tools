'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Box, 
  TextField, MenuItem, Paper, 
  FormControl, InputLabel, Select, Chip,
  CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ToolCard from '../../components/ToolCard';
import { InnovationTool } from '../../types';

// Constants for filters
const CATEGORIES = [
  'All Categories',
  'Innovation Process',
  'Business Strategy',
  'Ideation',
  'User Research',
  'Problem Solving'
];

const DIFFICULTY_LEVELS = [
  'All Levels',
  'Beginner',
  'Intermediate',
  'Advanced'
];

const TIME_FRAMES = [
  'All Durations',
  '15-30 minutes',
  '30-60 minutes',
  '60-90 minutes',
  '90-120 minutes',
  '120+ minutes'
];

export default function ToolsPage() {
  const [tools, setTools] = useState<InnovationTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [difficultyFilter, setDifficultyFilter] = useState('All Levels');
  const [durationFilter, setDurationFilter] = useState('All Durations');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tools');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        
        const data = await response.json();
        setTools(data);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError('Failed to load tools. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, []);
  
  // Filter tools
  const filteredTools = tools.filter(tool => {
    // Apply category filter
    if (categoryFilter !== 'All Categories' && tool.category !== categoryFilter) {
      return false;
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'All Levels' && tool.difficulty !== difficultyFilter) {
      return false;
    }
    
    // Apply duration filter
    if (durationFilter !== 'All Durations' && tool.timeRequired !== durationFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle filter changes
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryFilter(event.target.value);
  };
  
  const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
    setDifficultyFilter(event.target.value);
  };
  
  const handleDurationChange = (event: SelectChangeEvent<string>) => {
    setDurationFilter(event.target.value);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter('All Categories');
    setDifficultyFilter('All Levels');
    setDurationFilter('All Durations');
    setSearchQuery('');
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#1976d2' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading innovation tools...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#ffebee' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body1">
            Please try refreshing the page or come back later.
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
        Innovation Tools Catalog
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f5f9ff' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Tools"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, category..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#1976d2',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label" sx={{ '&.Mui-focused': { color: '#1976d2' } }}>
                Category
              </InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                onChange={handleCategoryChange}
                label="Category"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              >
                {CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-filter-label" sx={{ '&.Mui-focused': { color: '#1976d2' } }}>
                Difficulty
              </InputLabel>
              <Select
                labelId="difficulty-filter-label"
                value={difficultyFilter}
                onChange={handleDifficultyChange}
                label="Difficulty"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="duration-filter-label" sx={{ '&.Mui-focused': { color: '#1976d2' } }}>
                Duration
              </InputLabel>
              <Select
                labelId="duration-filter-label"
                value={durationFilter}
                onChange={handleDurationChange}
                label="Duration"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              >
                {TIME_FRAMES.map(timeFrame => (
                  <MenuItem key={timeFrame} value={timeFrame}>
                    {timeFrame}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Chip 
              label="Clear Filters" 
              onClick={clearFilters} 
              variant="outlined" 
              sx={{ 
                borderColor: '#d32f2f', 
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#ffebee'
                }
              }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Showing {filteredTools.length} of {tools.length} tools
          </Typography>
          
          {(categoryFilter !== 'All Categories' || difficultyFilter !== 'All Levels' || 
           durationFilter !== 'All Durations' || searchQuery) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categoryFilter !== 'All Categories' && (
                <Chip 
                  label={`Category: ${categoryFilter}`} 
                  size="small" 
                  onDelete={() => setCategoryFilter('All Categories')} 
                  sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }}
                />
              )}
              
              {difficultyFilter !== 'All Levels' && (
                <Chip 
                  label={`Difficulty: ${difficultyFilter}`} 
                  size="small" 
                  onDelete={() => setDifficultyFilter('All Levels')} 
                  sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }}
                />
              )}
              
              {durationFilter !== 'All Durations' && (
                <Chip 
                  label={`Duration: ${durationFilter}`} 
                  size="small" 
                  onDelete={() => setDurationFilter('All Durations')} 
                  sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }}
                />
              )}
              
              {searchQuery && (
                <Chip 
                  label={`Search: ${searchQuery}`} 
                  size="small" 
                  onDelete={() => setSearchQuery('')} 
                  sx={{ bgcolor: '#bbdefb', color: '#0d47a1' }}
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>
      
      {filteredTools.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', bgcolor: '#fff8f8', borderLeft: '4px solid #d32f2f' }}>
          <Typography variant="h6" sx={{ color: '#d32f2f' }}>
            No tools match your filters
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Try adjusting your search criteria or
          </Typography>
          <Chip 
            label="Clear All Filters" 
            onClick={clearFilters} 
            sx={{ mt: 2, bgcolor: '#d32f2f', color: 'white' }}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTools.map(tool => (
            <Grid item key={tool.id} xs={12} sm={6} md={4}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 