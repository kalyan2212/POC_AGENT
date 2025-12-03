import './DeploymentStatus.css';

function DeploymentStatus({ deploymentInfo }) {
  if (!deploymentInfo) return null;

  return (
    <div className="deployment-status">
      <h2>🚀 Deployment Complete</h2>
      
      <div className="deployment-success">
        <div className="success-icon">✓</div>
        <div className="success-message">
          <h3>Application Deployed Successfully!</h3>
          <p>Your application is now live in the demo environment.</p>
        </div>
      </div>

      <div className="deployment-details">
        <div className="detail-section">
          <h4>🌐 Application URL</h4>
          <a 
            href={deploymentInfo.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="app-url"
          >
            {deploymentInfo.url}
          </a>
        </div>

        <div className="detail-section">
          <h4>📍 Environment Details</h4>
          <div className="env-grid">
            <div className="env-item">
              <span className="env-label">Environment</span>
              <span className="env-value">{deploymentInfo.environment}</span>
            </div>
            <div className="env-item">
              <span className="env-label">Status</span>
              <span className="env-value status-active">{deploymentInfo.status}</span>
            </div>
            <div className="env-item">
              <span className="env-label">Timestamp</span>
              <span className="env-value">
                {new Date(deploymentInfo.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>💻 Resources</h4>
          <div className="resources-grid">
            <div className="resource-item">
              <span className="resource-icon">📦</span>
              <span className="resource-name">Containers</span>
              <span className="resource-value">{deploymentInfo.resources.containers}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">💾</span>
              <span className="resource-name">Memory</span>
              <span className="resource-value">{deploymentInfo.resources.memory}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">⚡</span>
              <span className="resource-name">CPU</span>
              <span className="resource-value">{deploymentInfo.resources.cpu}</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">💿</span>
              <span className="resource-name">Storage</span>
              <span className="resource-value">{deploymentInfo.resources.storage}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4>🔗 Available Endpoints</h4>
          <div className="endpoints-list">
            {deploymentInfo.endpoints.map((endpoint, i) => (
              <div key={i} className="endpoint-item">
                <span className="endpoint-path">{endpoint.path}</span>
                <span className="endpoint-desc">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h4>📋 Deployment Logs</h4>
          <div className="logs-container">
            {deploymentInfo.logs.map((log, i) => (
              <div key={i} className="log-line">
                <span className="log-prefix">[{String(i + 1).padStart(2, '0')}]</span>
                <span className="log-text">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h4>🎉 What&apos;s Next?</h4>
        <p>Your application is ready for demonstration. You can:</p>
        <ul>
          <li>Visit the application URL to see the live demo</li>
          <li>Test the API endpoints</li>
          <li>Share the demo link with stakeholders</li>
          <li>Proceed to production deployment when ready</li>
        </ul>
      </div>
    </div>
  );
}

export default DeploymentStatus;
