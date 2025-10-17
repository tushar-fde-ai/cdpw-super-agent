/**
 * Demo Flow System - Manages automated storylines and state
 *
 * This file contains the demo flow definitions and state management
 * for automated storylines that guide users through the application.
 */

export type DemoFlowType = 'campaign-brief' | 'campaign-execution' | null;

export interface DemoState {
  currentFlow: DemoFlowType;
  currentStep: number;
  isPlaying: boolean;
  messages: Message[];
  orchestrationState: OrchestrationState;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    hasAttachment?: boolean;
    attachmentName?: string;
    isThinking?: boolean;
    agentName?: string;
  };
}

export interface OrchestrationState {
  currentStep: number;
  totalSteps: number;
  steps: OrchestrationStep[];
  isVisible: boolean;
}

export interface OrchestrationStep {
  agentId: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
}

export interface DemoFlowStep {
  stepNumber: number;
  action: 'user-message' | 'assistant-message' | 'show-orchestration' | 'thinking' |
          'question' | 'show-collaboration' | 'update-orchestration' | 'document-preview' |
          'action-buttons' | 'navigate';
  content?: string;
  delay: number;
  metadata?: any;
}

export interface DemoFlow {
  id: string;
  name: string;
  description: string;
  steps: DemoFlowStep[];
}

// Storyline 1: Campaign Brief Creation
export const campaignBriefFlow: DemoFlow = {
  id: 'campaign-brief',
  name: 'Campaign Brief Creation',
  description: 'Watch as AI agents collaborate to create a comprehensive campaign brief',
  steps: [
    {
      stepNumber: 1,
      action: 'user-message',
      content: 'I have a Halloween themed campaign that should deploy two weeks before Halloween',
      delay: 0
    },
    {
      stepNumber: 2,
      action: 'assistant-message',
      content: 'Great! I\'ll help you create a comprehensive campaign brief for your Halloween campaign. Let me gather some information first.',
      delay: 1000
    },
    {
      stepNumber: 3,
      action: 'show-orchestration',
      delay: 1500,
      metadata: {
        agents: ['campaign-strategy']
      }
    },
    {
      stepNumber: 4,
      action: 'thinking',
      content: 'Analyzing campaign requirements and market trends...',
      delay: 2000,
      metadata: {
        agentName: 'Campaign Strategy Agent'
      }
    },
    {
      stepNumber: 5,
      action: 'question',
      delay: 3000,
      metadata: {
        questions: [
          'Who is your target audience for this campaign?',
          'What are your primary campaign goals?',
          'What is your estimated budget range?',
          'Which channels are you planning to use?'
        ]
      }
    },
    {
      stepNumber: 6,
      action: 'user-message',
      content: 'Target audience is millennials aged 25-40, goal is to drive online sales, budget is $50k, using email and social media',
      delay: 4000
    },
    {
      stepNumber: 7,
      action: 'assistant-message',
      content: 'Perfect! I\'m now working with multiple agents to build your comprehensive campaign brief.',
      delay: 5000
    },
    {
      stepNumber: 8,
      action: 'show-collaboration',
      delay: 5500,
      metadata: {
        agents: ['campaign-strategy', 'audience-persona', 'data-analytics']
      }
    },
    {
      stepNumber: 9,
      action: 'update-orchestration',
      delay: 6000,
      metadata: {
        workflow: {
          currentStep: 1,
          totalSteps: 4,
          steps: [
            { agentId: 'campaign-strategy', description: 'Analyzing campaign goals', status: 'active' }
          ]
        }
      }
    },
    {
      stepNumber: 10,
      action: 'thinking',
      content: 'Analyzing market trends and competitive landscape for Halloween campaigns...',
      delay: 6500,
      metadata: {
        agentName: 'Campaign Strategy Agent'
      }
    },
    {
      stepNumber: 11,
      action: 'update-orchestration',
      delay: 8000,
      metadata: {
        workflow: {
          currentStep: 2,
          totalSteps: 4,
          steps: [
            { agentId: 'campaign-strategy', description: 'Analyzed campaign goals', status: 'complete' },
            { agentId: 'audience-persona', description: 'Building target personas', status: 'active' }
          ]
        }
      }
    },
    {
      stepNumber: 12,
      action: 'thinking',
      content: 'Building detailed millennial personas and behavioral insights...',
      delay: 8500,
      metadata: {
        agentName: 'Audience & Persona Agent'
      }
    },
    {
      stepNumber: 13,
      action: 'update-orchestration',
      delay: 10000,
      metadata: {
        workflow: {
          currentStep: 3,
          totalSteps: 4,
          steps: [
            { agentId: 'campaign-strategy', description: 'Analyzed campaign goals', status: 'complete' },
            { agentId: 'audience-persona', description: 'Built target personas', status: 'complete' },
            { agentId: 'data-analytics', description: 'Analyzing historical data', status: 'active' }
          ]
        }
      }
    },
    {
      stepNumber: 14,
      action: 'thinking',
      content: 'Pulling historical Halloween campaign performance data and industry benchmarks...',
      delay: 10500,
      metadata: {
        agentName: 'Data Analytics Agent'
      }
    },
    {
      stepNumber: 15,
      action: 'update-orchestration',
      delay: 12000,
      metadata: {
        workflow: {
          currentStep: 4,
          totalSteps: 4,
          steps: [
            { agentId: 'campaign-strategy', description: 'Analyzed campaign goals', status: 'complete' },
            { agentId: 'audience-persona', description: 'Built target personas', status: 'complete' },
            { agentId: 'data-analytics', description: 'Analyzed historical data', status: 'complete' },
            { agentId: 'campaign-strategy', description: 'Compiling final brief', status: 'active' }
          ]
        }
      }
    },
    {
      stepNumber: 16,
      action: 'assistant-message',
      content: 'Your campaign brief is ready! I\'ve created a comprehensive strategy document that includes target audience analysis, campaign objectives, recommended tactics, and success metrics.',
      delay: 14000
    },
    {
      stepNumber: 17,
      action: 'document-preview',
      delay: 14500,
      metadata: {
        document: {
          title: 'Halloween 2025 Campaign Brief',
          description: 'Complete campaign strategy targeting millennials with $50k budget across email and social channels',
          fileType: 'PDF'
        }
      }
    },
    {
      stepNumber: 18,
      action: 'action-buttons',
      delay: 15000,
      metadata: {
        actions: [
          { label: 'Review Document', variant: 'primary' },
          { label: 'Download PDF', variant: 'secondary' },
          { label: 'Set Up Approval Workflow', variant: 'outline' }
        ]
      }
    },
    {
      stepNumber: 19,
      action: 'assistant-message',
      content: 'Your brief has been sent for approval. Ready to build the campaign? Click the button below to continue to the Journey Builder.',
      delay: 18000
    },
    {
      stepNumber: 20,
      action: 'action-buttons',
      delay: 18500,
      metadata: {
        actions: [
          { label: 'Continue to Campaign Builder', variant: 'primary', action: 'start-campaign-execution' }
        ]
      }
    }
  ]
};

