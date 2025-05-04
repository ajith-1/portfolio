import React from 'react';
import { Box, Typography, Avatar, useMediaQuery, useTheme, } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
     
      <Box
        sx={{
          width: isMobile ? '100%' : '50%', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: 'center',
          paddingRight: isMobile ? '0' : '20px',
          marginBottom: isMobile ? '20px' : '0', 
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 120 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#333',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            Hey, I'm Ajith Kumar
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: '3rem',
              color: '#0a192f',
              marginBottom: '20px',
            }}
          >
            Front-End Developer
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              fontSize: '1.2rem',
              color: '#555',
              marginBottom: '40px',
            }}
          >
            Crafting and breaking the internet daily
          </Typography>
        </motion.div>
      </Box>

      
      <Box
        sx={{
          width: isMobile ? '100%' : '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            alt="Ajith Kumar"
            sx={{
              width: 150,
              height: 150,
              border: '4px solid #0a192f',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
            }}
          />
        </motion.div>
      </Box>
    </Box>
   
  );
};

export default Home;
