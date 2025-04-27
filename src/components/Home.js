import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => (
  <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Typography variant="h4">Hey, I'm Ajith Kumar</Typography>
      <Typography variant="h1">Front End Developer</Typography>
      <Typography variant="h6">crafting and breaking the internet daily</Typography>

    </motion.div>
  </Box>
);

export default Home;
