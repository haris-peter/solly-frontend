import React from 'react';
import '../styles/HowItWorksSection.css';

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section how-works-section">
      <div className="container">
        <h2 className="section-title">Simple & Seamless Interaction</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Detect</h3>
              <p>AI recognizes voice, emotions, and facial expressions to understand the user's current state and needs.</p>
            </div>
            <div className="step-image">
              <img src="https://source.unsplash.com/random/400x300/?emotion,detection" alt="AI detection" />
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Engage</h3>
              <p>The system tells personalized stories, asks questions, and engages in meaningful conversation based on user preferences.</p>
            </div>
            <div className="step-image">
              <img src="https://source.unsplash.com/random/400x300/?conversation,elderly" alt="AI engagement" />
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Monitor</h3>
              <p>Tracks health data and behavioral patterns, alerting caregivers if unusual patterns are detected.</p>
            </div>
            <div className="step-image">
              <img src="https://source.unsplash.com/random/400x300/?health,monitoring" alt="Health monitoring" />
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Remind</h3>
              <p>Sends smart notifications for medications, appointments, and daily routines in a gentle, non-intrusive manner.</p>
            </div>
            <div className="step-image">
              <img src="https://source.unsplash.com/random/400x300/?reminder,calendar" alt="Smart reminders" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection; 