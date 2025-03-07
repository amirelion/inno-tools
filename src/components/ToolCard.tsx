'use client';

import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Box, Button } from '@mui/material';
import { InnovationTool } from '@/types';
import { useRouter } from 'next/navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

interface ToolCardProps {
  tool: InnovationTool;
}

// Function to get difficulty color
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return '#4caf50';
    case 'Intermediate':
      return '#1976d2';
    case 'Advanced':
      return '#d32f2f';
    default:
      return '#1976d2';
  }
};

// Function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Innovation Process':
      return '#bbdefb'; // light blue
    case 'Business Strategy':
      return '#c5cae9'; // light indigo
    case 'Ideation':
      return '#e1bee7'; // light purple
    case 'User Research':
      return '#dcedc8'; // light green
    case 'Problem Solving':
      return '#ffccbc'; // light deep orange
    default:
      return '#e0e0e0'; // light grey
  }
};

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const router = useRouter();
  
  const handleViewDetails = () => {
    router.push(`/tools/${tool.id}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          borderColor: '#1976d2',
        },
        borderTop: '4px solid #1976d2'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip 
            label={tool.category} 
            size="small" 
            sx={{ 
              bgcolor: getCategoryColor(tool.category),
              color: '#333',
              fontWeight: 500,
              fontSize: '0.75rem',
            }} 
          />
          <Chip 
            label={tool.difficulty} 
            size="small" 
            sx={{ 
              bgcolor: 'transparent',
              border: `1px solid ${getDifficultyColor(tool.difficulty)}`,
              color: getDifficultyColor(tool.difficulty),
            }} 
          />
        </Box>
        
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
          {tool.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '4.5em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {tool.description}
        </Typography>
        
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#757575' }}>
          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: '#d32f2f' }} />
          <Typography variant="body2">{tool.timeRequired}</Typography>
        </Box>
        
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', color: '#757575' }}>
          <PeopleIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="body2">{tool.teamSize}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
          {tool.benefits.slice(0, 2).map((benefit, index) => (
            <Chip 
              key={index} 
              label={benefit} 
              size="small" 
              sx={{ 
                bgcolor: '#e3f2fd', 
                color: '#0d47a1',
                fontSize: '0.7rem',
              }} 
            />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleViewDetails}
          fullWidth
          sx={{ 
            borderColor: '#1976d2', 
            color: '#1976d2',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              borderColor: '#0d47a1',
            }
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ToolCard; 