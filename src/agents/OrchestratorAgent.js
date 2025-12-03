import { AgentType, AgentStatus, ApplicationType } from './AgentTypes';

// Simulated AI analysis for determining application type
const analyzeRequirements = (requirements) => {
  const lowerReq = requirements.toLowerCase();
  
  // Keywords indicating existing application modifications
  const existingKeywords = [
    'update', 'modify', 'change', 'fix', 'enhance', 'improve',
    'add feature', 'remove', 'upgrade', 'migrate', 'refactor',
    'existing', 'current', 'bug', 'issue', 'patch', 'version'
  ];
  
  // Keywords indicating new application
  const newKeywords = [
    'create new', 'build new', 'new application', 'new system',
    'from scratch', 'greenfield', 'new project', 'develop new',
    'brand new', 'fresh start', 'initialize', 'setup new'
  ];
  
  let existingScore = 0;
  let newScore = 0;
  
  existingKeywords.forEach(keyword => {
    if (lowerReq.includes(keyword)) existingScore++;
  });
  
  newKeywords.forEach(keyword => {
    if (lowerReq.includes(keyword)) newScore++;
  });
  
  if (newScore > existingScore) {
    return ApplicationType.NEW;
  } else if (existingScore > newScore) {
    return ApplicationType.EXISTING;
  }
  
  // Default to new if unclear
  return ApplicationType.NEW;
};

// Generate user stories from requirements
const generateUserStories = (requirements) => {
  const stories = [];
  const sentences = requirements.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed) {
      stories.push({
        id: `US-${String(index + 1).padStart(3, '0')}`,
        title: `User Story ${index + 1}`,
        description: `As a user, I want to ${trimmed.toLowerCase().replace(/^(i want to|i need to|we need to|we want to)/i, '').trim()} so that I can achieve my goals.`,
        acceptanceCriteria: [
          `Given the system is ready, when the user ${trimmed.toLowerCase().substring(0, 50)}..., then the expected outcome is achieved`,
          'Given valid inputs, when the feature is used, then correct results are displayed',
          'Given invalid inputs, when the feature is used, then appropriate error messages are shown'
        ],
        priority: index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low',
        storyPoints: Math.floor(Math.random() * 8) + 1,
        status: 'pending'
      });
    }
  });
  
  // Ensure at least some stories are generated
  if (stories.length === 0) {
    stories.push({
      id: 'US-001',
      title: 'Core Functionality',
      description: `As a user, I want to ${requirements.substring(0, 100)}... so that my needs are met.`,
      acceptanceCriteria: [
        'The core functionality works as expected',
        'User interface is intuitive',
        'Error handling is in place'
      ],
      priority: 'High',
      storyPoints: 5,
      status: 'pending'
    });
  }
  
  return stories;
};

// Simulate design artifacts generation
const generateDesignArtifacts = (userStories) => {
  return {
    architecture: {
      type: 'Microservices',
      components: [
        { name: 'Frontend', technology: 'React', description: 'User interface layer' },
        { name: 'API Gateway', technology: 'Node.js', description: 'Request routing and authentication' },
        { name: 'Business Logic', technology: 'Python', description: 'Core business rules and processing' },
        { name: 'Database', technology: 'PostgreSQL', description: 'Data persistence layer' },
        { name: 'Cache', technology: 'Redis', description: 'Performance optimization layer' }
      ],
      patterns: ['MVC', 'Repository Pattern', 'Factory Pattern', 'Observer Pattern']
    },
    uiWireframes: userStories.slice(0, 3).map((story, i) => ({
      id: `WF-${i + 1}`,
      storyId: story.id,
      name: `Wireframe for ${story.title}`,
      description: `Visual layout for implementing ${story.description.substring(0, 50)}...`
    })),
    apiEndpoints: userStories.map((story, i) => ({
      method: i % 3 === 0 ? 'POST' : i % 3 === 1 ? 'GET' : 'PUT',
      path: `/api/v1/${story.title.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Endpoint for ${story.title}`
    })),
    dataModels: [
      { name: 'User', fields: ['id', 'name', 'email', 'role', 'createdAt'] },
      { name: 'Project', fields: ['id', 'title', 'description', 'status', 'ownerId'] },
      { name: 'Task', fields: ['id', 'title', 'status', 'assigneeId', 'projectId'] }
    ]
  };
};

