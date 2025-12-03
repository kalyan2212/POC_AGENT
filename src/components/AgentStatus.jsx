import './AgentStatus.css';
import { AgentStatus as Status } from '../agents/AgentTypes';

function AgentStatus({ agents }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case Status.IDLE: return '⚪';
      case Status.RUNNING: return '🔄';
      case Status.WAITING_INPUT: return '⏸️';
      case Status.COMPLETED: return '✅';
      case Status.ERROR: return '❌';
      default: return '⚪';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case Status.IDLE: return 'idle';
      case Status.RUNNING: return 'running';
      case Status.WAITING_INPUT: return 'waiting';
      case Status.COMPLETED: return 'completed';
      case Status.ERROR: return 'error';
      default: return 'idle';
    }
  };

  return (
    <div className="agent-status-panel">
      <h3>🤖 Agent Status</h3>
      <div className="agents-grid">
        {agents.map((agent) => (
          <div 
            key={agent.type} 
            className={`agent-card ${getStatusClass(agent.status)}`}
          >
            <div className="agent-header">
              <span className="agent-icon">{agent.icon}</span>
              <span className="agent-name">{agent.name}</span>
              <span className="status-icon">{getStatusIcon(agent.status)}</span>
            </div>
            <div className="agent-message">{agent.message || 'Waiting...'}</div>
            {agent.status === Status.RUNNING && (
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentStatus;
