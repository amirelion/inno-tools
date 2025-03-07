import React from 'react';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        About InnoTools
      </Typography>
      
      <Typography component="div" variant="body1" paragraph>
        InnoTools is a platform designed to help teams and organizations find the right innovation tools and methodologies for their specific needs. Our mission is to make innovation more accessible and effective by providing personalized recommendations and implementation guidance.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography component="div" variant="body1" paragraph>
          We believe that innovation is essential for organizations to thrive in today's rapidly changing world. However, navigating the vast landscape of innovation methodologies can be overwhelming. InnoTools aims to simplify this process by helping you find the right tools for your specific context and providing guidance on how to implement them effectively.
        </Typography>
      </Paper>
      
      <Typography variant="h4" gutterBottom>
        How It Works
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              1. Browse Tools
            </Typography>
            <Typography component="div" variant="body1">
              Explore our curated catalog of innovation tools and methodologies. Each tool includes detailed information about its purpose, benefits, implementation steps, and more.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              2. Get Recommendations
            </Typography>
            <Typography component="div" variant="body1">
              Tell us about your project, goals, and constraints, and our AI-powered system will recommend the most suitable innovation tools for your specific context.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              3. Implementation Guidance
            </Typography>
            <Typography component="div" variant="body1">
              Receive detailed, context-specific guidance on how to implement the recommended tools in your organization, including customized steps, materials, and timelines.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 6 }} />
      
      <Typography variant="h4" gutterBottom>
        Our Approach
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Curated Content
            </Typography>
            <Typography component="div" variant="body1">
              Our catalog of innovation tools is carefully curated to include proven methodologies from various fields, including design thinking, lean startup, agile development, and more. Each tool is thoroughly researched and documented to provide you with comprehensive information.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              AI-Powered Recommendations
            </Typography>
            <Typography component="div" variant="body1">
              We use advanced AI technology to analyze your specific context and recommend the most suitable innovation tools. Our recommendation engine considers factors such as your goals, team size, time constraints, experience level, and industry to provide personalized suggestions.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Ready to find the right innovation tools for your project?
        </Typography>
        <Typography component="div" variant="body1">
          Start by browsing our tool catalog or getting personalized recommendations.
        </Typography>
      </Box>
    </Container>
  );
} 