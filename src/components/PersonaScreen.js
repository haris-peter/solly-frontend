import React from 'react';
import '../styles/PersonaScreen.css';
import { useNavigate } from 'react-router-dom';

function PersonaScreen() {
  const navigate = useNavigate();

  const handleSelectPersona = (persona) => {
    navigate(`/audio-demo/${persona}`);
  };

  return (
    <div className="persona-screen">
      <div className="container">
        <div className="persona-header">
          <h2>Select a Persona</h2>
          <p>Choose a persona to interact with the AI Companion</p>
        </div>
        
        <div className="persona-cards">
          <div 
            className="persona-card"
            onClick={() => handleSelectPersona('patient')}
          >
            <div className="persona-image">
              <img src="https://source.unsplash.com/random/300x300/?elderly,man" alt="Patient" />
            </div>
            <h3>Patient Experience</h3>
            <p>Experience how the AI companion helps Alzheimer's patients with memory recall and daily activities.</p>
            <button className="btn btn-primary">Select</button>
          </div>
          
          <div 
            className="persona-card"
            onClick={() => handleSelectPersona('caregiver')}
          >
            <div className="persona-image">
              <img src="https://source.unsplash.com/random/300x300/?caregiver" alt="Caregiver" />
            </div>
            <h3>Caregiver Dashboard</h3>
            <p>See how caregivers can monitor patient activities, health metrics, and receive important alerts.</p>
            <button className="btn btn-primary">Select</button>
          </div>
        </div>
        
        <div className="journal-button-container">
          <button 
            className="btn btn-journal"
            onClick={() => navigate('/diary-entry')}
          >
            <span className="journal-icon">📝</span>
            Open Memory Journal
          </button>
          <p className="journal-description">
            Record and analyze your daily thoughts, experiences, and memories to help strengthen cognitive function.
          </p>
        </div>
        
        <div className="back-button-container">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonaScreen; 