// Simulate code generation
const generateCode = () => {
  return {
    files: [
      {
        path: 'src/components/App.jsx',
        language: 'jsx',
        linesOfCode: 150,
        status: 'generated'
      },
      {
        path: 'src/api/routes.js',
        language: 'javascript',
        linesOfCode: 200,
        status: 'generated'
      },
      {
        path: 'src/models/User.js',
        language: 'javascript',
        linesOfCode: 50,
        status: 'generated'
      },
      {
        path: 'src/services/BusinessLogic.py',
        language: 'python',
        linesOfCode: 300,
        status: 'generated'
      },
      {
        path: 'src/utils/helpers.js',
        language: 'javascript',
        linesOfCode: 100,
        status: 'generated'
      }
    ],
    totalLinesOfCode: 800,
    coverage: 0,
    buildStatus: 'pending'
  };
};

// Simulate test case generation
const generateTestCases = (userStories) => {
  const testCases = [];
  
  userStories.forEach((story, storyIndex) => {
    // Generate unit tests
    testCases.push({
      id: `TC-${String(storyIndex * 3 + 1).padStart(3, '0')}`,
      storyId: story.id,
      type: 'Unit',
      name: `Unit test for ${story.title}`,
      description: `Verify individual components for ${story.title}`,
      steps: [
        'Initialize component with mock data',
        'Execute function under test',
        'Verify expected output matches actual output'
      ],
      expectedResult: 'All assertions pass',
      status: 'pending'
    });
    
    // Generate integration tests
    testCases.push({
      id: `TC-${String(storyIndex * 3 + 2).padStart(3, '0')}`,
      storyId: story.id,
      type: 'Integration',
      name: `Integration test for ${story.title}`,
      description: `Verify component interactions for ${story.title}`,
      steps: [
        'Setup test environment',
        'Execute end-to-end flow',
        'Verify data persistence and retrieval'
      ],
      expectedResult: 'Integration points work correctly',
      status: 'pending'
    });
    
    // Generate UI tests
    testCases.push({
      id: `TC-${String(storyIndex * 3 + 3).padStart(3, '0')}`,
      storyId: story.id,
      type: 'UI',
      name: `UI test for ${story.title}`,
      description: `Verify user interface for ${story.title}`,
      steps: [
        'Navigate to the feature page',
        'Interact with UI elements',
        'Verify visual feedback and responses'
      ],
      expectedResult: 'UI behaves as expected',
      status: 'pending'
    });
  });
  
  return testCases;
};

// Simulate test execution
const executeTests = (testCases) => {
  return testCases.map(tc => ({
    ...tc,
    status: Math.random() > 0.1 ? 'passed' : 'failed',
    executionTime: Math.floor(Math.random() * 500) + 100,
    logs: ['Test started', 'Assertions checked', 'Test completed']
  }));
};

// Simulate quality analysis
const analyzeQuality = (code, testResults) => {
  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const totalTests = testResults.length;
  
  return {
    codeQuality: {
      score: Math.floor(Math.random() * 20) + 80,
      metrics: {
        maintainability: Math.floor(Math.random() * 15) + 85,
        reliability: Math.floor(Math.random() * 10) + 88,
        security: Math.floor(Math.random() * 12) + 86,
        complexity: Math.floor(Math.random() * 20) + 10,
        duplication: Math.floor(Math.random() * 5) + 1
      },
      issues: [
        { severity: 'low', message: 'Consider adding more comments', file: 'src/utils/helpers.js', line: 42 },
        { severity: 'info', message: 'Magic number should be a constant', file: 'src/api/routes.js', line: 78 }
      ]
    },
    security: {
      score: Math.floor(Math.random() * 15) + 85,
      vulnerabilities: {
        critical: 0,
        high: 0,
        medium: Math.floor(Math.random() * 2),
        low: Math.floor(Math.random() * 3)
      },
      recommendations: [
        'Implement rate limiting on API endpoints',
        'Add input validation for all user inputs',
        'Use parameterized queries for database operations'
      ]
    },
    testCoverage: {
      percentage: Math.floor((passedTests / totalTests) * 100),
      uncoveredFiles: [],
      passedTests,
      failedTests: totalTests - passedTests,
      totalTests
    },
    overallStatus: passedTests / totalTests >= 0.9 ? 'approved' : 'needs_review'
  };
};

