export type MessageType =
  | 'user-text'
  | 'assistant-text'
  | 'thinking'
  | 'document-preview'
  | 'question'
  | 'action-buttons'
  | 'metrics-tiles';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    agentName?: string;
    agentColor?: string;
    documentData?: {
      title: string;
      description: string;
      fileType: string;
    };
    questions?: string[];
    questionOptions?: Array<{
      question: string;
      options: string[];
    }>;
    actions?: Array<{
      label: string;
      variant: 'primary' | 'secondary' | 'outline';
      action?: string;
      onClick?: () => void;
    }>;
    attachedFile?: {
      name: string;
      type: string;
    };
    metrics?: Array<{
      label: string;
      value: string;
      change?: string;
      icon?: string;
      color?: string;
    }>;
  };
}

export interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  children?: React.ReactNode;
}

export interface UserMessageProps {
  message: Message;
}

export interface AssistantMessageProps {
  message: Message;
  onActionClick?: (actionLabel: string) => void;
}

export interface ThinkingIndicatorProps {
  agentName?: string;
  timestamp: Date;
}

export interface DocumentPreviewCardProps {
  title: string;
  description: string;
  fileType: string;
  onView: () => void;
}

export interface QuestionPromptProps {
  questions: string[];
  onSubmit: (answers: string[]) => void;
  timestamp: Date;
  questionOptions?: Array<{
    question: string;
    options: string[];
  }>;
}

export interface ActionButtonsProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'outline';
  }>;
}

export interface Action {
  id: string;
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  type?: 'primary' | 'danger' | 'default';
  icon?: string;
}

export interface StarterPrompt {
  id: string;
  text: string;
  icon: string;
  category: 'campaign' | 'analysis' | 'journey' | 'creative';
}

export interface CollaborationInfo {
  id: string;
  title: string;
  description: string;
  participants: string[];
  status: 'active' | 'completed' | 'pending';
  agentIds: string[];
  agentNames: string[];
  agentColors: string[];
  progress?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'quick-reply' | 'multiple-choice' | 'open-ended';
  options?: string[];
  required?: boolean;
  context?: string;
}