import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#000',
        color: '#fff',
        py: 3,
        textAlign: 'center',
        mt: 8,
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Ajith Kumar. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
