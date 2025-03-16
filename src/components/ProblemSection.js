import React from 'react';
import '../styles/ProblemSection.css';

function ProblemSection() {
  return (
    <section id="problem" className="section problem-section">
      <div className="container">
        <h2 className="section-title">A Helping Hand for Alzheimer's Patients & Caregivers</h2>
        
        <div className="problem-grid">
          <div className="problem-content">
            <div className="problem-item">
              <h3>Memory Loss and Cognitive Decline</h3>
              <p>Memory loss and cognitive decline make even the simplest daily tasks challenging for Alzheimer's patients, affecting their independence and quality of life.</p>
            </div>
            
            <div className="problem-item">
              <h3>Lack of Personalization</h3>
              <p>Existing solutions lack emotional intelligence and personalization, failing to adapt to the unique needs and preferences of each individual.</p>
            </div>
            
            <div className="problem-item">
              <h3>Caregiver Burden</h3>
              <p>Caregivers need continuous support to manage routine tasks, often leading to burnout and decreased quality of care over time.</p>
            </div>
          </div>
          
          <div className="problem-image">
            <img src="https://source.unsplash.com/random/600x800/?elderly,challenge" alt="Challenges faced by Alzheimer's patients" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection; 