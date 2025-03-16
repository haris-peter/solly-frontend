import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/OrganicAudioBall.css';

const OrganicAudioBall = ({ isListening, amplitude = 0 }) => {
  // Visual state
  const [activeHue, setActiveHue] = useState(260); // Start with purple
  const [turbulenceFrequency, setTurbulenceFrequency] = useState(0.01);
  const [turbulenceScale, setTurbulenceScale] = useState(4);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [noiseOffset, setNoiseOffset] = useState(0);
  const [blobScale, setBlobScale] = useState(1);

  // References
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Generate a set of random particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 8 }, () => ({
      hue: Math.floor(Math.random() * 60) + 220, // Bluish purple range
      alpha: Math.random() * 0.3 + 0.2,
    }));
  }, []);

  // Animation loop for smooth effects
  const animate = useCallback(() => {
    setNoiseOffset(prev => prev + 0.005);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Setup and cleanup animation loop
  useEffect(() => {
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Update effects based on listening state and amplitude
  useEffect(() => {
    if (isListening) {
      // Scale effect when active
      setBlobScale(1 + Math.min(amplitude / 200, 0.2));
      
      // Dynamic turbulence based on amplitude
      const newFreq = 0.01 + Math.min(amplitude / 300, 0.03);
      setTurbulenceFrequency(newFreq);
      
      // Dynamic scale based on amplitude
      const newScale = 4 + Math.min(amplitude / 100, 10);
      setTurbulenceScale(newScale);
      
      // Shift color based on amplitude
      const hueShift = Math.min(amplitude / 10, 40);
      setActiveHue(260 + hueShift);
    } else {
      // Reset to default state when not listening
      setBlobScale(1);
      setTurbulenceFrequency(0.01);
      setTurbulenceScale(4);
      setActiveHue(260);
    }
  }, [isListening, amplitude]);

  // Event handlers for interaction
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setPointerPosition({ x, y });
    
    // Additional distortion based on pointer position
    const distortionX = (x - 0.5) * 2; // -1 to 1
    const distortionY = (y - 0.5) * 2; // -1 to 1
    const distanceFromCenter = Math.sqrt(distortionX * distortionX + distortionY * distortionY);
    
    // Increase turbulence when pointer is near the blob
    if (distanceFromCenter < 0.8) {
      const interactionIntensity = 1 - distanceFromCenter / 0.8;
      setTurbulenceFrequency(prev => 0.01 + interactionIntensity * 0.03);
      setTurbulenceScale(prev => 4 + interactionIntensity * 8);
      setIsInteracting(true);
    } else {
      setIsInteracting(false);
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsInteracting(false);
    // Smoothly return to default state
    setTurbulenceFrequency(0.01);
    setTurbulenceScale(4);
  }, []);

  const handlePointerDown = useCallback(() => {
    // Create a click distortion effect
    setTurbulenceFrequency(prev => prev + 0.05);
    setTurbulenceScale(prev => prev + 15);
    
    // Create a subtle scale effect
    setBlobScale(prev => prev * 1.1);
    
    // Smoothly return to normal
    setTimeout(() => {
      setTurbulenceFrequency(isInteracting ? 0.04 : 0.01);
      setTurbulenceScale(isInteracting ? 12 : 4);
      setBlobScale(isListening ? 1 + Math.min(amplitude / 200, 0.2) : 1);
    }, 300);
  }, [isInteracting, isListening, amplitude]);

  // Filter IDs for unique references
  const filterId = `organic-turbulence-${Math.floor(Math.random() * 1000)}`;
  const displacementId = `organic-displacement-${Math.floor(Math.random() * 1000)}`;
  const gradientId = `organic-gradient-${Math.floor(Math.random() * 1000)}`;
  const patternId = `organic-pattern-${Math.floor(Math.random() * 1000)}`;

  return (
    <div 
      ref={containerRef}
      className={`organic-container ${isListening ? 'active' : ''} ${isInteracting ? 'interacting' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      <div className="organic-blob-wrapper" style={{ transform: `scale(${blobScale})` }}>
        <svg 
          className="organic-blob" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define filters */}
          <defs>
            {/* Turbulence filter */}
            <filter id={filterId}>
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency={turbulenceFrequency} 
                numOctaves="3" 
                seed="3"
                stitchTiles="stitch"
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                scale={turbulenceScale}
              />
            </filter>
            
            {/* Displacement map for organic shape */}
            <filter id={displacementId}>
              <feTurbulence 
                type="turbulence" 
                baseFrequency="0.01" 
                numOctaves="3" 
                result="turbulence" 
                seed={Math.floor(noiseOffset * 100)}
              />
              <feDisplacementMap 
                in="SourceGraphic" 
                in2="turbulence" 
                scale="20"
                xChannelSelector="R" 
                yChannelSelector="G"
              />
            </filter>
            
            {/* Gradient for blob */}
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={`hsl(${activeHue}, 70%, 60%)`} stopOpacity="0.9" />
              <stop offset="70%" stopColor={`hsl(${activeHue - 20}, 80%, 40%)`} stopOpacity="0.6" />
              <stop offset="100%" stopColor={`hsl(${activeHue - 40}, 90%, 20%)`} stopOpacity="0.3" />
            </radialGradient>
            
            {/* Pattern overlay for texture */}
            <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="40" height="40" fill={`hsla(${activeHue + 10}, 70%, 60%, 0.05)`} />
              <circle cx="20" cy="20" r="15" fill={`hsla(${activeHue - 10}, 90%, 70%, 0.1)`} />
            </pattern>
          </defs>
          
          {/* Base circle with noise displacement */}
          <circle 
            className="blob-base"
            cx="100" 
            cy="100" 
            r="80" 
            fill={`url(#${gradientId})`}
            filter={`url(#${filterId})`}
            style={{ 
              transform: `translate(${(pointerPosition.x - 0.5) * 10}px, ${(pointerPosition.y - 0.5) * 10}px)`,
            }}
          />
          
          {/* Texture overlay */}
          <circle 
            className="blob-texture"
            cx="100" 
            cy="100" 
            r="80" 
            fill={`url(#${patternId})`}
            filter={`url(#${displacementId})`}
            style={{ opacity: isListening ? 0.7 : 0.3 }}
          />
          
          {/* Inner glow effect */}
          <circle 
            className="blob-inner-glow"
            cx="100" 
            cy="100" 
            r="60" 
            fill="none"
            stroke={`hsla(${activeHue + 20}, 90%, 70%, 0.2)`}
            strokeWidth="20"
            filter="blur(10px)"
          />
          
          {/* Highlight blob */}
          <ellipse 
            className="blob-highlight"
            cx="80" 
            cy="80" 
            rx="30" 
            ry="25" 
            fill={`hsla(${activeHue + 30}, 90%, 80%, 0.2)`}
            filter="blur(8px)"
          />
        </svg>
        
        {/* Pulse ripples */}
        <div className="ripple-effect"></div>
        <div className="ripple-effect delay-1"></div>
        <div className="ripple-effect delay-2"></div>
        
        {/* Inner particles */}
        <div className="particle-container">
          {particlesRef.current.map((particle, i) => (
            <div 
              key={i}
              className="organic-particle"
              style={{ backgroundColor: `hsla(${particle.hue}, 70%, 70%, ${particle.alpha})` }}
            />
          ))}
        </div>
      </div>
      
      <div className="interaction-hint">
        Click or move to interact
      </div>
    </div>
  );
};

export default OrganicAudioBall; 