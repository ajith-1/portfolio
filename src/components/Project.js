import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Project = () => (
  <Container sx={{ py: 8 }}>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <Typography variant="h4" gutterBottom>Projects</Typography>
      <Box>
        <Typography>- Portfolio Website</Typography>
        <Typography>- E-commerce UI</Typography>
        <Typography>- Todo App with React</Typography>
      </Box>
    </motion.div>
  </Container>
);

export default Project;
