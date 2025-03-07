import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button } from '@mui/material';
import { InnovationTool } from '@/types';
import Link from 'next/link';

interface ToolCardProps {
  tool: InnovationTool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      }
    }}>
      {tool.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={tool.imageUrl}
          alt={tool.name}
        />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="div">
          {tool.name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={tool.category} 
            size="small" 
            sx={{ mr: 1, mb: 1 }} 
          />
          <Chip 
            label={tool.difficulty} 
            size="small" 
            sx={{ mr: 1, mb: 1 }} 
            color={
              tool.difficulty === 'Beginner' ? 'success' : 
              tool.difficulty === 'Intermediate' ? 'primary' : 
              'error'
            }
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tool.description.length > 150 
            ? `${tool.description.substring(0, 150)}...` 
            : tool.description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Time:</strong> {tool.timeRequired}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Team:</strong> {tool.teamSize}
          </Typography>
          
          <Link href={`/tools/${tool.id}`} passHref>
            <Button variant="contained" size="small" fullWidth>
              View Details
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ToolCard; 