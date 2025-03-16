import React, { useEffect, useState, useRef } from 'react';
import '../styles/FluidAudioBall.css';

const FluidAudioBall = ({ isListening, amplitude = 0.5 }) => {
  const [activeHue, setActiveHue] = useState(260); // Purple hue to start with
  const [turbulenceFrequency, setTurbulenceFrequency] = useState(0.01);
  const [turbulenceScale, setTurbulenceScale] = useState(5);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [noiseOffset, setNoiseOffset] = useState(0);
  const [blobScale, setBlobScale] = useState(1);
  
  const containerRef = useRef(null);
  const blobRef = useRef(null);
  const animationRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);
  
  // Handle pointer movement for interactive distortion
  const handlePointerMove = (e) => {
    if (!containerRef.current || !isListening) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate normalized coordinates (-1 to 1)
    const x = ((e.clientX - rect.left) - centerX) / centerX;
    const y = ((e.clientY - rect.top) - centerY) / centerY;
    
    setPointerPosition({ x, y });
    setIsInteracting(true);
    
    // Update turbulence parameters based on distance from center
    const distance = Math.sqrt(x * x + y * y);
    if (distance < 1.5) { // Limit range of effect
      setTurbulenceFrequency(0.01 + distance * 0.015);
      setTurbulenceScale(5 + distance * 10);
    }
  };
  
  const handlePointerLeave = () => {
    setIsInteracting(false);
    
    // Reset turbulence parameters gradually
    setTimeout(() => {
      if (!isInteracting) {
        setTurbulenceFrequency(0.01);
        setTurbulenceScale(5);
      }
    }, 500);
  };
  
  const handlePointerDown = () => {
    // Pulse effect on click/touch
    setBlobScale(1.1);
    setTimeout(() => setBlobScale(1), 300);
    
    // Trigger a wave of turbulence
    setTurbulenceScale(25);
    setTurbulenceFrequency(0.03);
    
    setTimeout(() => {
      if (!isInteracting) {
        setTurbulenceFrequency(0.01);
        setTurbulenceScale(5);
      }
    }, 800);
  };
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add event listeners
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      // Clean up listeners
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isListening, isInteracting]);
  
  // Dynamic color effect based on amplitude and interaction
  useEffect(() => {
    if (isListening) {
      // Shift hue based on amplitude (from purple toward warmer colors)
      const baseHue = 260;
      const hueShift = amplitude * 50; // More amplitude = warmer color
      const interactionBoost = isInteracting ? 20 : 0; // Additional shift when interacting
      
      setActiveHue((baseHue - hueShift + interactionBoost) % 360);
    }
  }, [isListening, amplitude, isInteracting]);
  
  // Update SVG filter values in real-time
  useEffect(() => {
    if (!turbulenceRef.current || !displacementRef.current) return;
    
    // Update turbulence parameters
    turbulenceRef.current.setAttribute('baseFrequency', `${turbulenceFrequency} ${turbulenceFrequency}`);
    displacementRef.current.setAttribute('scale', turbulenceScale.toString());
    
  }, [turbulenceFrequency, turbulenceScale]);
  
  // Animate the noise offset for continuous organic movement
  useEffect(() => {
    if (!isListening) return;
    
    let prevTimestamp = 0;
    
    const animateNoise = (timestamp) => {
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = prevTimestamp ? (timestamp - prevTimestamp) / 1000 : 0.016;
      prevTimestamp = timestamp;
      
      // Update noise offset for continuous movement
      setNoiseOffset(prev => (prev + deltaTime * 0.5) % 1000);
      
      // Gradually return turbulence to base values when not interacting
      if (!isInteracting) {
        setTurbulenceFrequency(prev => {
          const target = 0.01;
          return prev + (target - prev) * deltaTime * 2;
        });
        
        setTurbulenceScale(prev => {
          const baseScale = 5;
          const amplitudeEffect = amplitude * 10; // Scale increases with amplitude
          const target = baseScale + amplitudeEffect;
          return prev + (target - prev) * deltaTime * 2;
        });
      }
      
      animationRef.current = requestAnimationFrame(animateNoise);
    };
    
    animationRef.current = requestAnimationFrame(animateNoise);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isInteracting, amplitude]);
  
  // Primary and secondary colors for gradient
  const primaryColor = `hsl(${activeHue}, 80%, 65%)`;
  const secondaryColor = `hsl(${activeHue - 30}, 70%, 45%)`;
  const accentColor = `hsl(${activeHue + 60}, 90%, 75%)`;
  
  return (
    <div 
      ref={containerRef}
      className={`organic-container ${isListening ? 'active' : ''} ${isInteracting ? 'interacting' : ''}`}
      style={{ 
        cursor: isListening ? 'pointer' : 'default',
      }}
    >
      <div 
        className="organic-blob-wrapper"
        style={{
          transform: `scale(${blobScale})`,
        }}  
      >
        {/* Main SVG with filter effects */}
        <svg
          viewBox="0 0 300 300"
          className="organic-blob"
          ref={blobRef}
          style={{
            filter: isListening ? 'url(#organic-turbulence)' : 'none',
          }}
        >
          {/* Define filters */}
          <defs>
            <filter id="organic-turbulence" x="-50%" y="-50%" width="200%" height="200%">
              {/* Base turbulence that moves over time */}
              <feTurbulence 
                ref={turbulenceRef}
                type="fractalNoise" 
                baseFrequency={`${turbulenceFrequency} ${turbulenceFrequency}`}
                numOctaves="3" 
                seed="5"
                result="noise"
                stitchTiles="stitch"
              >
                <animate 
                  attributeName="seed" 
                  from="0" 
                  to="100" 
                  dur="20s" 
                  repeatCount="indefinite"
                />
              </feTurbulence>
              
              {/* Displacement using the noise */}
              <feDisplacementMap 
                ref={displacementRef}
                in="SourceGraphic" 
                in2="noise" 
                scale={turbulenceScale} 
                xChannelSelector="R" 
                yChannelSelector="G"
                result="displacedNoise"
              />
              
              {/* Gaussian blur for a softer look */}
              <feGaussianBlur 
                in="displacedNoise" 
                stdDeviation="6" 
                result="blurredNoise"
              />
              
              {/* Composite layers */}
              <feComposite 
                in="blurredNoise" 
                in2="SourceGraphic" 
                operator="atop" 
                result="compositedBlur"
              />
              
              {/* Enhance colors */}
              <feColorMatrix 
                type="matrix" 
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 1.5 -0.2"
                result="enhancedColors"
              />
              
              {/* Add a glow */}
              <feGaussianBlur 
                in="enhancedColors" 
                stdDeviation="4" 
                result="glow"
              />
              <feComposite 
                in="glow" 
                in2="enhancedColors" 
                operator="lighter" 
                result="finalGlow"
              />
            </filter>
            
            {/* Radial gradient for the blob */}
            <radialGradient id="organic-gradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="40%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </radialGradient>
            
            {/* Pattern overlay for texture */}
            <pattern id="noisePattern" width="100%" height="100%" patternUnits="userSpaceOnUse">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="300" height="300" filter="url(#noise)" opacity="0.4" />
            </pattern>
          </defs>
          
          {/* Main blob shape */}
          <g transform="translate(150, 150)">
            {/* Base circle with gradient */}
            <circle 
              cx="0" 
              cy="0" 
              r="100" 
              fill="url(#organic-gradient)"
              className="blob-base"
            />
            
            {/* Texture overlay */}
            <circle 
              cx="0" 
              cy="0" 
              r="110" 
              fill="url(#noisePattern)"
              className="blob-texture"
              opacity="0.2"
            />
            
            {/* Inner glow effect */}
            <circle 
              cx="0" 
              cy="0" 
              r="80" 
              fill="none" 
              stroke={accentColor} 
              strokeWidth="20"
              opacity="0.15"
              className="blob-inner-glow"
            />
            
            {/* Highlight */}
            <ellipse 
              cx="-25" 
              cy="-30" 
              rx="55" 
              ry="45" 
              fill="white" 
              opacity="0.2"
              className="blob-highlight"
            />
          </g>
        </svg>
        
        {/* Pulse ripples */}
        <div className="ripple-effect"></div>
        <div className="ripple-effect delay-1"></div>
        <div className="ripple-effect delay-2"></div>
        
        {/* Inner particle effects */}
        <div className="particle-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="organic-particle"
              style={{
                animationDelay: `${i * 0.3}s`,
                backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Interactive hint for users */}
      {isListening && (
        <div className="interaction-hint">
          Move mouse to interact
        </div>
      )}
    </div>
  );
};

export default FluidAudioBall; 