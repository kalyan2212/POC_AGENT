import { useState } from 'react';
import './UserStoryValidation.css';

function UserStoryValidation({ userStories, applicationType, onApprove, onRevise }) {
  const [editedStories, setEditedStories] = useState(userStories);
  const [feedback, setFeedback] = useState('');
  const [expandedStory, setExpandedStory] = useState(null);

  const handleStoryEdit = (index, field, value) => {
    const updated = [...editedStories];
    updated[index] = { ...updated[index], [field]: value };
    setEditedStories(updated);
  };

  const handleApprove = () => {
    onApprove(editedStories);
  };

  const handleRevise = () => {
    onRevise(feedback, editedStories);
  };

  const toggleExpand = (storyId) => {
    setExpandedStory(expandedStory === storyId ? null : storyId);
  };

  return (
    <div className="user-story-validation">
      <div className="validation-header">
        <h2>📝 User Stories Validation</h2>
        <div className="app-type-badge">
          {applicationType === 'new' ? '🆕 New Application' : '🔄 Existing Application Update'}
        </div>
      </div>
      
      <p className="validation-description">
        Review the generated user stories below. You can edit them, add feedback, 
        or approve them to proceed with development.
      </p>

      <div className="stories-list">
        {editedStories.map((story, index) => (
          <div 
            key={story.id} 
            className={`story-card ${expandedStory === story.id ? 'expanded' : ''}`}
          >
            <div className="story-header" onClick={() => toggleExpand(story.id)}>
              <span className="story-id">{story.id}</span>
              <span className="story-title">{story.title}</span>
              <span className={`priority-badge ${story.priority.toLowerCase()}`}>
                {story.priority}
              </span>
              <span className="story-points">{story.storyPoints} SP</span>
              <span className="expand-icon">{expandedStory === story.id ? '▼' : '▶'}</span>
            </div>
            
            {expandedStory === story.id && (
              <div className="story-details">
                <div className="field-group">
                  <label>Description:</label>
                  <textarea
                    value={story.description}
                    onChange={(e) => handleStoryEdit(index, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="field-group">
                  <label>Acceptance Criteria:</label>
                  <ul className="acceptance-criteria">
                    {story.acceptanceCriteria.map((criteria, i) => (
                      <li key={i}>{criteria}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="field-group inline">
                  <label>Priority:</label>
                  <select
                    value={story.priority}
                    onChange={(e) => handleStoryEdit(index, 'priority', e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  
                  <label>Story Points:</label>
                  <input
                    type="number"
                    min="1"
                    max="13"
                    value={story.storyPoints}
                    onChange={(e) => handleStoryEdit(index, 'storyPoints', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="feedback-section">
        <h3>💬 Provide Feedback (Optional)</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter any additional feedback or changes you'd like to see..."
          rows={3}
        />
      </div>

      <div className="action-buttons">
        <button className="revise-btn" onClick={handleRevise}>
          🔄 Request Revision
        </button>
        <button className="approve-btn" onClick={handleApprove}>
          ✅ Approve & Proceed
        </button>
      </div>
    </div>
  );
}

export default UserStoryValidation;
