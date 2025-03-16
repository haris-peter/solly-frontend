import React from 'react';
import '../styles/GetInvolvedSection.css';

function GetInvolvedSection() {
  return (
    <section id="get-involved" className="section get-involved-section">
      <div className="container">
        <h2 className="section-title">Be Part of the Future of Alzheimer's Care</h2>
        
        <div className="get-involved-content">
          <div className="get-involved-text">
            <p>Join us in our mission to improve the lives of Alzheimer's patients and their caregivers through innovative AI technology. Your involvement can make a difference in shaping the future of care.</p>
            
            <div className="action-buttons">
              <a href="#signup" className="btn btn-primary">Sign Up for Updates</a>
              <a href="#contact" className="btn btn-secondary">Contact Us</a>
              <a href="#demo" className="btn btn-secondary">Request a Demo</a>
            </div>
          </div>
          
          <div className="testimonials">
            <h3>What Healthcare Professionals Say</h3>
            
            <div className="testimonial">
              <p>"This AI companion has revolutionized how we provide care for Alzheimer's patients. The personalized engagement keeps patients more active and responsive."</p>
              <div className="testimonial-author">
                <strong>Dr. Sarah Johnson</strong>
                <span>Neurologist, Boston Medical Center</span>
              </div>
            </div>
            
            <div className="testimonial">
              <p>"The health monitoring features give us valuable insights that help improve patient care and reduce emergency situations."</p>
              <div className="testimonial-author">
                <strong>Michael Torres</strong>
                <span>Care Facility Director</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetInvolvedSection; 