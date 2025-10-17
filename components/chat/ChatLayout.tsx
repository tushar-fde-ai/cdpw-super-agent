'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatHeader from './ChatHeader';
import ConversationArea from './ConversationArea';
import ChatInput from './ChatInput';
import OrchestrationPanel from './orchestration/OrchestrationPanel';
import { Message } from './messages/types';
import { DEMO_INITIAL_MESSAGES, DEMO_CONTINUATION_MESSAGES, DEMO_ABTEST_MESSAGES, simulateMessageFlow } from './messages/demoData';
import { Workflow } from './orchestration/types';
import { DocumentViewerModal } from './document-viewer';
import { sampleCampaignBrief } from './document-viewer/sampleData';
import DemoFlowPlayerComponent, { useDemoFlowPlayer } from '@/components/demo/DemoFlowPlayer';
import { demoFlowUtils, DemoFlowType } from '@/lib/demo-flows';

// Key for localStorage persistence
const ORCHESTRATION_PANEL_KEY = 'msa_orchestration_panel_expanded';

// Dynamic workflow based on actual chat progression
const getDynamicWorkflow = (completedAgents: Set<string>, activeAgent: string | null): Workflow => {
  const baseWorkflow = {
    id: 'campaign-brief-creation',
    name: 'Halloween Campaign Brief Creation',
    totalSteps: 5,
  };

  // Define all agents in order
  const allAgents = [
    { id: 'campaign-strategy', description: 'Analyzing campaign requirements', finalDescription: 'Campaign brief compiled and delivered' },
    { id: 'audience-persona', description: 'Building target personas', finalDescription: 'Target personas completed' },
    { id: 'data-analytics', description: 'Analyzing market data', finalDescription: 'Market analysis completed' },
    { id: 'journey-orchestration', description: 'Designing customer journey', finalDescription: 'Customer journey designed' },
    { id: 'campaign-strategy-final', description: 'Compiling final campaign brief', finalDescription: 'Campaign brief compiled and delivered' }
  ];

  // Build steps dynamically based on completed agents and active agent
  const steps = allAgents.map((agent, index) => {
    let status: 'complete' | 'active' | 'waiting' | 'idle' = 'idle';
    let description = agent.description;

    if (completedAgents.has(agent.id)) {
      status = 'complete';
      description = agent.finalDescription;
    } else if (activeAgent === agent.id) {
      status = 'active';
    } else if (completedAgents.size >= index) {
      status = 'waiting';
    }

    return {
      agentId: agent.id.replace('-final', ''), // Remove -final suffix for display
      description,
      status,
      order: index + 1
    };
  });

  // Calculate current step and progress
  const currentStep = Math.max(1, completedAgents.size + (activeAgent ? 1 : 0));
  const overallProgress = Math.min(100, (completedAgents.size / allAgents.length) * 100);

  // Determine current task description
  let currentTaskDescription = '';
  if (activeAgent === 'campaign-strategy') {
    currentTaskDescription = 'Gathering campaign budget requirements from user';
  } else if (activeAgent === 'audience-persona') {
    currentTaskDescription = 'Analyzing customer data to identify optimal target segments';
  } else if (activeAgent === 'data-analytics') {
    currentTaskDescription = 'Analyzing market data and competitor campaigns for insights';
  } else if (activeAgent === 'journey-orchestration') {
    currentTaskDescription = 'Designing customer journey flow and campaign automation';
  } else if (activeAgent === 'campaign-strategy-final') {
    currentTaskDescription = 'Compiling final campaign brief with recommendations';
  } else if (completedAgents.size === allAgents.length) {
    currentTaskDescription = 'Campaign brief completed with comprehensive strategy and recommendations';
  }

  return {
    ...baseWorkflow,
    currentStep,
    overallProgress,
    currentTaskDescription,
    steps
  };
};

export default function ChatLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { demoFlow, isDemoMode, startDemo, stopDemo } = useDemoFlowPlayer();

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoPhase, setDemoPhase] = useState<'initial' | 'continuation' | 'complete' | 'abtest'>('initial');
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | undefined>(undefined);
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const streamCleanupRef = useRef<(() => void) | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isOrchestrationExpanded, setIsOrchestrationExpanded] = useState(false);

  // Save orchestration panel state to localStorage
  useEffect(() => {
    localStorage.setItem(ORCHESTRATION_PANEL_KEY, JSON.stringify(isOrchestrationExpanded));
  }, [isOrchestrationExpanded]);

  // Update workflow when messages change - track agent progression dynamically
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only process assistant messages and question prompts for agent tracking
    if (lastMessage?.type === 'assistant-text' || lastMessage?.type === 'question') {
      const content = lastMessage.content || '';
      const agentName = lastMessage.metadata?.agentName;

      // Track agent progression based on message content and agent names
      if (lastMessage.type === 'question' && (content.includes('budget') || lastMessage.metadata?.questions?.[0]?.includes('budget'))) {
        // Budget question means Campaign Strategy agent is active
        setActiveAgent('campaign-strategy');
      } else if (agentName === 'Campaign Strategy Agent') {
        if (content.includes('comprehensive campaign brief') || content.includes('analyzing')) {
          setActiveAgent('campaign-strategy');
        } else if (content.includes('personas') || content.includes('target audience')) {
          setCompletedAgents(prev => new Set([...prev, 'campaign-strategy']));
          setActiveAgent('audience-persona');
        }
      } else if (agentName === 'Audience & Persona Agent') {
        setCompletedAgents(prev => new Set([...prev, 'audience-persona']));
        setActiveAgent('data-analytics');
      } else if (agentName === 'Data Analytics Agent') {
        setCompletedAgents(prev => new Set([...prev, 'data-analytics']));
        setActiveAgent('journey-orchestration');
      } else if (agentName === 'Journey Orchestration Agent') {
        if (content.includes('customer flow') || content.includes('ready to launch')) {
          setCompletedAgents(prev => new Set([...prev, 'journey-orchestration']));
          setActiveAgent('campaign-strategy-final');
        }
      } else if (agentName === 'Activation & Integration Agent' || content.includes('Campaign Successfully Launched')) {
        setCompletedAgents(prev => new Set([...prev, 'campaign-strategy-final']));
        setActiveAgent(null);
      }

      // Update workflow with current state
      setCurrentWorkflow(getDynamicWorkflow(completedAgents, activeAgent));
    }
  }, [messages, completedAgents, activeAgent]);

  // Handle URL parameters for demo flows and prompts
  useEffect(() => {
    const demoParam = searchParams.get('demo') as DemoFlowType;
    const promptParam = searchParams.get('prompt');

    if (demoParam) {
      const flow = demoFlowUtils.getFlow(demoParam);
      if (flow) {
        startDemo(flow);
        setIsOrchestrationExpanded(true);
        // Clear URL parameters after processing
        router.replace('/chat');
      }
    } else if (promptParam) {
      // Handle prompt parameter by adding a user message
      const userMessage = demoFlowUtils.createMessage('user', promptParam);
      setMessages([userMessage]);
      // Clear URL parameters after processing
      router.replace('/chat');
    }
  }, [searchParams, startDemo, router]);

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
      }
    };
  }, []);

  // Listen for campaign activation events from Journey Builder
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campaign-activation' && e.newValue) {
        try {
          const activationData = JSON.parse(e.newValue);

          // Add activation message to chat
          const activationMessage: Message = {
            id: `activation-${Date.now()}`,
            type: 'assistant-text',
            content: activationData.message,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Activation & Integration Agent',
              agentColor: '#10b981'
            }
          };

          setMessages(prev => [...prev, activationMessage]);

          // Clear the localStorage entry after processing
          localStorage.removeItem('campaign-activation');
        } catch (error) {
          console.error('Error parsing activation data:', error);
        }
      }
    };

    // Listen for storage events (cross-tab communication)
    window.addEventListener('storage', handleStorageChange);

    // Also check on mount for any pending activation data
    const pendingActivation = localStorage.getItem('campaign-activation');
    if (pendingActivation) {
      try {
        const activationData = JSON.parse(pendingActivation);
        const activationMessage: Message = {
          id: `activation-${Date.now()}`,
          type: 'assistant-text',
          content: activationData.message,
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Activation & Integration Agent',
            agentColor: '#10b981'
          }
        };

        setMessages(prev => [...prev, activationMessage]);
        localStorage.removeItem('campaign-activation');
      } catch (error) {
        console.error('Error parsing pending activation data:', error);
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Toggle orchestration panel
  const toggleOrchestration = () => {
    setIsOrchestrationExpanded(prev => !prev);
  };


  // Handle question submission for campaign flows
  const handleQuestionSubmit = (answers: string[]) => {
    // Check if we have a Halloween campaign workflow active or if we're in A/B test mode
    const isHalloweenFlow = currentWorkflow?.id === 'campaign-brief-creation';
    const isABTestFlow = demoPhase === 'abtest';

    if (isHalloweenFlow || isABTestFlow) {
      // Add user response message
      const userAnswerMessage: Message = {
        id: 'user-answer',
        type: 'user-text',
        content: answers.join(', '),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userAnswerMessage]);

      // Determine which flow to continue with
      const messagesToUse = isABTestFlow ? DEMO_ABTEST_MESSAGES.slice(1) : DEMO_CONTINUATION_MESSAGES; // Skip first question message for A/B test
      const delaysToUse = isABTestFlow ? [1000, 2000, 1500, 2000, 1500] : [1000, 2000, 1500, 2000, 1000, 2000, 1500, 2000, 4000, 1500, 2000];

      if (isABTestFlow) {
        // Keep A/B test phase
        setDemoPhase('abtest');
      } else if (isHalloweenFlow) {
        // For Halloween flow, start the continuation with proper workflow progression
        setDemoPhase('continuation');
        setActiveAgent('audience-persona');
        setCompletedAgents(new Set(['campaign-strategy']));
      }

      // Continue with the appropriate demo flow
      let currentIndex = 0;

      const streamContinuation = () => {
        if (currentIndex < messagesToUse.length) {
          const message = {
            ...messagesToUse[currentIndex],
            timestamp: new Date()
          };

          setMessages(prev => {
            // If the current message is a thinking indicator, remove previous thinking indicators
            if (message.type === 'thinking') {
              return [...prev, message];
            } else {
              // For non-thinking messages, remove all thinking indicators and add the new message
              const withoutThinking = prev.filter(msg => msg.type !== 'thinking');
              return [...withoutThinking, message];
            }
          });

          // Workflow state will be updated dynamically by the useEffect hook

          currentIndex++;

          // Schedule next message with appropriate delay
          const nextDelay = delaysToUse[currentIndex] || 2000;
          const timeoutId = setTimeout(streamContinuation, nextDelay);

          // Store cleanup function
          streamCleanupRef.current = () => clearTimeout(timeoutId);
        } else {
          streamCleanupRef.current = null;
          if (!isABTestFlow) {
            setDemoPhase('complete');
          }
        }
      };

      // Start continuation streaming after a short delay
      setTimeout(streamContinuation, 1000);
    }
  };

  // Handle scroll events - auto-collapse orchestration panel after 2 seconds of no scrolling
  const handleScroll = () => {
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to collapse after 2 seconds of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (isOrchestrationExpanded) {
        setIsOrchestrationExpanded(false);
      }
    }, 2000);
  };

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle action button clicks
  const handleActionClick = (actionLabel: string) => {
    switch (actionLabel) {
      case 'Set Up A/B Test':
        // Start A/B test flow
        setDemoPhase('abtest');

        // Add the A/B test question
        const abtestQuestion = {
          ...DEMO_ABTEST_MESSAGES[0],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, abtestQuestion]);
        break;

      case 'Use Recommended Strategy':
        // Handle using the recommended A/B test strategy
        const recommendedMessage: Message = {
          id: 'recommended-strategy-applied',
          type: 'assistant-text',
          content: 'Excellent choice! I\'ve applied the recommended strategy: Subject Line B "Unlock Halloween Magic - 30% Off Inside!" will be used for your campaign. This strategy shows 23% higher open rates and should drive better engagement with your millennial audience.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#7c3aed'
          }
        };

        setMessages(prev => [...prev, recommendedMessage]);

        // Add follow-up message with document and approval options
        setTimeout(() => {
          const followUpMessage: Message = {
            id: 'strategy-next-steps',
            type: 'assistant-text',
            content: 'Your updated campaign brief is ready with the optimized strategy. Please review the document and set up an approval workflow before proceeding to the Journey Builder Canvas.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Campaign Strategy Agent',
              agentColor: '#7c3aed',
              actions: [
                { label: 'View Updated Campaign Brief', variant: 'primary', action: 'View PDF' },
                { label: 'Set Up Approval Workflow', variant: 'secondary', action: 'Set Up Approval Workflow' }
              ]
            }
          };

          setMessages(prev => [...prev, followUpMessage]);
        }, 1500);
        break;

      case 'View Detailed A/B Report':
        // Handle viewing detailed A/B test report
        const reportMessage: Message = {
          id: 'detailed-report',
          type: 'assistant-text',
          content: 'Here\'s your detailed A/B test analysis report. The data shows Subject Line B outperformed Subject Line A across all key metrics: 23% higher open rates (34.2% vs 27.8%), 18% higher click-through rates (4.1% vs 3.5%), and 15% better conversion rates (2.8% vs 2.4%). The improvement is statistically significant with 95% confidence.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Data Analytics Agent',
            agentColor: '#14b8a6',
            documentData: {
              title: 'A/B Test Detailed Analysis Report',
              description: 'Comprehensive statistical analysis of subject line performance',
              fileType: 'PDF'
            }
          }
        };

        setMessages(prev => [...prev, reportMessage]);
        break;


      case 'View PDF':
        // Open document viewer
        setIsDocumentViewerOpen(true);
        break;

      case 'Set Up Approval Workflow':
        // Open document viewer to set up approval workflow
        setIsDocumentViewerOpen(true);
        break;

      case 'approval-submitted':
        // Handle approval workflow submission
        const approvalMessage: Message = {
          id: 'approval-confirmation',
          type: 'assistant-text',
          content: 'Approval workflow has been sent to Sarah Chen (CMO) and Mike Johnson (Marketing Lead). They will receive email notifications and can review the document within the next 3 days.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#7c3aed'
          }
        };

        setMessages(prev => [...prev, approvalMessage]);

        // Add follow-up message with Journey Builder option
        setTimeout(() => {
          const journeyMessage: Message = {
            id: 'journey-ready',
            type: 'assistant-text',
            content: 'Perfect! Now that the approval workflow is set up, you can proceed to design your customer journey in the Journey Builder Canvas.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Campaign Strategy Agent',
              agentColor: '#7c3aed',
              actions: [
                { label: 'Open Journey Builder Canvas', variant: 'primary', action: 'navigate-to-journey' }
              ]
            }
          };

          setMessages(prev => [...prev, journeyMessage]);
        }, 2000);
        break;

      case 'navigate-to-journey':
        // Navigate to journey builder page in new tab
        window.open('/journey-builder', '_blank');
        break;

      case 'Continue to Campaign Builder':
      case 'start-campaign-execution':
        // Activate Journey Orchestration Agent and add launch confirmation message
        setActiveAgent('journey-orchestration');

        const launchMessage: Message = {
          id: 'campaign-launch-update',
          type: 'assistant-text',
          content: 'Great! I\'m now transitioning to campaign execution mode. The Journey Orchestration Agent is designing your customer flow, and once complete, we\'ll have your Halloween campaign ready to launch.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Journey Orchestration Agent',
            agentColor: '#f97316'
          }
        };

        setMessages(prev => [...prev, launchMessage]);
        break;

      case 'campaign-launched':
        // Complete all agents and clear active agent
        setCompletedAgents(new Set(['campaign-strategy', 'audience-persona', 'data-analytics', 'journey-orchestration', 'campaign-strategy-final']));
        setActiveAgent(null);

        const successMessage: Message = {
          id: 'campaign-launch-success',
          type: 'assistant-text',
          content: '🎉 Campaign Successfully Launched! Your Halloween campaign is now live and running. All agents have completed their tasks, and your campaign is being executed across email and social media channels. You can monitor performance in real-time through the analytics dashboard.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Activation & Integration Agent',
            agentColor: '#10b981',
            actions: [
              { label: 'View Campaign Analytics', variant: 'primary' },
              { label: 'Go to Journey Builder', variant: 'secondary', action: 'navigate-to-journey' }
            ]
          }
        };

        setMessages(prev => [...prev, successMessage]);
        break;

      default:
        console.log('Unhandled action:', actionLabel);
    }
  };

  // Handle sending new messages
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user-text',
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Check if this is the Halloween campaign prompt
    if (content === 'I have a Halloween themed campaign that should deploy two weeks before Halloween') {
      // Start the Halloween demo flow
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant-text',
          content: 'Great! I\'ll help you create a comprehensive campaign brief for your Halloween campaign. Let me find the right agents for you...',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Marketing Super Agent',
            agentColor: '#7c3aed'
          }
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Show a brief "finding agents" state, then activate orchestration panel
        setTimeout(() => {
          // Activate orchestration panel and set the workflow
          setIsOrchestrationExpanded(true);

          // Add the "found agents" message
          const foundAgentsMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'assistant-text',
            content: 'Perfect! I\'ve assembled your specialized marketing team. Let me gather some information to get started.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Campaign Strategy Agent',
              agentColor: '#7c3aed'
            }
          };

          setMessages(prev => [...prev, foundAgentsMessage]);

          // Continue with the question prompt after another delay
          setTimeout(() => {
            const questionMessage: Message = {
              id: (Date.now() + 3).toString(),
              type: 'question',
              content: '',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                questions: [
                  'What is your estimated budget range for this Halloween campaign?',
                ],
                questionOptions: [
                  {
                    question: 'What is your estimated budget range for this Halloween campaign?',
                    options: ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K+']
                  }
                ]
              }
            };

            setMessages(prev => [...prev, questionMessage]);
          }, 1500);
        }, 2000);
      }, 1000);
    } else {
      // Handle other messages normally
      setIsLoading(true);

      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant-text',
          content: `Thank you for your message: "${content}". I'm analyzing this request and will coordinate with the appropriate agents to provide you with a comprehensive response. Let me break this down and get our team working on it.`,
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#7c3aed'
          }
        };

        setMessages(prev => [...prev, agentMessage]);
        setIsLoading(false);
      }, 2000);
    }
  };

  // Handle document viewer close
  const handleDocumentViewerClose = () => {
    setIsDocumentViewerOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <ChatHeader
        onToggleOrchestration={toggleOrchestration}
        isOrchestrationExpanded={isOrchestrationExpanded}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16 pb-20 overflow-hidden">
        {/* Orchestration Panel - Collapsible */}
        <OrchestrationPanel
          isExpanded={isOrchestrationExpanded}
          onToggle={toggleOrchestration}
          activeWorkflow={currentWorkflow}
        />

        {/* Conversation Area - Full Width, Scrollable */}
        <ConversationArea
          messages={messages}
          isLoading={isLoading}
          onStarterPromptClick={handleSendMessage}
          onQuestionSubmit={handleQuestionSubmit}
          onActionClick={handleActionClick}
          onScroll={handleScroll}
        />
      </div>

      {/* Fixed Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="Type your message here..."
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocumentViewerOpen}
        onClose={handleDocumentViewerClose}
        document={sampleCampaignBrief}
        onActionClick={handleActionClick}
      />

      {/* Demo Flow Player */}
      {isDemoMode && demoFlow && (
        <DemoFlowPlayerComponent
          flow={demoFlow}
          autoPlay={true}
          onStateChange={(state) => {
            // Handle demo flow state changes
            if (state.type === 'user-message') {
              const message = demoFlowUtils.createMessage('user', state.data.content, state.data.metadata);
              setMessages(prev => [...prev, message]);
            } else if (state.type === 'assistant-message') {
              const message = demoFlowUtils.createMessage('assistant', state.data.content, state.data.metadata);
              setMessages(prev => [...prev, message]);
            } else if (state.type === 'navigate') {
              // Handle navigation to other pages
              router.push(state.data.metadata.destination);
            }
          }}
          onExit={() => {
            stopDemo();
            setMessages([]);
          }}
        />
      )}
    </div>
  );
}