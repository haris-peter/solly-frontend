import React from 'react';
import '../styles/WhyChooseUsSection.css';

function WhyChooseUsSection() {
  return (
    <section id="why-choose-us" className="section why-choose-section">
      <div className="container">
        <h2 className="section-title">What Makes Our AI Companion Unique?</h2>
        
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="comparison-cell">Features</div>
            <div className="comparison-cell">Our AI Companion</div>
            <div className="comparison-cell">Generic Alternatives</div>
          </div>
          
          <div className="comparison-row">
            <div className="comparison-cell feature">Storytelling</div>
            <div className="comparison-cell ours">
              <span className="check">✅</span>
              <span>Personalized AI Storytelling</span>
            </div>
            <div className="comparison-cell theirs">
              <span className="cross">❌</span>
              <span>Generic Voice Responses</span>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="comparison-cell feature">Emotion Recognition</div>
            <div className="comparison-cell ours">
              <span className="check">✅</span>
              <span>Real-time Emotion Recognition</span>
            </div>
            <div className="comparison-cell theirs">
              <span className="cross">❌</span>
              <span>Pre-set Responses</span>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="comparison-cell feature">Health Monitoring</div>
            <div className="comparison-cell ours">
              <span className="check">✅</span>
              <span>AI-Driven Health Monitoring</span>
            </div>
            <div className="comparison-cell theirs">
              <span className="cross">❌</span>
              <span>Limited Health Tracking</span>
            </div>
          </div>
          
          <div className="comparison-row">
            <div className="comparison-cell feature">Personalization</div>
            <div className="comparison-cell ours">
              <span className="check">✅</span>
              <span>Learns & Adapts to Individual</span>
            </div>
            <div className="comparison-cell theirs">
              <span className="cross">❌</span>
              <span>One-size-fits-all Approach</span>
            </div>
          </div>
        </div>
        
        <div className="cta-container">
          <h3>Ready to experience the difference?</h3>
          <a href="#beta" className="btn btn-primary">Join Our Beta Program!</a>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUsSection; 