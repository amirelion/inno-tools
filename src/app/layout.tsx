import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeRegistry from '@/components/ThemeRegistry';
import { Box, Container, Typography, Divider } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InnoTools - Innovation Tools Recommendation Platform',
  description: 'Find the right innovation methods and tools for your project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: '1 0 auto' }}>{children}</main>
            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                bgcolor: 'grey.200'
              }}
            >
              <Container maxWidth="lg">
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} InnoTools. All rights reserved.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find the right innovation tools for your project
                  </Typography>
                </Box>
              </Container>
            </Box>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
} 