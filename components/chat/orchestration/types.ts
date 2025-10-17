// TypeScript interfaces for orchestration system

export type AgentStatus = 'idle' | 'active' | 'complete' | 'waiting';

export interface Agent {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string;
  status: AgentStatus;
  currentTask?: string;
}

export interface WorkflowStep {
  agentId: string;
  description: string;
  status: AgentStatus;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
  overallProgress: number; // 0-100
  currentTaskDescription: string;
}

export interface AgentNodeProps {
  agent: Agent;
  status: AgentStatus;
  onClick?: (agent: Agent) => void;
}

export interface ConnectionLineProps {
  fromAgent: string;
  toAgent: string;
  isActive: boolean;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export interface CollaborationBadgeProps {
  agents: Agent[];
}

export interface OrchestrationPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  activeWorkflow?: Workflow;
}