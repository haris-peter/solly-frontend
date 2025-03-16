import React from 'react';
import '../styles/SolutionSection.css';

function SolutionSection() {
  return (
    <section id="solution" className="section solution-section">
      <div className="container">
        <h2 className="section-title">AI That Cares: Smart, Safe, and Supportive</h2>
        
        <div className="solution-grid">
          <div className="solution-card">
            <div className="solution-icon">🎙️</div>
            <h3>Personalized Storytelling</h3>
            <p>Engages users with AI-driven memory recall, creating personalized stories based on their life experiences and preferences.</p>
          </div>
          
          <div className="solution-card">
            <div className="solution-icon">🎭</div>
            <h3>Emotion Detection & Response</h3>
            <p>Adapts to user's mood in real-time, providing appropriate responses and support based on emotional state.</p>
          </div>
          
          <div className="solution-card">
            <div className="solution-icon">🏥</div>
            <h3>Health Monitoring & Alerts</h3>
            <p>Tracks vitals, detects anomalies, and immediately notifies caregivers of potential health concerns.</p>
          </div>
          
          <div className="solution-card">
            <div className="solution-icon">📅</div>
            <h3>Smart Reminders & Notifications</h3>
            <p>Keeps track of medication schedules, appointments, and daily routines with gentle, personalized reminders.</p>
          </div>
        </div>
        
        <div className="solution-demo">
          <img src="https://source.unsplash.com/random/1200x600/?technology,healthcare" alt="AI companion in action" />
        </div>
      </div>
    </section>
  );
}

export default SolutionSection; 