import './DevelopmentProgress.css';

function DevelopmentProgress({ 
  designArtifacts, 
  generatedCode, 
  testResults, 
  qualityReport 
}) {
  const getTestStatusColor = (status) => {
    return status === 'passed' ? '#28a745' : '#dc3545';
  };

  const passedTests = testResults?.filter(t => t.status === 'passed').length || 0;
  const totalTests = testResults?.length || 0;

  return (
    <div className="development-progress">
      <h2>⚙️ Development Progress</h2>

      {/* Architecture & Design */}
      {designArtifacts && (
        <div className="progress-section">
          <h3>🏗️ Architecture & Design</h3>
          <div className="design-grid">
            <div className="design-card">
              <h4>Architecture Type</h4>
              <p className="highlight">{designArtifacts.architecture.type}</p>
              <div className="tags">
                {designArtifacts.architecture.patterns.map((pattern, i) => (
                  <span key={i} className="tag">{pattern}</span>
                ))}
              </div>
            </div>
            
            <div className="design-card">
              <h4>Components</h4>
              <ul className="component-list">
                {designArtifacts.architecture.components.map((comp, i) => (
                  <li key={i}>
                    <span className="comp-name">{comp.name}</span>
                    <span className="comp-tech">{comp.technology}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="design-card">
              <h4>API Endpoints</h4>
              <div className="api-list">
                {designArtifacts.apiEndpoints.slice(0, 5).map((api, i) => (
                  <div key={i} className="api-item">
                    <span className={`method ${api.method.toLowerCase()}`}>{api.method}</span>
                    <span className="path">{api.path}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Code */}
      {generatedCode && (
        <div className="progress-section">
          <h3>💻 Generated Code</h3>
          <div className="code-stats">
            <div className="stat-card">
              <span className="stat-value">{generatedCode.files.length}</span>
              <span className="stat-label">Files Generated</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{generatedCode.totalLinesOfCode}</span>
              <span className="stat-label">Lines of Code</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{generatedCode.buildStatus}</span>
              <span className="stat-label">Build Status</span>
            </div>
          </div>
          <div className="files-list">
            {generatedCode.files.map((file, i) => (
              <div key={i} className="file-item">
                <span className="file-icon">📄</span>
                <span className="file-path">{file.path}</span>
                <span className="file-lang">{file.language}</span>
                <span className="file-loc">{file.linesOfCode} LOC</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && testResults.length > 0 && (
        <div className="progress-section">
          <h3>🧪 Test Results</h3>
          <div className="test-summary">
            <div className="test-bar">
              <div 
                className="test-passed" 
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              ></div>
            </div>
            <div className="test-stats">
              <span className="passed">{passedTests} Passed</span>
              <span className="failed">{totalTests - passedTests} Failed</span>
              <span className="total">/ {totalTests} Total</span>
            </div>
          </div>
          <div className="test-grid">
            {testResults.slice(0, 9).map((test, i) => (
              <div 
                key={i} 
                className={`test-item ${test.status}`}
              >
                <span className="test-type">{test.type}</span>
                <span className="test-name">{test.name.substring(0, 30)}...</span>
                <span 
                  className="test-status"
                  style={{ color: getTestStatusColor(test.status) }}
                >
                  {test.status === 'passed' ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Report */}
      {qualityReport && (
        <div className="progress-section">
          <h3>📊 Quality Report</h3>
          <div className="quality-grid">
            <div className="quality-card">
              <h4>Code Quality</h4>
              <div className="score-circle">
                <span className="score">{qualityReport.codeQuality.score}</span>
                <span className="label">/100</span>
              </div>
              <div className="metrics">
                <div className="metric">
                  <span>Maintainability</span>
                  <span>{qualityReport.codeQuality.metrics.maintainability}%</span>
                </div>
                <div className="metric">
                  <span>Reliability</span>
                  <span>{qualityReport.codeQuality.metrics.reliability}%</span>
                </div>
              </div>
            </div>

            <div className="quality-card">
              <h4>Security</h4>
              <div className="score-circle">
                <span className="score">{qualityReport.security.score}</span>
                <span className="label">/100</span>
              </div>
              <div className="vulnerabilities">
                <div className="vuln critical">Critical: {qualityReport.security.vulnerabilities.critical}</div>
                <div className="vuln high">High: {qualityReport.security.vulnerabilities.high}</div>
                <div className="vuln medium">Medium: {qualityReport.security.vulnerabilities.medium}</div>
                <div className="vuln low">Low: {qualityReport.security.vulnerabilities.low}</div>
              </div>
            </div>

            <div className="quality-card">
              <h4>Test Coverage</h4>
              <div className="score-circle">
                <span className="score">{qualityReport.testCoverage.percentage}</span>
                <span className="label">%</span>
              </div>
              <div className="coverage-details">
                <span className="coverage-stat passed">{qualityReport.testCoverage.passedTests} passed</span>
                <span className="coverage-stat failed">{qualityReport.testCoverage.failedTests} failed</span>
              </div>
            </div>
          </div>

          <div className={`overall-status ${qualityReport.overallStatus}`}>
            {qualityReport.overallStatus === 'approved' 
              ? '✅ Quality Approved - Ready for Deployment' 
              : '⚠️ Quality Needs Review'}
          </div>
        </div>
      )}
    </div>
  );
}

export default DevelopmentProgress;
