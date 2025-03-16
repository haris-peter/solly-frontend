import React, { useEffect, useRef, useState } from 'react';
import '../styles/CanvasAudioBall.css';

const CanvasAudioBall = ({ isListening, amplitude }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastAudioRef = useRef({ bass: 0, mid: 0, treble: 0, volume: 0 });
  const [hoverState, setHoverState] = useState(false);
  
  const getAudioData = () => {
    // When no amplitude is provided or not listening, return base values
    if (!isListening || amplitude === undefined) {
      return { bass: 0, mid: 0, treble: 0, volume: 0 };
    }
    
    // Convert flat amplitude to frequency bands
    // This is a simplified simulation since we don't have real frequency data
    const normalizedAmplitude = amplitude / 100; // Convert to 0-1 range
    
    // Simulate different frequency responses
    const bass = Math.min(normalizedAmplitude * 1.2, 1); // Bass is stronger
    const mid = normalizedAmplitude * 0.9;
    const treble = normalizedAmplitude * 0.7;
    const volume = normalizedAmplitude;

    // Smooth the transitions
    lastAudioRef.current = {
      bass: lastAudioRef.current.bass * 0.8 + bass * 0.2,
      mid: lastAudioRef.current.mid * 0.8 + mid * 0.2,
      treble: lastAudioRef.current.treble * 0.8 + treble * 0.2,
      volume: lastAudioRef.current.volume * 0.8 + volume * 0.2
    };

    return lastAudioRef.current;
  };

  const drawFluidBall = (
    ctx,
    centerX,
    centerY,
    radius,
    time,
    audio
  ) => {
    const points = [];
    const numPoints = 180;
    
    // Generate points for the fluid shape
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      let r = radius;

      if (isListening) {
        // When listening, morph based on audio
        const bassDeform = Math.sin(angle * 2 + time) * radius * 0.3 * audio.bass;
        const midDeform = Math.sin(angle * 4 + time * 1.5) * radius * 0.2 * audio.mid;
        const trebleDeform = Math.sin(angle * 6 + time * 2) * radius * 0.1 * audio.treble;
        
        r += bassDeform + midDeform + trebleDeform;
      } else {
        // When not listening, simple gentle fluid motion
        r += Math.sin(angle * 3 + time) * radius * 0.05;
        r += Math.sin(angle * 4 - time * 0.8) * radius * 0.03;
      }

      points.push([
        centerX + r * Math.cos(angle),
        centerY + r * Math.sin(angle)
      ]);
    }

    // Draw the shape with gradient
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    
    // Smooth curve through points
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2;
      const yc = (points[i][1] + points[i + 1][1]) / 2;
      ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc);
    }
    
    ctx.closePath();

    // Create dynamic gradient based on audio
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * (1 + audio.volume)
    );

    if (isListening) {
      // Dynamic colors when listening - purple theme from the app
      const r = Math.floor(106 + audio.bass * 50);
      const g = Math.floor(90 + audio.mid * 40);
      const b = Math.floor(205 + audio.treble * 50);
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
      gradient.addColorStop(0.5, `rgba(${r * 0.8}, ${g * 0.8}, ${b}, 0.7)`);
      gradient.addColorStop(1, `rgba(${r * 0.6}, ${g * 0.6}, ${b}, 0.1)`);
    } else {
      // Default purple colors when idle - matching site theme
      gradient.addColorStop(0, 'rgba(106, 90, 205, 0.8)');
      gradient.addColorStop(0.5, 'rgba(88, 73, 192, 0.5)');
      gradient.addColorStop(1, 'rgba(70, 56, 170, 0.1)');
    }

    // Draw glow effect
    ctx.save();
    ctx.filter = 'blur(15px)';
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    // Draw main shape with sharper edges
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw inner highlight
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.2, centerY - radius * 0.2, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = isListening 
      ? `rgba(255, 255, 255, ${0.15 + audio.volume * 0.2})`
      : 'rgba(255, 255, 255, 0.15)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.restore();
    
    // Draw outer glow pulse when active
    if (isListening || hoverState) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (1.2 + audio.volume * 0.3), 0, Math.PI * 2);
      ctx.strokeStyle = isListening 
        ? `rgba(106, 90, 205, ${0.2 + audio.volume * 0.3})`
        : 'rgba(106, 90, 205, 0.15)';
      ctx.lineWidth = radius * 0.1;
      ctx.filter = 'blur(15px)';
      ctx.stroke();
      ctx.restore();
    }
  };

  const draw = (ctx, timestamp) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    timeRef.current = timestamp * 0.001;
    const audio = getAudioData();
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.2;

    // Draw the main fluid ball
    drawFluidBall(
      ctx,
      centerX,
      centerY,
      baseRadius * (1 + audio.volume * 0.3),
      timeRef.current,
      audio
    );
  };

  const animate = (timestamp) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      draw(ctx, timestamp);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      // Set to parent div size for responsive layout
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        const size = Math.min(window.innerWidth, 400);
        canvas.width = size;
        canvas.height = size;
      }
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas.parentElement);
    window.addEventListener('resize', updateSize);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="canvas-ball-container"
         onMouseEnter={() => setHoverState(true)}
         onMouseLeave={() => setHoverState(false)}>
      <canvas
        ref={canvasRef}
        className={`canvas-audio-ball ${isListening ? 'active' : ''}`}
      />
      
      {/* No label needed anymore since we use separate buttons now */}
      
      {/* Ripple effects - controlled by isListening prop */}
      <div className={`ripple-ring ${isListening ? 'active' : ''}`}></div>
      <div className={`ripple-ring delayed ${isListening ? 'active' : ''}`}></div>
    </div>
  );
};

export default CanvasAudioBall; 