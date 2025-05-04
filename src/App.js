import React from 'react';
import './style.css';
import { Element } from 'react-scroll';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Project from './components/Project';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth='lg'>
      <div style={{ paddingTop: '64px' }}>
        <Element name="home"><Home /></Element>
        <Element name="about"><About /></Element>
        <Element name="project"><Project /></Element>
        <Element name="contact"><Contact /></Element>
      </div>
      </Container>
      <Footer/>
    </>
  );
}

export default App;
