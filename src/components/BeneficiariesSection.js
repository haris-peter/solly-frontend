import React from 'react';
import '../styles/BeneficiariesSection.css';

function BeneficiariesSection() {
  return (
    <section id="beneficiaries" className="section beneficiaries-section">
      <div className="container">
        <h2 className="section-title">Who Can Benefit?</h2>
        
        <div className="beneficiaries-grid">
          <div className="beneficiary-card">
            <div className="beneficiary-icon">👵🏻</div>
            <h3>Individuals with Alzheimer's</h3>
            <p>Our AI companion provides personalized support, stimulation, and assistance for those experiencing memory loss and cognitive decline.</p>
          </div>
          
          <div className="beneficiary-card">
            <div className="beneficiary-icon">👨‍⚕️</div>
            <h3>Caregivers & Families</h3>
            <p>Reduces caregiver burden by providing continuous support, monitoring, and alerts, allowing for more quality time with loved ones.</p>
          </div>
          
          <div className="beneficiary-card">
            <div className="beneficiary-icon">🏥</div>
            <h3>Healthcare Providers</h3>
            <p>Hospitals, nursing homes, and assisted living facilities can offer enhanced care with 24/7 AI monitoring and support.</p>
          </div>
          
          <div className="beneficiary-card">
            <div className="beneficiary-icon">🧪</div>
            <h3>Research & Data Science</h3>
            <p>Contributes to advancements in AI healthcare monitoring, providing valuable insights for Alzheimer's research.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BeneficiariesSection; 