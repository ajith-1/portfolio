import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';

const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'Material UI', 'Framer Motion'];

const Skill = () => (
  <Box sx={{ py: 8, px: 2 }}>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <Typography variant="h4" align="center" gutterBottom>My Skills</Typography>
      <Grid container spacing={3} justifyContent="center">
        {skills.map((skill, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>{skill}</Paper>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  </Box>
);

export default Skill;
