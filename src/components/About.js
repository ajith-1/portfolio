import React from 'react';
import { Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Skill from './Skill';


const About = () => (
  <Container maxWidth='100%' sx={{ py: 8 }}>
    <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
    <Typography variant="h6" gutterBottom>The Developer Behind the Keyboard</Typography>
      <Typography variant="h2" gutterBottom>About Me</Typography>
      <Typography>
      A Developer who loves to build things from scratch and give them life or add some features to outdated or existing applications and make them shine again, focused on creating cutting-edge, elegant, and accessible user experiences.
I'm passionate about the web, quite curious and enjoy learning every day and taking responsibility to solve real-world problems.      </Typography>
    </motion.div>
    <Skill />
  </Container>
);

export default About;
