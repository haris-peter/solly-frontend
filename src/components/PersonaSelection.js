import React from 'react';
import '../styles/PersonaSelection.css';

function PersonaSelection({ onSelectPersona }) {
  return (
    <div className="persona-selection">
      <h2>Select a Persona</h2>
      <p>Choose a persona to interact with the AI Companion</p>
      
      <div className="persona-cards">
        <div 
          className="persona-card"
          onClick={() => onSelectPersona('patient')}
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
          onClick={() => onSelectPersona('caregiver')}
        >
          <div className="persona-image">
            <img src="https://source.unsplash.com/random/300x300/?caregiver" alt="Caregiver" />
          </div>
          <h3>Caregiver Dashboard</h3>
          <p>See how caregivers can monitor patient activities, health metrics, and receive important alerts.</p>
          <button className="btn btn-primary">Select</button>
        </div>
      </div>
    </div>
  );
}

export default PersonaSelection; 