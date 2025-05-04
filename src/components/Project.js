import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project One',
    image: 'https://via.placeholder.com/400',
    technologies: ['React', 'Node.js', 'MongoDB'],
    demoLink: 'https://www.example.com/demo1',
  },
  {
    title: 'Project Two',
    image: 'https://via.placeholder.com/400',
    technologies: ['Vue', 'Express', 'MySQL'],
    demoLink: 'https://www.example.com/demo2',
  },
  {
    title: 'Project Three',
    image: 'https://via.placeholder.com/400',
    technologies: ['Angular', 'Firebase'],
    demoLink: 'https://www.example.com/demo3',
  },
];

const Project = () => {
  return (
    <Box sx={{ padding: '60px 20px', backgroundColor: '#f9f9f9' }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          marginBottom: '40px',
          fontWeight: 'bold',
          color: '#333',
          textTransform: 'uppercase',
        }}
      >
        My Projects
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                delay: index * 0.2,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
            >
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                  sx={{ borderRadius: '12px 12px 0 0' }}
                />
                <CardContent sx={{ padding: '20px' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#0a192f',
                      marginBottom: '10px',
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: '20px' }}
                  >
                    Technologies: {project.technologies.join(', ')}
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={project.demoLink}
                      target="_blank"
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#0a192f',
                        '&:hover': { backgroundColor: '#333' },
                      }}
                    >
                      View Demo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Project;