// Simulate deployment
const simulateDeployment = () => {
  return {
    environment: 'demo',
    url: 'https://demo.agentic-app.example.com',
    status: 'deployed',
    timestamp: new Date().toISOString(),
    resources: {
      containers: 3,
      memory: '2GB',
      cpu: '1 vCPU',
      storage: '10GB'
    },
    endpoints: [
      { path: '/', description: 'Main application' },
      { path: '/api/health', description: 'Health check endpoint' },
      { path: '/api/docs', description: 'API documentation' }
    ],
    logs: [
      'Building Docker image...',
      'Pushing to container registry...',
      'Deploying to Kubernetes cluster...',
      'Running health checks...',
      'Deployment successful!'
    ]
  };
};

// Main Orchestrator Agent
export class OrchestratorAgent {
  constructor(onStatusUpdate, onPhaseChange) {
    this.status = AgentStatus.IDLE;
    this.onStatusUpdate = onStatusUpdate;
    this.onPhaseChange = onPhaseChange;
    this.requirements = '';
    this.applicationType = ApplicationType.UNKNOWN;
    this.userStories = [];
    this.designArtifacts = null;
    this.generatedCode = null;
    this.testCases = [];
    this.testResults = [];
    this.qualityReport = null;
    this.deploymentInfo = null;
  }
  
  updateStatus(status, message) {
    this.status = status;
    if (this.onStatusUpdate) {
      this.onStatusUpdate(AgentType.ORCHESTRATOR, status, message);
    }
  }
  
  // Phase 1: Analyze requirements
  async analyzeRequirements(requirements) {
    this.requirements = requirements;
    this.updateStatus(AgentStatus.RUNNING, 'Analyzing requirements...');
    
    // Simulate processing time
    await this.delay(1500);
    
    this.applicationType = analyzeRequirements(requirements);
    this.updateStatus(AgentStatus.COMPLETED, `Detected: ${this.applicationType === ApplicationType.NEW ? 'New Application' : 'Existing Application Modification'}`);
    
    return this.applicationType;
  }
  
  // Phase 2: Generate user stories
  async generateUserStories() {
    this.updateStatus(AgentStatus.RUNNING, 'Generating user stories...');
    if (this.onPhaseChange) this.onPhaseChange('userStories');
    
    await this.delay(2000);
    
    this.userStories = generateUserStories(this.requirements, this.applicationType);
    this.updateStatus(AgentStatus.WAITING_INPUT, 'User stories generated. Awaiting validation...');
    
    return this.userStories;
  }
  
  // Phase 3: Revise user stories based on feedback
  async reviseUserStories(feedback, updatedStories) {
    this.updateStatus(AgentStatus.RUNNING, 'Revising user stories based on feedback...');
    
    await this.delay(1500);
    
    this.userStories = updatedStories || this.userStories;
    this.updateStatus(AgentStatus.COMPLETED, 'User stories finalized');
    
    return this.userStories;
  }
  
