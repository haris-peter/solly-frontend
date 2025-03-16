import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import HowItWorksSection from './components/HowItWorksSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import BeneficiariesSection from './components/BeneficiariesSection';
import GetInvolvedSection from './components/GetInvolvedSection';
import Footer from './components/Footer';
import PersonaScreen from './components/PersonaScreen';
import AudioInterface from './components/AudioInterface';
import DiaryEntry from './components/DiaryEntry';

function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <BeneficiariesSection />
      <WhyChooseUsSection />
      <GetInvolvedSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/persona-select" element={<PersonaScreen />} />
        <Route path="/audio-demo/:persona" element={<AudioInterface />} />
        <Route path="/diary-entry" element={<DiaryEntry />} />
      </Routes>
    </Router>
  );
}

export default App; 