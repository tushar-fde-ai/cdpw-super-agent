import { Agent, Workflow, WorkflowStep } from './types';

// Demo agents for the orchestration panel
export const DEMO_AGENTS: Agent[] = [
  {
    id: 'campaign-strategy',
    name: 'Campaign Strategy',
    icon: 'Target',
    color: '#7c3aed',
    status: 'complete',
    currentTask: 'Analyzed campaign goals and requirements'
  },
  {
    id: 'audience-persona',
    name: 'Audience & Persona',
    icon: 'Users',
    color: '#2563eb',
    status: 'active',
    currentTask: 'Building detailed target personas for Halloween campaign'
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    icon: 'BarChart3',
    color: '#14b8a6',
    status: 'waiting',
    currentTask: 'Ready to analyze historical campaign data'
  },
  {
    id: 'journey-orchestration',
    name: 'Journey Orchestration',
    icon: 'Workflow',
    color: '#f97316',
    status: 'idle',
    currentTask: 'Will map customer journey touchpoints'
  },
  {
    id: 'creative-generation',
    name: 'Creative Generation',
    icon: 'Palette',
    color: '#ec4899',
    status: 'idle',
    currentTask: 'Will generate campaign assets and copy'
  },
  {
    id: 'activation-integration',
    name: 'Activation & Integration',
    icon: 'Rocket',
    color: '#10b981',
    status: 'idle',
    currentTask: 'Will coordinate campaign launch across channels'
  }
];

// Demo workflow steps
export const DEMO_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    agentId: 'campaign-strategy',
    description: 'Analyzed campaign goals and target market',
    status: 'complete',
    order: 1
  },
  {
    agentId: 'audience-persona',
    description: 'Building target personas and segments',
    status: 'active',
    order: 2
  },
  {
    agentId: 'data-analytics',
    description: 'Ready to analyze historical performance data',
    status: 'waiting',
    order: 3
  },
  {
    agentId: 'campaign-strategy',
    description: 'Will compile comprehensive campaign brief',
    status: 'waiting',
    order: 4
  }
];

// Demo workflow for Campaign Brief Creation
export const DEMO_WORKFLOW: Workflow = {
  id: 'campaign-brief-creation',
  name: 'Campaign Brief Creation',
  currentStep: 2,
  totalSteps: 4,
  steps: DEMO_WORKFLOW_STEPS,
  overallProgress: 45,
  currentTaskDescription: 'Building target audience segments for millennials interested in Halloween promotions'
};

// Get agent by ID helper function
export const getAgentById = (id: string): Agent | undefined => {
  return DEMO_AGENTS.find(agent => agent.id === id);
};

// Get active agents helper function
export const getActiveAgents = (): Agent[] => {
  return DEMO_AGENTS.filter(agent => agent.status === 'active');
};

// Get workflow progress helper function
export const getWorkflowProgress = (workflow: Workflow): string => {
  const completedSteps = workflow.steps.filter(step => step.status === 'complete').length;
  return `${completedSteps}/${workflow.totalSteps} steps completed`;
};