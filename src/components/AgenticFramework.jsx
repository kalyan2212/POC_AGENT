import { useState, useCallback } from 'react';
import './AgenticFramework.css';
import RequirementsInput from './RequirementsInput';
import AgentStatus from './AgentStatus';
import UserStoryValidation from './UserStoryValidation';
import DevelopmentProgress from './DevelopmentProgress';
import DeploymentStatus from './DeploymentStatus';
import { OrchestratorAgent } from '../agents/OrchestratorAgent';
import { AgentType, AgentStatus as Status, WorkflowPhase } from '../agents/AgentTypes';

function AgenticFramework() {
  const [currentPhase, setCurrentPhase] = useState(WorkflowPhase.INPUT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orchestrator, setOrchestrator] = useState(null);
  
  // Agent statuses
  const [agentStatuses, setAgentStatuses] = useState([
    { type: AgentType.ORCHESTRATOR, name: 'Orchestrator', icon: '🎯', status: Status.IDLE, message: '' },
    { type: AgentType.USER_STORY, name: 'User Story', icon: '📝', status: Status.IDLE, message: '' },
    { type: AgentType.DEVELOPER, name: 'Developer', icon: '👨‍💻', status: Status.IDLE, message: '' },
    { type: AgentType.TESTING, name: 'Testing', icon: '🧪', status: Status.IDLE, message: '' },
    { type: AgentType.QUALITY, name: 'Quality', icon: '📊', status: Status.IDLE, message: '' },
    { type: AgentType.DEPLOYMENT, name: 'Deployment', icon: '🚀', status: Status.IDLE, message: '' },
  ]);
  
  // Workflow data
  const [applicationType, setApplicationType] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [designArtifacts, setDesignArtifacts] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [, setTestCases] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [qualityReport, setQualityReport] = useState(null);
  const [deploymentInfo, setDeploymentInfo] = useState(null);

  const updateAgentStatus = useCallback((agentType, status, message) => {
    setAgentStatuses(prev => prev.map(agent => 
      agent.type === agentType 
        ? { ...agent, status, message }
        : agent
    ));
  }, []);

  const handlePhaseChange = useCallback((phase) => {
    setCurrentPhase(phase);
  }, []);

  const handleRequirementsSubmit = async (requirements) => {
    setIsProcessing(true);
    
    // Create orchestrator
    const orch = new OrchestratorAgent(updateAgentStatus, handlePhaseChange);
    setOrchestrator(orch);
    
    try {
      // Phase 1: Analyze requirements
      setCurrentPhase(WorkflowPhase.ANALYSIS);
      updateAgentStatus(AgentType.ORCHESTRATOR, Status.RUNNING, 'Analyzing requirements...');
      const appType = await orch.analyzeRequirements(requirements);
      setApplicationType(appType);
      updateAgentStatus(AgentType.ORCHESTRATOR, Status.COMPLETED, `Detected: ${appType === 'new' ? 'New Application' : 'Existing App Update'}`);
      
      // Phase 2: Generate user stories
      updateAgentStatus(AgentType.USER_STORY, Status.RUNNING, 'Generating user stories...');
      const stories = await orch.generateUserStories();
      setUserStories(stories);
      updateAgentStatus(AgentType.USER_STORY, Status.WAITING_INPUT, `${stories.length} user stories generated`);
      
      setCurrentPhase(WorkflowPhase.VALIDATION);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing requirements:', error);
      updateAgentStatus(AgentType.ORCHESTRATOR, Status.ERROR, 'Error processing requirements');
      setIsProcessing(false);
    }
  };

  const handleStoriesApproved = async (approvedStories) => {
    setIsProcessing(true);
    setUserStories(approvedStories);
    updateAgentStatus(AgentType.USER_STORY, Status.COMPLETED, 'User stories approved');
    
    try {
      // Run developer and testing agents in parallel
      setCurrentPhase(WorkflowPhase.DEVELOPMENT);
      
      // Developer Agent
      const devPromise = orchestrator.runDeveloperAgent((status, message) => {
        updateAgentStatus(AgentType.DEVELOPER, status, message);
      });
      
      // Testing Agent (parallel)
      const testPromise = orchestrator.runTestingAgent((status, message) => {
        updateAgentStatus(AgentType.TESTING, status, message);
      });
      
      const [devResult, testResult] = await Promise.all([devPromise, testPromise]);
      
      setDesignArtifacts(devResult.designArtifacts);
      setGeneratedCode(devResult.generatedCode);
      setTestCases(testResult.testCases);
      setTestResults(testResult.testResults);
      
      // Quality Agent
      setCurrentPhase(WorkflowPhase.QUALITY_CHECK);
      const quality = await orchestrator.runQualityAgent((status, message) => {
        updateAgentStatus(AgentType.QUALITY, status, message);
      });
      setQualityReport(quality);
      
      // Deployment Agent
      setCurrentPhase(WorkflowPhase.DEPLOYMENT);
      const deployment = await orchestrator.runDeployment((status, message) => {
        updateAgentStatus(AgentType.DEPLOYMENT, status, message);
      });
      setDeploymentInfo(deployment);
      
      setCurrentPhase(WorkflowPhase.COMPLETED);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error in development workflow:', error);
      setIsProcessing(false);
    }
  };

  const handleStoriesRevise = async (feedback, editedStories) => {
    setIsProcessing(true);
    updateAgentStatus(AgentType.USER_STORY, Status.RUNNING, 'Revising user stories...');
    
    const revisedStories = await orchestrator.reviseUserStories(feedback, editedStories);
    setUserStories(revisedStories);
    
    updateAgentStatus(AgentType.USER_STORY, Status.WAITING_INPUT, 'Stories revised - awaiting validation');
    setIsProcessing(false);
  };

  const resetWorkflow = () => {
    setCurrentPhase(WorkflowPhase.INPUT);
    setIsProcessing(false);
    setOrchestrator(null);
    setApplicationType(null);
    setUserStories([]);
    setDesignArtifacts(null);
    setGeneratedCode(null);
    setTestCases([]);
    setTestResults([]);
    setQualityReport(null);
    setDeploymentInfo(null);
    setAgentStatuses(prev => prev.map(agent => ({
      ...agent,
      status: Status.IDLE,
      message: ''
    })));
  };

  return (
    <div className="agentic-framework">
      <header className="framework-header">
        <h1>🤖 Agentic AI Application Development Framework</h1>
        <p className="subtitle">Transform business requirements into working applications with AI agents</p>
        
        <div className="workflow-progress">
          <div className={`phase ${currentPhase === WorkflowPhase.INPUT ? 'active' : currentPhase !== WorkflowPhase.INPUT ? 'completed' : ''}`}>
            <span className="phase-icon">📋</span>
            <span className="phase-label">Input</span>
          </div>
          <div className="phase-connector"></div>
          <div className={`phase ${currentPhase === WorkflowPhase.ANALYSIS ? 'active' : [WorkflowPhase.USER_STORIES, WorkflowPhase.VALIDATION, WorkflowPhase.DEVELOPMENT, WorkflowPhase.TESTING, WorkflowPhase.QUALITY_CHECK, WorkflowPhase.DEPLOYMENT, WorkflowPhase.COMPLETED].includes(currentPhase) ? 'completed' : ''}`}>
            <span className="phase-icon">🔍</span>
            <span className="phase-label">Analysis</span>
          </div>
          <div className="phase-connector"></div>
          <div className={`phase ${currentPhase === WorkflowPhase.VALIDATION ? 'active' : [WorkflowPhase.DEVELOPMENT, WorkflowPhase.TESTING, WorkflowPhase.QUALITY_CHECK, WorkflowPhase.DEPLOYMENT, WorkflowPhase.COMPLETED].includes(currentPhase) ? 'completed' : ''}`}>
            <span className="phase-icon">✅</span>
            <span className="phase-label">Validation</span>
          </div>
          <div className="phase-connector"></div>
          <div className={`phase ${[WorkflowPhase.DEVELOPMENT, WorkflowPhase.TESTING].includes(currentPhase) ? 'active' : [WorkflowPhase.QUALITY_CHECK, WorkflowPhase.DEPLOYMENT, WorkflowPhase.COMPLETED].includes(currentPhase) ? 'completed' : ''}`}>
            <span className="phase-icon">⚙️</span>
            <span className="phase-label">Development</span>
          </div>
          <div className="phase-connector"></div>
          <div className={`phase ${currentPhase === WorkflowPhase.QUALITY_CHECK ? 'active' : [WorkflowPhase.DEPLOYMENT, WorkflowPhase.COMPLETED].includes(currentPhase) ? 'completed' : ''}`}>
            <span className="phase-icon">📊</span>
            <span className="phase-label">Quality</span>
          </div>
          <div className="phase-connector"></div>
          <div className={`phase ${currentPhase === WorkflowPhase.DEPLOYMENT ? 'active' : currentPhase === WorkflowPhase.COMPLETED ? 'completed' : ''}`}>
            <span className="phase-icon">🚀</span>
            <span className="phase-label">Deploy</span>
          </div>
        </div>
      </header>

      <main className="framework-main">
        {/* Always show agent status when processing has started */}
        {currentPhase !== WorkflowPhase.INPUT && (
          <AgentStatus agents={agentStatuses} />
        )}

        {/* Requirements Input Phase */}
        {currentPhase === WorkflowPhase.INPUT && (
          <RequirementsInput 
            onSubmit={handleRequirementsSubmit}
            isProcessing={isProcessing}
          />
        )}

        {/* User Story Validation Phase */}
        {currentPhase === WorkflowPhase.VALIDATION && userStories.length > 0 && (
          <UserStoryValidation
            userStories={userStories}
            applicationType={applicationType}
            onApprove={handleStoriesApproved}
            onRevise={handleStoriesRevise}
          />
        )}

        {/* Development Progress */}
        {[WorkflowPhase.DEVELOPMENT, WorkflowPhase.TESTING, WorkflowPhase.QUALITY_CHECK, WorkflowPhase.DEPLOYMENT, WorkflowPhase.COMPLETED].includes(currentPhase) && (
          <DevelopmentProgress
            designArtifacts={designArtifacts}
            generatedCode={generatedCode}
            testResults={testResults}
            qualityReport={qualityReport}
          />
        )}

        {/* Deployment Status */}
        {currentPhase === WorkflowPhase.COMPLETED && deploymentInfo && (
          <DeploymentStatus deploymentInfo={deploymentInfo} />
        )}

        {/* Restart button when completed */}
        {currentPhase === WorkflowPhase.COMPLETED && (
          <div className="restart-section">
            <button className="restart-btn" onClick={resetWorkflow}>
              🔄 Start New Project
            </button>
          </div>
        )}
      </main>

      <footer className="framework-footer">
        <p>Powered by Agentic AI • Demonstrating the future of application development</p>
      </footer>
    </div>
  );
}

export default AgenticFramework;
