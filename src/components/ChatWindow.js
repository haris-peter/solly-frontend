import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatWindow.css';

function ChatWindow({ persona, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [noiseWarning, setNoiseWarning] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [waveform, setWaveform] = useState(Array(20).fill(5));
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

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
      setIsListening(false);
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
    };
  }, []);

  // Simulate dynamic waveform
  useEffect(() => {
    let interval;
    if (isListening && !noiseWarning) {
      interval = setInterval(() => {
        setWaveform(prev => prev.map(() => 5 + Math.floor(Math.random() * 45)));
      }, 100);
    } else {
      setWaveform(Array(20).fill(5));
    }

    return () => clearInterval(interval);
  }, [isListening, noiseWarning]);

  // Initial welcome message based on persona
  useEffect(() => {
    const initialMessage = {
      text: persona === 'patient' 
        ? "Hello! I'm your AI companion. How can I help you today with your memories or daily activities?" 
        : "Welcome to the caregiver dashboard. I can help you monitor patient activities and health metrics.",
      sender: 'ai'
    };
    setMessages([initialMessage]);
  }, [persona]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Progress effect for audio recording
  useEffect(() => {
    let interval;
    if (isListening && !noiseWarning) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    } else {
      setAudioProgress(0);
    }

    return () => clearInterval(interval);
  }, [isListening, noiseWarning]);

  // Handle starting audio input
  const handleAudioInput = () => {
    setIsListening(true);
    setAudioProgress(0);
    setTranscript('');
    setInterimTranscript('');
    
    // Start actual speech recognition
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Could not start speech recognition', e);
      // Fall back to simulation if speech recognition fails
      simulateAudioInput();
    }
  };

  // Simulate audio input (fallback)
  const simulateAudioInput = () => {
    // Simulate checking ambient noise
    setTimeout(() => {
      // Randomly decide if there's too much noise (for demo purposes)
      const isTooNoisy = Math.random() > 0.7;
      
      if (isTooNoisy) {
        setNoiseWarning(true);
        setTimeout(() => setNoiseWarning(false), 3000);
        setIsListening(false);
      } else {
        // Simulate voice recognition with staged transcription
        // First some interim results
        const phrases = [
          "Can you remind me",
          "Can you remind me what day",
          "Can you remind me what day it is",
          "Can you remind me what day it is today"
        ];
        
        let phraseIndex = 0;
        const transcriptionInterval = setInterval(() => {
          if (phraseIndex < phrases.length) {
            setInterimTranscript(phrases[phraseIndex]);
            phraseIndex++;
          } else {
            clearInterval(transcriptionInterval);
            setInterimTranscript('');
            setTranscript("Can you remind me what day it is today?");
            
            // Add user message
            setTimeout(() => {
              if (isListening) {
                setMessages(prev => [...prev, { 
                  text: "Can you remind me what day it is today?", 
                  sender: 'user' 
                }]);
                
                // Simulate AI thinking
                setTimeout(() => {
                  // Add AI response
                  setMessages(prev => [...prev, { 
                    text: "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ". You have a doctor's appointment at 2 PM.", 
                    sender: 'ai' 
                  }]);
                  
                  setIsListening(false);
                }, 2000);
              }
            }, 1000);
          }
        }, 700);
      }
    }, 1000);
  };

  // Handle stopping audio input
  const handleStopListening = () => {
    setIsListening(false);
    setNoiseWarning(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Could not stop recognition', e);
      }
    }
    
    // Process final transcript if exists
    if (transcript.trim()) {
      setMessages(prev => [...prev, { 
        text: transcript.trim(), 
        sender: 'user' 
      }]);
      
      // Generate AI response based on transcript
      setTimeout(() => {
        generateAIResponse(transcript.trim());
      }, 1000);
    }
  };

  // Generate AI response based on user input
  const generateAIResponse = (userInput) => {
    const lowercasedInput = userInput.toLowerCase();
    let response = "I'm processing your request. As an AI companion, I'm here to help with your daily activities and memories.";
    
    if (lowercasedInput.includes("day") || lowercasedInput.includes("date") || lowercasedInput.includes("today")) {
      response = "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ". You have a doctor's appointment at 2 PM.";
    } else if (lowercasedInput.includes("medication") || lowercasedInput.includes("medicine") || lowercasedInput.includes("pill")) {
      response = "Yes, it's time for your blood pressure medication. I've sent a notification to your caregiver to assist you.";
    } else if (lowercasedInput.includes("family") || lowercasedInput.includes("daughter") || lowercasedInput.includes("son")) {
      response = "Your daughter Emily called yesterday. She'll be visiting this weekend with your grandchildren, Max and Sophie.";
    } else if (lowercasedInput.includes("schedule") || lowercasedInput.includes("plan") || lowercasedInput.includes("activities")) {
      response = "You have a memory game session at 11 AM and a virtual meeting with your support group at 3 PM.";
    }
    
    setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    
    // Generate AI response
    setTimeout(() => {
      generateAIResponse(inputValue);
    }, 1000);
    
    // Clear input
    setInputValue('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{persona === 'patient' ? 'AI Companion Chat' : 'Caregiver Assistant'}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {noiseWarning && (
        <div className="noise-warning">
          ⚠️ High ambient noise detected. Please move to a quieter environment.
        </div>
      )}
      
      <div className="chat-input-area">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isListening}
          />
          <button type="submit" disabled={isListening}>Send</button>
        </form>
        
        <button 
          className={`audio-button ${isListening ? 'listening' : ''}`} 
          onClick={handleAudioInput}
          disabled={isListening}
        >
          {isListening ? (
            <div className="audio-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Audio listening overlay */}
      {isListening && !noiseWarning && (
        <div className="audio-overlay">
          <div className="audio-overlay-content">
            {/* New fluid waveform visualization */}
            <div className="audio-visualizer">
              <div className="fluid-waveform-container">
                <div className="fluid-waveform">
                  {waveform.map((height, index) => (
                    <div 
                      key={index} 
                      className="waveform-bar" 
                      style={{height: `${height}px`}}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="audio-circle">
                <div className="pulse-ring"></div>
                <div className="pulse-ring" style={{animationDelay: "0.2s"}}></div>
                <div className="pulse-ring" style={{animationDelay: "0.4s"}}></div>
                
                <div className="microphone-icon">
                  <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="audio-status">
              <h3>Listening...</h3>
              <p>Speak clearly into your microphone</p>
            </div>
            
            {/* Live transcription area */}
            <div className="transcription-area">
              {transcript && (
                <div className="transcription-text final">
                  {transcript}
                </div>
              )}
              {interimTranscript && (
                <div className="transcription-text interim">
                  {interimTranscript}
                </div>
              )}
            </div>
            
            <div className="audio-progress-bar">
              <div 
                className="audio-progress-fill" 
                style={{width: `${audioProgress}%`}}
              ></div>
            </div>
            
            <button 
              className="audio-stop-button"
              onClick={handleStopListening}
            >
              Stop Listening
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow; 