  // Phase 4: Run Developer Agent
  async runDeveloperAgent(onDeveloperUpdate) {
    if (this.onPhaseChange) this.onPhaseChange('development');
    
    // Design phase
    if (onDeveloperUpdate) onDeveloperUpdate(AgentStatus.RUNNING, 'Designing architecture...');
    await this.delay(2000);
    this.designArtifacts = generateDesignArtifacts(this.userStories);
    if (onDeveloperUpdate) onDeveloperUpdate(AgentStatus.RUNNING, 'Architecture design completed');
    
    // Build phase
    if (onDeveloperUpdate) onDeveloperUpdate(AgentStatus.RUNNING, 'Generating code...');
    await this.delay(2500);
    this.generatedCode = generateCode(this.designArtifacts, this.userStories);
    if (onDeveloperUpdate) onDeveloperUpdate(AgentStatus.COMPLETED, 'Code generation completed');
    
    return { designArtifacts: this.designArtifacts, generatedCode: this.generatedCode };
  }
  
  // Phase 4 (Parallel): Run Testing Agent
  async runTestingAgent(onTestingUpdate) {
    if (this.onPhaseChange) this.onPhaseChange('testing');
    
    // Generate test cases
    if (onTestingUpdate) onTestingUpdate(AgentStatus.RUNNING, 'Generating test cases...');
    await this.delay(1800);
    this.testCases = generateTestCases(this.userStories);
    if (onTestingUpdate) onTestingUpdate(AgentStatus.RUNNING, `Generated ${this.testCases.length} test cases`);
    
    // Execute tests
    if (onTestingUpdate) onTestingUpdate(AgentStatus.RUNNING, 'Executing tests...');
    await this.delay(2200);
    this.testResults = executeTests(this.testCases);
    
    const passed = this.testResults.filter(t => t.status === 'passed').length;
    if (onTestingUpdate) onTestingUpdate(AgentStatus.COMPLETED, `Tests completed: ${passed}/${this.testResults.length} passed`);
    
    return { testCases: this.testCases, testResults: this.testResults };
  }
  
  // Phase 5: Run Quality Agent
  async runQualityAgent(onQualityUpdate) {
    if (this.onPhaseChange) this.onPhaseChange('qualityCheck');
    
    if (onQualityUpdate) onQualityUpdate(AgentStatus.RUNNING, 'Analyzing code quality...');
    await this.delay(1500);
    
    if (onQualityUpdate) onQualityUpdate(AgentStatus.RUNNING, 'Checking security vulnerabilities...');
    await this.delay(1500);
    
    this.qualityReport = analyzeQuality(this.generatedCode, this.testResults);
    
    const status = this.qualityReport.overallStatus === 'approved' ? 'Quality check passed' : 'Quality needs review';
    if (onQualityUpdate) onQualityUpdate(AgentStatus.COMPLETED, status);
    
    return this.qualityReport;
  }
  
  // Phase 6: Deploy
  async runDeployment(onDeploymentUpdate) {
    if (this.onPhaseChange) this.onPhaseChange('deployment');
    
    if (onDeploymentUpdate) onDeploymentUpdate(AgentStatus.RUNNING, 'Preparing deployment...');
    await this.delay(1000);
    
    if (onDeploymentUpdate) onDeploymentUpdate(AgentStatus.RUNNING, 'Building containers...');
    await this.delay(1500);
    
    if (onDeploymentUpdate) onDeploymentUpdate(AgentStatus.RUNNING, 'Deploying to demo environment...');
    await this.delay(2000);
    
    this.deploymentInfo = simulateDeployment(this.generatedCode, this.qualityReport);
    
    if (onDeploymentUpdate) onDeploymentUpdate(AgentStatus.COMPLETED, `Deployed to ${this.deploymentInfo.url}`);
    if (this.onPhaseChange) this.onPhaseChange('completed');
    
    return this.deploymentInfo;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Get complete workflow state
  getState() {
    return {
      requirements: this.requirements,
      applicationType: this.applicationType,
      userStories: this.userStories,
      designArtifacts: this.designArtifacts,
      generatedCode: this.generatedCode,
      testCases: this.testCases,
      testResults: this.testResults,
      qualityReport: this.qualityReport,
      deploymentInfo: this.deploymentInfo
    };
  }
}

export default OrchestratorAgent;
