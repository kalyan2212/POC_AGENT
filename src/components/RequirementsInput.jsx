import { useState } from 'react';
import './RequirementsInput.css';

function RequirementsInput({ onSubmit, isProcessing }) {
  const [inputType, setInputType] = useState('text');
  const [requirements, setRequirements] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setRequirements(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requirements.trim()) {
      onSubmit(requirements);
    }
  };

  const sampleRequirements = `Create a new employee management system with the following features:
  
1. User Authentication - Employees should be able to login with their credentials
2. Dashboard - Show summary of tasks, projects, and notifications
3. Employee Directory - Search and view employee profiles
4. Leave Management - Apply for leave and track leave balances
5. Timesheet - Track daily work hours and submit weekly timesheets
6. Project Management - View assigned projects and update task status
7. Reports - Generate reports for managers
8. Settings - Update profile and notification preferences`;

  return (
    <div className="requirements-input">
      <h2>📋 Business Requirements Input</h2>
      <p className="description">
        Paste your business requirements, user story, or change request below. 
        You can also upload a document file.
      </p>
      
      <div className="input-type-selector">
        <button 
          className={inputType === 'text' ? 'active' : ''}
          onClick={() => setInputType('text')}
          disabled={isProcessing}
        >
          📝 Paste Text
        </button>
        <button 
          className={inputType === 'file' ? 'active' : ''}
          onClick={() => setInputType('file')}
          disabled={isProcessing}
        >
          📄 Upload File
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {inputType === 'text' ? (
          <div className="text-input-container">
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter your business requirements here...&#10;&#10;Example:&#10;- As a user, I want to...&#10;- The system should...&#10;- Create a new feature that..."
              rows={12}
              disabled={isProcessing}
            />
            <button 
              type="button" 
              className="sample-btn"
              onClick={() => setRequirements(sampleRequirements)}
              disabled={isProcessing}
            >
              Load Sample Requirements
            </button>
          </div>
        ) : (
          <div className="file-input-container">
            <label className="file-upload-label">
              <input
                type="file"
                accept=".txt,.md,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
              <span className="upload-icon">📁</span>
              <span>{fileName || 'Click to upload a file'}</span>
            </label>
            {requirements && (
              <div className="file-preview">
                <h4>Preview:</h4>
                <pre>{requirements.substring(0, 500)}{requirements.length > 500 ? '...' : ''}</pre>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={!requirements.trim() || isProcessing}
        >
          {isProcessing ? '⏳ Processing...' : '🚀 Start Agent Workflow'}
        </button>
      </form>
    </div>
  );
}

export default RequirementsInput;
