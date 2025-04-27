import React from 'react';
import { Element } from 'react-scroll';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skill from './components/Skill';
import Project from './components/Project';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <Element name="home"><Home /></Element>
        <Element name="about"><About /></Element>
        <Element name="skill"><Skill /></Element>
        <Element name="project"><Project /></Element>
        <Element name="contact"><Contact /></Element>
      </div>
      <Footer/>
    </>
  );
}

export default App;
