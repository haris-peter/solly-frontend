import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroSection.css';

function HeroSection() {
  const navigate = useNavigate();

  const handleDemoClick = (e) => {
    e.preventDefault();
    navigate('/persona-select');
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Empowering Lives with AI: A Smart Companion for Alzheimer's Patients</h1>
          <p className="hero-subtitle">Enhancing memory, well-being, and daily life through AI-driven storytelling, health monitoring, and interactive engagement.</p>
          <div className="hero-buttons">
            <a href="#learn-more" className="btn btn-primary">Learn More</a>
            <a href="#demo" className="btn btn-secondary" onClick={handleDemoClick}>View Demo</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://source.unsplash.com/random/600x400/?elderly,technology" alt="Elderly person interacting with AI companion" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection; 