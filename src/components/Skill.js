import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaGitAlt,
  FaGithub,
} from "react-icons/fa";
import {
  SiMongodb,
  SiRedux,
  SiMysql,
  SiPython,
  SiBootstrap,
} from "react-icons/si";


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const MuiLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 476.6"
    width="100"
    height="80"
    role="img"
    aria-label="Material UI Logo"
  >
    <title>Material UI Logo</title>
    <path
      fill="#007FFF"
      d="M0 259.66L149.29 172.9v-91.6L0 168.07v91.6zM149.29 345.77L0 259.66v91.6l149.29 86.7v-91.6zM298.57 432.43L149.29 345.77v91.6l149.28 86.7v-91.6zM149.29 0v91.6l149.28 86.7v-91.6L149.29 0zM447.86 86.7L298.57 0v91.6l149.29 86.7v-91.6zM298.57 259.66l-149.28-86.7v91.6l149.28 86.7v-91.6zM298.57 259.66v91.6l149.29-86.7v-91.6l-149.29 86.7zM447.86 345.77v-91.6l-149.29 86.7v91.6l149.29-86.7zM447.86 172.9l149.28-86.7v-91.6l-149.28 86.7v91.6zM298.57 259.66L447.86 172.9v-91.6L298.57 168.07v91.6z"
    />
  </svg>
);



const skills = [
  { name: "HTML5", icon: <FaHtml5 color="#E44D26" size={40} /> },
  { name: "CSS3", icon: <FaCss3Alt color="#1572B6" size={40} /> },
  { name: "JavaScript", icon: <FaJs color="#F7DF1E" size={40} /> },
  { name: "React JS", icon: <FaReact color="#61DAFB" size={40} /> },
  { name: "Redux", icon: <SiRedux color="#764ABC" size={40} /> },
  { name: "Bootstrap", icon: <SiBootstrap color="#7952B3" size={40} /> },
  { name: "MongoDB", icon: <SiMongodb color="#47A248" size={40} /> },
  { name: "MySQL", icon: <SiMysql color="#00758F" size={40} /> },
  { name: "Python", icon: <SiPython color="#3776AB" size={40} /> },
  { name: "Git", icon: <FaGitAlt color="#F05032" size={40} /> },
  { name: "GitHub", icon: <FaGithub color="#181717" size={40} /> },
  { name: "Material UI 5", icon: <MuiLogo size={40} /> },
];

export default function Skill() {
  return (
    <Box sx={{ py: 8, px: 2, }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Skills
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="center" >
        {skills.map((skill, index) => (
          <Grid item key={index} size={{ xs: 1, sm: 2, md: 2 }}>
            <motion.div
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: 140,
                  width: "80%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {skill.icon}
                <Typography variant="subtitle1" mt={1}>
                  {skill.name}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
