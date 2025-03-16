import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <h3>AI Companion</h3>
            <p>Empowering lives with AI-driven support for Alzheimer's patients and caregivers.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f">F</i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter">T</i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in">L</i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram">I</i></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#problem">The Problem</a></li>
              <li><a href="#solution">Our Solution</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#beneficiaries">Who Can Benefit</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#research">Research</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: info@aicompanion.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Address: 123 Innovation Drive, Tech City, TC 12345</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AI Companion for Alzheimer's Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 