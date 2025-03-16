import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DiaryEntry.css';

function DiaryEntry() {
  const navigate = useNavigate();
  const [diaryText, setDiaryText] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the diary entry to your backend here
    console.log('Diary entry submitted:', { title, diaryText });
  };

  const handleAnalyze = () => {
    if (!diaryText.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    // Simulate analysis (in a real app, this would call your backend)
    setIsAnalyzing(true);
    setTimeout(() => {
      // Example analysis results - in a real app, this would come from your AI backend
      setAnalysis({
        sentiment: 'Positive',
        topics: ['Memory', 'Family', 'Daily activities'],
        insights: 'This entry shows positive engagement with family memories. There are signs of good recall of recent events.',
        recommendations: 'Continue documenting daily activities as they seem to strengthen memory pathways.'
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="diary-screen">
      <div className="diary-container">
        <div className="diary-header">
          <h2>Daily Memory Journal</h2>
          <p>Record your thoughts, experiences, or memories from today.</p>
        </div>

        <form className="diary-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="diary-title">Entry Title</label>
            <input
              type="text"
              id="diary-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Today's highlight..."
              className="diary-title-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="diary-content">Your Entry</label>
            <textarea
              id="diary-content"
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="What would you like to remember about today?"
              className="diary-content-input"
              rows={10}
              required
            />
          </div>

          <div className="diary-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !diaryText.trim()}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Entry'}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!title.trim() || !diaryText.trim()}
            >
              Save Entry
            </button>
          </div>
        </form>

        <div className="action-buttons">
          <button 
            className="btn btn-tertiary"
            onClick={() => navigate('/persona-select')}
          >
            Back to Personas
          </button>
        </div>

        {analysis && (
          <div className="analysis-results">
            <h3>Memory Analysis</h3>
            
            <div className="analysis-card">
              <div className="analysis-item">
                <h4>Sentiment</h4>
                <p>{analysis.sentiment}</p>
              </div>
              
              <div className="analysis-item">
                <h4>Topics Mentioned</h4>
                <ul>
                  {analysis.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              
              <div className="analysis-item">
                <h4>Insights</h4>
                <p>{analysis.insights}</p>
              </div>
              
              <div className="analysis-item">
                <h4>Recommendations</h4>
                <p>{analysis.recommendations}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiaryEntry; 