// Storyline 2: Campaign Execution
export const campaignExecutionFlow: DemoFlow = {
  id: 'campaign-execution',
  name: 'Campaign Execution',
  description: 'See how AI builds a complete campaign journey with automation and A/B testing',
  steps: [
    {
      stepNumber: 1,
      action: 'user-message',
      content: 'Now build me a campaign from this brief',
      delay: 0,
      metadata: {
        hasAttachment: true,
        attachmentName: 'Halloween_Brief_2025.pdf'
      }
    },
    {
      stepNumber: 2,
      action: 'assistant-message',
      content: 'Perfect! I\'ll create a complete campaign based on your approved Halloween brief. Let me ask a couple clarification questions first.',
      delay: 1000
    },
    {
      stepNumber: 3,
      action: 'question',
      delay: 2000,
      metadata: {
        questions: [
          'Do you want to run A/B experiments in this campaign?',
          'Which creative assets should I use? (Halloween_2025, Spooky_Promo, Fall_Collection)'
        ]
      }
    },
    {
      stepNumber: 4,
      action: 'user-message',
      content: 'Yes, run A/B test on subject lines. Use Halloween_2025 creative.',
      delay: 3000
    },
    {
      stepNumber: 5,
      action: 'assistant-message',
      content: 'Great! I\'m now building your campaign journey with the Journey Agent and Creative Agent working together...',
      delay: 4000
    },
    {
      stepNumber: 6,
      action: 'show-collaboration',
      delay: 4500,
      metadata: {
        agents: ['journey-orchestration', 'creative-generation', 'activation-integration']
      }
    },
    {
      stepNumber: 7,
      action: 'thinking',
      content: 'Designing customer journey flow with decision points and automation...',
      delay: 5000,
      metadata: {
        agentName: 'Journey Orchestration Agent'
      }
    },
    {
      stepNumber: 8,
      action: 'thinking',
      content: 'Preparing email templates and A/B test variations...',
      delay: 7000,
      metadata: {
        agentName: 'Creative Generation Agent'
      }
    },
    {
      stepNumber: 9,
      action: 'thinking',
      content: 'Connecting to marketing platforms and setting up automation...',
      delay: 9000,
      metadata: {
        agentName: 'Activation & Integration Agent'
      }
    },
    {
      stepNumber: 10,
      action: 'assistant-message',
      content: 'Your campaign is ready! I\'ve created a 3-email sequence with SMS backup for non-openers. The journey includes A/B testing for subject lines and targets your 45k Halloween audience. Click any step to review the details.',
      delay: 11000
    },
    {
      stepNumber: 11,
      action: 'navigate',
      delay: 12000,
      metadata: {
        destination: '/journey-builder'
      }
    }
  ]
};

