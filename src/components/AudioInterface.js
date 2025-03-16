import React, { useState, useRef, useEffect } from 'react';
// Remove the problematic import
// import { FaMicrophone, FaStop, FaVolumeUp } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasAudioBall from './CanvasAudioBall';
import '../styles/AudioInterface.css';

// Define SVG icons as components
const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" width="16" height="16" fill="currentColor">
    <path d="M176 352c53.02 0 96-42.98 96-96V96c0-53.02-42.98-96-96-96S80 42.98 80 96v160c0 53.02 42.98 96 96 96zm160-160h-16c-8.84 0-16 7.16-16 16v48c0 74.8-64.49 134.82-140.79 127.38C96.71 376.89 48 317.11 48 250.3V208c0-8.84-7.16-16-16-16H16c-8.84 0-16 7.16-16 16v40.16c0 89.64 63.97 169.55 152 181.69V464H96c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16h-56v-33.77C285.71 418.47 352 344.9 352 256v-48c0-8.84-7.16-16-16-16z"/>
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
    <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/>
  </svg>
);

const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512" width="16" height="16" fill="currentColor">
    <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"/>
  </svg>
);

function AudioInterface() {
  const { persona } = useParams();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [noiseWarning, setNoiseWarning] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [waveformAmplitude, setWaveformAmplitude] = useState(0);
  const [responseText, setResponseText] = useState('');
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Set welcome text based on persona
  useEffect(() => {
    setResponseText(
      persona === 'patient' 
        ? "I'm your AI companion. Press the microphone button to ask me about your day, medications, or family."
        : "I'm the caregiver assistant. Press the microphone button to ask about patient status, schedules, or care instructions."
    );
  }, [persona]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    // Set up event handlers
    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      
      if (final) {
        setTranscript(prev => prev + ' ' + final);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        setNoiseWarning(true);
        setTimeout(() => setNoiseWarning(false), 3000);
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        // If we're still supposed to be listening, restart
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error('Could not restart recognition', e);
        }
      }
    };
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);

  // Set up audio context and analyzer for real-time audio visualization
  const setupAudioContext = async () => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      
      // Set up analyzer node
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      // Connect microphone to analyzer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Start monitoring audio levels
      startAudioMonitoring();
      
      return true;
    } catch (error) {
      console.error('Error setting up audio context:', error);
      return false;
    }
  };
  
  // Monitor audio levels in real-time
  const startAudioMonitoring = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    let smoothedAmplitude = 0;
    const smoothingFactor = 0.3;
    
    const updateAudioData = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average amplitude from frequency data
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Normalize to 0-1 range
      const normalized = average / 256;
      
      // Apply smoothing for more natural transitions
      smoothedAmplitude = smoothedAmplitude * (1 - smoothingFactor) + normalized * smoothingFactor;
      
      // Set waveform amplitude for visualization
      setWaveformAmplitude(0.3 + (smoothedAmplitude * 0.7));
      
      // Update progress
      setAudioProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 0.1;
      });
      
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateAudioData);
  };
  
  // Clean up audio context
  const cleanupAudioContext = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
  };

  // Handle start listening
  const handleStartListening = async () => {
    setAudioProgress(0);
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);
    
    // Initialize audio context for visualization
    const audioContextInitialized = await setupAudioContext();
    
    if (!audioContextInitialized) {
      console.error('Failed to initialize audio context');
      return;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Error starting speech recognition', e);
      }
    }
  };

  const handleStopListening = () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition', e);
      }
    }
    
    cleanupAudioContext();
    
    // Process the transcript and generate a response
    if (transcript) {
      setTimeout(() => {
        const lowerTranscript = transcript.toLowerCase();
        
        // Simple response generation based on recognized keywords
        if (persona === 'patient') {
          if (lowerTranscript.includes('day') || lowerTranscript.includes('time') || lowerTranscript.includes('date')) {
            const now = new Date();
            setResponseText(`Today is ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. The time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`);
          } else if (lowerTranscript.includes('medication') || lowerTranscript.includes('medicine') || lowerTranscript.includes('pill')) {
            setResponseText("It's time for your afternoon medication. You need to take the blue pill with a full glass of water.");
          } else if (lowerTranscript.includes('family') || lowerTranscript.includes('daughter') || lowerTranscript.includes('son')) {
            setResponseText("Your daughter Sarah is coming to visit this weekend. She's bringing your grandchildren Emma and Jack.");
          } else {
            setResponseText("I'm here to help you with any questions about your day, medications, or family. Is there something specific you'd like to know?");
          }
        } else {
          // Caregiver responses
          if (lowerTranscript.includes('status') || lowerTranscript.includes('report')) {
            setResponseText("Patient has taken all scheduled medications today. Vital signs are within normal ranges. Activity level has been moderate.");
          } else if (lowerTranscript.includes('schedule') || lowerTranscript.includes('appointment')) {
            setResponseText("The next doctor's appointment is on Tuesday at 2:30 PM with Dr. Johnson. Transportation has been arranged.");
          } else if (lowerTranscript.includes('medication') || lowerTranscript.includes('medicine')) {
            setResponseText("The patient needs to take 1 tablet of Donepezil at 8:00 PM with food. Please ensure proper hydration.");
          } else {
            setResponseText("I can provide updates on patient status, scheduled appointments, and medication requirements. What would you like to know?");
          }
        }
      }, 1000);
    }
  };

  // Set up animation loop even when not listening
  useEffect(() => {
    // Create a simple animation loop for the always-on visual
    let animationValue = 0;
    const baseAmplitude = 0.2;
    
    const animateVisual = () => {
      // Simple sine wave animation
      animationValue += 0.05;
      const amplitude = baseAmplitude + Math.sin(animationValue) * 0.1;
      
      // Only update if not actively listening (otherwise the real amplitude is used)
      if (!isListening) {
        setWaveformAmplitude(amplitude);
      }
      
      animationFrameRef.current = requestAnimationFrame(animateVisual);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateVisual);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);

  return (
    <div className="audio-screen">
      <div className="audio-overlay always-on">
        <div className="audio-overlay-content">
          <div className="audio-overlay-header">
            <h3>{isListening ? "Listening..." : "Ready to Listen"}</h3>
            <p>{isListening ? "Speak clearly into your microphone" : "Click the microphone to start"}</p>
          </div>

          <div className="overlay-canvas-container">
            <CanvasAudioBall 
              isListening={isListening} 
              amplitude={waveformAmplitude}
              size={300}
            />
          </div>

          <div className="audio-controls overlay-controls">
            {isListening ? (
              <button 
                className="stop-button"
                onClick={handleStopListening}
                aria-label="Stop listening"
              >
                <span className="stop-icon"><StopIcon /></span>
                Stop Listening
              </button>
            ) : (
              <button 
                className="audio-button primary large-button"
                onClick={handleStartListening}
                aria-label="Start listening"
              >
                <span className="button-icon"><MicrophoneIcon /></span>
                Start Listening
              </button>
            )}
            
            <button 
              className="audio-button secondary"
              onClick={() => navigate('/persona-select')}
            >
              Change Persona
            </button>
          </div>

          <div className="overlay-transcript">
            {transcript || interimTranscript ? (
              <>
                {transcript && <p className="transcript-content">{transcript}</p>}
                {interimTranscript && <p className="transcript-content interim">{interimTranscript}</p>}
              </>
            ) : (
              <p className="transcript-placeholder">Your speech will appear here...</p>
            )}
          </div>

          {isListening && (
            <div className="audio-progress">
              <div className="audio-progress-bar">
                <div 
                  className="audio-progress-fill"
                  style={{ width: `${audioProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="response-display">
            <p>{responseText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioInterface;