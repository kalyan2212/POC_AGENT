// Agent Types and Status Constants
export const AgentType = {
  ORCHESTRATOR: 'orchestrator',
  USER_STORY: 'userStory',
  DEVELOPER: 'developer',
  TESTING: 'testing',
  QUALITY: 'quality',
  DEPLOYMENT: 'deployment'
};

export const AgentStatus = {
  IDLE: 'idle',
  RUNNING: 'running',
  WAITING_INPUT: 'waitingInput',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export const ApplicationType = {
  NEW: 'new',
  EXISTING: 'existing',
  UNKNOWN: 'unknown'
};

export const WorkflowPhase = {
  INPUT: 'input',
  ANALYSIS: 'analysis',
  USER_STORIES: 'userStories',
  VALIDATION: 'validation',
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  QUALITY_CHECK: 'qualityCheck',
  DEPLOYMENT: 'deployment',
  COMPLETED: 'completed'
};