// Demo flow registry
export const demoFlows = {
  'campaign-brief': campaignBriefFlow,
  'campaign-execution': campaignExecutionFlow
};

/**
 * Demo Flow Player Utilities
 */

export class DemoFlowPlayer {
  private currentFlow: DemoFlow | null = null;
  private currentStepIndex = 0;
  private isPlaying = false;
  private speed = 1; // 1x, 2x, 3x speed multiplier
  private timeouts: NodeJS.Timeout[] = [];
  private onStateChange?: (state: any) => void;

  constructor(onStateChange?: (state: any) => void) {
    this.onStateChange = onStateChange;
  }

  /**
   * Load a demo flow
   */
  loadFlow(flowId: DemoFlowType) {
    if (!flowId || !demoFlows[flowId]) {
      throw new Error(`Demo flow ${flowId} not found`);
    }

    this.currentFlow = demoFlows[flowId];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.clearTimeouts();
  }

  /**
   * Start playing the demo flow
   */
  play() {
    if (!this.currentFlow) {
      throw new Error('No demo flow loaded');
    }

    this.isPlaying = true;
    this.executeStep();
  }

  /**
   * Pause the demo flow
   */
  pause() {
    this.isPlaying = false;
    this.clearTimeouts();
  }

  /**
   * Reset the demo flow to the beginning
   */
  reset() {
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.clearTimeouts();
  }

  /**
   * Skip to the end of the demo flow
   */
  skipToEnd() {
    if (!this.currentFlow) return;

    this.clearTimeouts();
    this.currentStepIndex = this.currentFlow.steps.length - 1;
    this.executeStep();
  }

  /**
   * Set playback speed
   */
  setSpeed(speed: number) {
    this.speed = speed;
  }

  /**
   * Execute the current step
   */
  private executeStep() {
    if (!this.currentFlow || !this.isPlaying) return;

    const step = this.currentFlow.steps[this.currentStepIndex];
    if (!step) return;

    // Calculate delay based on speed
    const delay = step.delay / this.speed;

    const timeout = setTimeout(() => {
      this.processStep(step);

      // Move to next step
      this.currentStepIndex++;

      if (this.currentStepIndex < this.currentFlow!.steps.length) {
        this.executeStep();
      } else {
        this.isPlaying = false;
      }
    }, delay);

    this.timeouts.push(timeout);
  }

  /**
   * Process an individual step
   */
  private processStep(step: DemoFlowStep) {
    if (this.onStateChange) {
      this.onStateChange({
        type: step.action,
        data: {
          content: step.content,
          metadata: step.metadata
        }
      });
    }
  }

  /**
   * Clear all timeouts
   */
  private clearTimeouts() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  }

  /**
   * Get current state
   */
  getState() {
    return {
      currentFlow: this.currentFlow,
      currentStepIndex: this.currentStepIndex,
      isPlaying: this.isPlaying,
      speed: this.speed,
      progress: this.currentFlow ?
        (this.currentStepIndex / this.currentFlow.steps.length) * 100 : 0
    };
  }
}

/**
 * Demo flow utilities
 */
export const demoFlowUtils = {
  /**
   * Get all available demo flows
   */
  getAllFlows(): DemoFlow[] {
    return Object.values(demoFlows);
  },

  /**
   * Get a specific demo flow by ID
   */
  getFlow(id: DemoFlowType): DemoFlow | null {
    return id ? demoFlows[id] : null;
  },

  /**
   * Generate a random message ID
   */
  generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Create a demo message object
   */
  createMessage(
    type: 'user' | 'assistant',
    content: string,
    metadata?: any
  ): Message {
    return {
      id: this.generateMessageId(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
  }
};