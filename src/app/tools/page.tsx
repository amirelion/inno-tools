'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, TextField, MenuItem, CircularProgress } from '@mui/material';
import ToolCard from '@/components/ToolCard';
import { InnovationTool } from '@/types';

export default function ToolsPage() {
  const [tools, setTools] = useState<InnovationTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    category: '',
    difficulty: '',
  });

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTools(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading tools. Please try again later.');
        setLoading(false);
        console.error('Error fetching tools:', err);
      }
    };

    fetchTools();
  }, []);

  // Get unique categories and difficulties for filters
  const categories = [...new Set(tools.map(tool => tool.category))];
  const difficulties = [...new Set(tools.map(tool => tool.difficulty))];

  // Filter tools based on selected filters
  const filteredTools = tools.filter(tool => {
    return (
      (filter.category === '' || tool.category === filter.category) &&
      (filter.difficulty === '' || tool.difficulty === filter.difficulty)
    );
  });

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading tools...
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Innovation Tools Catalog
      </Typography>
      <Typography variant="body1" paragraph>
        Browse our collection of innovation tools and methodologies to find the right approach for your project.
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Category"
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Difficulty"
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
          sx={{ minWidth: 200 }}
          size="small"
        >
          <MenuItem value="">All Difficulties</MenuItem>
          {difficulties.map((difficulty) => (
            <MenuItem key={difficulty} value={difficulty}>
              {difficulty}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Tools Grid */}
      <Grid container spacing={4}>
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Grid item key={tool.id} xs={12} sm={6} md={4}>
              <ToolCard tool={tool} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No tools match the selected filters. Try adjusting your criteria.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
} 