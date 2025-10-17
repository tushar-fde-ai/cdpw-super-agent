export type NodeType = 'entry' | 'wait' | 'email' | 'sms' | 'decision' | 'split';

export interface Position {
  x: number;
  y: number;
}

export interface Campaign {
  id: string;
  name: string;
  audienceSize: number;
  channels: string[];
  hasExperiment: boolean;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface EmailConfig {
  subjectLine: string;
  subjectLineVariants?: string[];
  previewText: string;
  templateId: string;
  content: string;
  generatedBy: string[];
}

export interface SMSConfig {
  content: string;
  generatedBy: string[];
}

export interface WaitConfig {
  duration: number;
  unit: 'minutes' | 'hours' | 'days';
  type: 'time' | 'event';
}

export interface DecisionConfig {
  criteria: string;
  branches: {
    condition: string;
    nextNodeId: string;
  }[];
}

export interface EntryConfig {
  audienceSize: number;
  entryConditions: string[];
  segmentName: string;
}

export interface JourneyNode {
  id: string;
  type: NodeType;
  label: string;
  status: 'configured' | 'pending' | 'draft';
  position: Position;
  config?: EmailConfig | SMSConfig | WaitConfig | DecisionConfig | EntryConfig;
  nextNodes: string[];
  hasABTest?: boolean;
  generatedByAI?: boolean;
}

export interface ActivationBarProps {
  campaign: Campaign;
  onPreview: () => void;
  onSave: () => void;
  onActivate: () => void;
}

export interface JourneySidebarProps {
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  onSendMessage: (message: string) => void;
}

export interface JourneyCanvasProps {
  nodes: JourneyNode[];
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  onCanvasClick: () => void;
}

export interface JourneyNodeProps {
  node: JourneyNode;
  isSelected: boolean;
  onClick: () => void;
}

export interface ConnectionPathProps {
  from: Position;
  to: Position;
  isActive?: boolean;
}

export interface StepDetailsDrawerProps {
  node: JourneyNode | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}