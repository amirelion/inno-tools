'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Tools', path: '/tools' },
    { label: 'Recommendations', path: '/recommendations' },
    { label: 'About', path: '/about' },
  ];
  
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              InnoTools
            </Typography>
          </Link>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} passHref style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                    borderBottom: pathname === item.path ? '2px solid' : 'none',
                    borderRadius: 0,
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 