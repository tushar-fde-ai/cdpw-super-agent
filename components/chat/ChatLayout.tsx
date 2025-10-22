'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatHeader from './ChatHeader';
import ConversationArea from './ConversationArea';
import CompetitiveResearchInterface from './CompetitiveResearchInterface';
import CampaignExecutionInterface from './CampaignExecutionInterface';
import { Message } from './messages/types';
import { DEMO_CONTINUATION_MESSAGES, DEMO_ABTEST_MESSAGES } from './messages/demoData';
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

  // Message ID counter to ensure unique IDs
  const messageIdCounterRef = useRef(0);

  // Function to generate unique message IDs
  const generateMessageId = () => {
    messageIdCounterRef.current += 1;
    return `${Date.now()}-${messageIdCounterRef.current}`;
  };

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
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');
  const [isCompetitiveMode, setIsCompetitiveMode] = useState(false);
  const [isCampaignExecutionMode, setIsCampaignExecutionMode] = useState(false);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const processedParams = useRef<Set<string>>(new Set());

  // Budget state management
  const [campaignBudget, setCampaignBudget] = useState<string>('$50K - $100K'); // Default value
  const [abtestBudget, setAbtestBudget] = useState<string>('$100K+'); // Default value

  // Helper function to parse budget string to numeric value
  const parseBudgetToNumber = (budgetString: string): number => {
    // Extract numeric values from budget ranges
    if (budgetString.includes('Under')) {
      return 10000; // Under $10K
    } else if (budgetString.includes('$10K - $50K')) {
      return 30000; // Mid-point
    } else if (budgetString.includes('$50K - $100K')) {
      return 75000; // Mid-point
    } else if (budgetString.includes('$100K+')) {
      return 150000; // $150K as example
    }
    return 50000; // Default
  };

  // Helper function to format budget for display
  const formatBudgetForDisplay = (budgetString: string): string => {
    const numericBudget = parseBudgetToNumber(budgetString);
    return `$${(numericBudget / 1000).toFixed(0)},000`;
  };

  // Helper function to generate dynamic campaign brief document
  const generateCampaignBrief = (budgetString: string) => {
    const totalBudget = parseBudgetToNumber(budgetString);
    const emailBudget = (totalBudget * 0.6).toFixed(0);
    const socialBudget = (totalBudget * 0.4).toFixed(0);
    const revenueTarget = (totalBudget * 3).toFixed(0);

    return {
      ...sampleCampaignBrief,
      content: [
        {
          id: 'exec-summary',
          heading: 'Executive Summary',
          content: `This Halloween 2025 campaign targets millennials aged 25-40 with spooky-themed promotions designed to drive online sales during the peak Halloween shopping season. With a strategic $${Number(totalBudget).toLocaleString()} budget allocated across email marketing and social media channels, we aim to achieve a 15% increase in October revenue compared to last year. Our data-driven approach focuses on high-engagement customer segments who have shown strong seasonal purchasing behavior, leveraging personalized messaging and exclusive Halloween offers to maximize conversion rates.`
        },
        {
          id: 'objectives',
          heading: 'Campaign Objectives',
          content: 'Primary Goal: Drive online sales and increase October revenue by 15% year-over-year\n\nSecondary Goals:\n• Increase email list engagement by 25%\n• Grow social media following by 2,000 new followers\n• Build brand awareness among target demographic\n• Test new creative formats for future seasonal campaigns\n• Achieve customer acquisition cost under $25\n• Maintain brand consistency across all touchpoints'
        },
        ...sampleCampaignBrief.content.slice(2, 6), // Keep audience, strategy, tactics, and metrics sections (skip budget at index 6)
        {
          id: 'budget-dynamic',
          heading: 'Budget Allocation',
          content: `Total Campaign Budget: $${Number(totalBudget).toLocaleString()}\n\nEmail Marketing: $${Number(emailBudget).toLocaleString()} (60%)\n• Platform costs: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n• Creative development: $${(Number(emailBudget) * 0.27).toFixed(0).toLocaleString()}\n• Automation setup: $${(Number(emailBudget) * 0.23).toFixed(0).toLocaleString()}\n• A/B testing: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n• Analytics & reporting: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n\nSocial Media: $${Number(socialBudget).toLocaleString()} (40%)\n• Paid advertising: $${(Number(socialBudget) * 0.6).toFixed(0).toLocaleString()}\n• Content creation: $${(Number(socialBudget) * 0.25).toFixed(0).toLocaleString()}\n• Influencer partnerships: $${(Number(socialBudget) * 0.1).toFixed(0).toLocaleString()}\n• Community management: $${(Number(socialBudget) * 0.05).toFixed(0).toLocaleString()}`
        },
        ...sampleCampaignBrief.content.slice(7) // Keep timeline section (index 7)
      ]
    };
  };

  // Handle sending new messages
  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
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
          id: generateMessageId(),
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
            id: generateMessageId(),
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
              id: generateMessageId(),
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
    } else if (isCompetitiveMode) {
      // Handle competitive intelligence questions
      setIsLoading(true);

      setTimeout(() => {
        // Generate different responses based on question content
        let agentMessage: Message;

        if (content.toLowerCase().includes('creative') || content.toLowerCase().includes('visual') || content.toLowerCase().includes('theme')) {
          agentMessage = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: 'I\'ve analyzed Halloween creative strategies across major brands. Key trends include:\n\n• **Nostalgia-driven themes** - 68% of brands are incorporating 80s/90s Halloween aesthetics\n• **Interactive elements** - AR filters and gamification up 45% from last year\n• **Sustainable messaging** - 34% emphasizing eco-friendly Halloween practices\n• **Personalization** - Custom costume/décor recommendations based on user data\n\nNotable examples: Target\'s retro Halloween collection, Sephora\'s AR makeup try-on, and Whole Foods\' zero-waste Halloween guide.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Deep Research Agent',
              agentColor: '#8b5cf6'
            }
          };
        } else if (content.toLowerCase().includes('audience') || content.toLowerCase().includes('targeting') || content.toLowerCase().includes('demographic')) {
          agentMessage = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: 'Competitor audience analysis reveals strategic shifts:\n\n• **Primary target**: Millennials (25-40) with 73% of ad spend allocation\n• **Growing segment**: Gen Z parents (22-30) - up 156% in targeting\n• **Geographic focus**: Suburban markets showing 23% higher engagement\n• **Income targeting**: $50K-$100K household income sweet spot\n\nKey insight: Brands are moving away from broad "Halloween enthusiasts" to specific personas like "Pinterest Halloween Moms" and "Last-minute Halloween Shoppers".',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Competitive Intelligence Agent',
              agentColor: '#ec4899'
            }
          };
        } else if (content.toLowerCase().includes('budget') || content.toLowerCase().includes('investment') || content.toLowerCase().includes('spend')) {
          agentMessage = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: 'Halloween campaign investment analysis:\n\n• **Average spend increase**: 28% vs last year across retail brands\n• **Budget allocation**: 45% digital, 35% traditional, 20% experiential\n• **Peak spending window**: September 15 - October 25\n• **ROI leaders**: Email marketing (4.2x), social video (3.8x), influencer partnerships (3.1x)\n\n**Whitespace opportunity**: Mid-tier brands ($25K-$75K budgets) are underinvesting in TikTok, creating openings for higher engagement rates at lower costs.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Whitespace Analysis Agent',
              agentColor: '#06b6d4'
            }
          };
        } else {
          agentMessage = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `Analyzing competitive landscape for: "${content}"\n\nI'm coordinating with our research agents to gather comprehensive intelligence. This analysis will include competitor strategies, market gaps, and actionable insights for your Halloween campaign.\n\nWhich specific aspect would you like me to focus on: creative strategies, audience targeting, channel mix, or timing & investment?`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Deep Research Agent',
              agentColor: '#8b5cf6'
            }
          };
        }

        setMessages(prev => [...prev, agentMessage]);
        setIsLoading(false);
      }, 2000);
    } else if (isCampaignExecutionMode) {
      // Handle campaign execution questions and brief uploads
      setIsLoading(true);

      setTimeout(() => {
        // Check for audience targeting request
        const hasAudienceRequest =
          (content.toLowerCase().includes('hyper-personali') && content.toLowerCase().includes('high churn')) ||
          (content.toLowerCase().includes('target') && content.toLowerCase().includes('high churn')) ||
          (content.toLowerCase().includes('create') && content.toLowerCase().includes('audience') && content.toLowerCase().includes('high churn')) ||
          (content.toLowerCase().includes('segment') && content.toLowerCase().includes('high churn'));

        if (hasAudienceRequest) {
          const audienceMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: 'Perfect! I\'m activating the Audience & Segment Analytics Agent to analyze your high churn user segment in the United States. Let me identify the key behavioral patterns and create hyper-personalized targeting strategies.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Audience & Segment Analytics Agent',
              agentColor: '#14b8a6'
            }
          };

          setMessages(prev => [...prev, audienceMessage]);
        } else if (content.toLowerCase().includes('build me a campaign') || content.toLowerCase().includes('create campaign')) {
          const executionMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: 'Perfect! I\'ve analyzed your request and I\'m now assembling the optimal agent team to create your campaign from the brief. Let me identify the specialized agents and applications we\'ll need.',
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Marketing Super Agent',
              agentColor: '#7c3aed'
            }
          };

          setMessages(prev => [...prev, executionMessage]);
        } else {
          const defaultMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `I'm analyzing your request: "${content}". To build your campaign, I'll need to reference your approved campaign brief. Please upload the brief or type "build me a campaign from this campaign brief" when you're ready to proceed.`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Marketing Super Agent',
              agentColor: '#7c3aed'
            }
          };

          setMessages(prev => [...prev, defaultMessage]);
        }
        setIsLoading(false);
      }, 2000);
    } else {
      // Handle other messages normally
      setIsLoading(true);

      setTimeout(() => {
        const agentMessage: Message = {
          id: generateMessageId(),
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
  }, [generateMessageId]);

  // Save orchestration panel state to localStorage
  useEffect(() => {
    localStorage.setItem(ORCHESTRATION_PANEL_KEY, JSON.stringify(isOrchestrationExpanded));
  }, [isOrchestrationExpanded]);

  // Update workflow when messages change - track agent progression dynamically
  useEffect(() => {
    if (messages.length === 0) return;

    // Skip workflow progression if we're in A/B test mode
    if (demoPhase === 'abtest') return;

    const lastMessage = messages[messages.length - 1];

    // Skip if we've already processed this message
    if (processedMessageIds.current.has(lastMessage.id)) return;

    // Only process assistant messages and question prompts for agent tracking
    if (lastMessage?.type === 'assistant-text' || lastMessage?.type === 'question') {
      const content = lastMessage.content || '';
      const agentName = lastMessage.metadata?.agentName;

      // Mark message as processed
      processedMessageIds.current.add(lastMessage.id);

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
    }
  }, [messages, demoPhase]);

  // Update workflow whenever completed agents or active agent changes
  useEffect(() => {
    setCurrentWorkflow(getDynamicWorkflow(completedAgents, activeAgent));
  }, [completedAgents, activeAgent]);

  // Handle URL parameters for demo flows and prompts
  useEffect(() => {
    const demoParam = searchParams.get('demo') as DemoFlowType;
    const promptParam = searchParams.get('prompt');
    const campaignParam = searchParams.get('campaign');
    const viewParam = searchParams.get('view');
    const modeParam = searchParams.get('mode');
    const viewDocumentParam = searchParams.get('viewDocument');

    // Create a unique key for this parameter combination
    const paramKey = `${demoParam || 'none'}-${promptParam || 'none'}-${campaignParam || 'none'}-${viewParam || 'none'}-${modeParam || 'none'}-${viewDocumentParam || 'none'}`;

    // Skip if we've already processed these parameters
    if (processedParams.current.has(paramKey)) {
      return;
    }

    // Handle viewDocument parameter - open document viewer modal
    if (viewDocumentParam) {
      processedParams.current.add(paramKey);
      setIsDocumentViewerOpen(true);
      // Clear URL parameters after processing
      router.replace('/chat');
      return;
    }

    if (modeParam === 'competitive' && campaignParam === 'halloween-brief') {
      // Handle competitive intelligence mode
      processedParams.current.add(paramKey);
      setIsCompetitiveMode(true);

      // Initialize competitive intelligence messages
      const competitiveIntroMessage: Message = {
        id: 'competitive-intro',
        type: 'assistant-text',
        content: 'Welcome to Competitive Intelligence Research! I\'ve activated three specialized agents to help you analyze Halloween campaign strategies from other brands.',
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentName: 'Deep Research Agent',
          agentColor: '#8b5cf6'
        }
      };

      setMessages([competitiveIntroMessage]);

      // Clear URL parameters after processing
      router.replace('/chat');
    } else if (modeParam === 'execution' && campaignParam === 'halloween-brief') {
      // Handle campaign execution mode
      processedParams.current.add(paramKey);
      setIsCampaignExecutionMode(true);

      // Initialize campaign execution messages
      const executionIntroMessage: Message = {
        id: 'execution-intro',
        type: 'assistant-text',
        content: 'Welcome to Campaign Execution! I\'m ready to help you transform your approved campaign brief into a fully orchestrated campaign. Upload your campaign brief or reference it to get started.',
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentName: 'Marketing Super Agent',
          agentColor: '#7c3aed'
        }
      };

      setMessages([executionIntroMessage]);

      // Clear URL parameters after processing
      router.replace('/chat');
    } else if (campaignParam === 'halloween-brief' && viewParam === 'complete') {
      // Load the complete Halloween campaign conversation
      processedParams.current.add(paramKey);

      // Import the complete demo messages (initial + continuation)
      import('./messages/demoData').then(({ DEMO_INITIAL_MESSAGES, DEMO_CONTINUATION_MESSAGES }) => {
        const completeConversation = [
          ...DEMO_INITIAL_MESSAGES,
          // Add a user answer for the budget question
          {
            id: 'user-budget-answer',
            type: 'user-text' as const,
            content: '$50K - $100K',
            sender: 'user' as const,
            timestamp: new Date()
          },
          ...DEMO_CONTINUATION_MESSAGES
        ];

        setMessages(completeConversation);
        setDemoPhase('complete');
        setActiveAgent(null);
        setCompletedAgents(new Set(['campaign-strategy', 'audience-persona', 'data-analytics', 'journey-orchestration']));
        setIsOrchestrationExpanded(true);

        // Set workflow
        setCurrentWorkflow(getDynamicWorkflow(
          new Set(['campaign-strategy', 'audience-persona', 'data-analytics', 'journey-orchestration']),
          null
        ));
      });

      // Clear URL parameters after processing
      router.replace('/chat');
    } else if (demoParam) {
      const flow = demoFlowUtils.getFlow(demoParam);
      if (flow) {
        processedParams.current.add(paramKey);
        startDemo(flow);
        setIsOrchestrationExpanded(true);
        // Clear URL parameters after processing
        router.replace('/chat');
      }
    } else if (promptParam === 'Would you like to setup a Halloween campaign?') {
      // Handle Halloween campaign prompt - show as assistant message with action buttons
      processedParams.current.add(paramKey);

      const halloweenPromptMessage: Message = {
        id: 'halloween-prompt',
        type: 'action-buttons',
        content: 'Would you like to setup a Halloween campaign?',
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentName: 'Marketing Super Agent',
          agentColor: '#7c3aed',
          actions: [
            {
              label: 'Yes, setup Halloween campaign',
              variant: 'primary' as const,
              action: 'halloween-campaign-yes'
            },
            {
              label: 'No, something else',
              variant: 'outline' as const,
              action: 'halloween-campaign-no'
            }
          ]
        }
      };

      setMessages([halloweenPromptMessage]);
      router.replace('/chat');
    } else if (promptParam) {
      // Handle prompt parameter by pre-filling the input field instead of auto-sending
      processedParams.current.add(paramKey);
      // Clear URL parameters after processing but keep the prompt for pre-filling
      router.replace('/chat');
      // Set the pre-filled message for the input field
      setPrefilledMessage(promptParam);
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
            id: generateMessageId(),
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
          id: generateMessageId(),
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
    // Check for A/B test flow in multiple ways to be more robust
    const isABTestFlow = demoPhase === 'abtest';

    // Also check if the last question message was an A/B test question
    const lastQuestionMessage = [...messages].reverse().find(m => m.type === 'question');
    const isABTestQuestion = lastQuestionMessage?.metadata?.isABTestQuestion === true;

    // Final determination: either demoPhase is abtest OR the question was marked as A/B test
    const isActuallyABTestFlow = isABTestFlow || isABTestQuestion;
    const isHalloweenFlow = currentWorkflow?.id === 'campaign-brief-creation' && !isActuallyABTestFlow;

    // Capture budget selection
    const budgetAnswer = answers[0]; // First answer is the budget
    if (isActuallyABTestFlow) {
      // This is A/B test budget selection
      setAbtestBudget(budgetAnswer);
      console.log('💰 A/B Test Budget captured:', budgetAnswer);
    } else if (isHalloweenFlow) {
      // This is initial campaign budget selection
      setCampaignBudget(budgetAnswer);
      console.log('💰 Campaign Budget captured:', budgetAnswer);
    }

    // Debug logging
    console.log('🔍 Question Submit Debug:', {
      demoPhase,
      isABTestFlow,
      isABTestQuestion,
      isActuallyABTestFlow,
      isHalloweenFlow,
      currentWorkflow: currentWorkflow?.id,
      lastQuestionMessage: lastQuestionMessage?.id,
      answers,
      capturedBudget: budgetAnswer
    });

    if (isActuallyABTestFlow || isHalloweenFlow) {
      // Add user response message
      const userAnswerMessage: Message = {
        id: generateMessageId(),
        type: 'user-text',
        content: answers.join(', '),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userAnswerMessage]);

      // Determine which flow to continue with - A/B test takes precedence
      const messagesToUse = isActuallyABTestFlow ? DEMO_ABTEST_MESSAGES.slice(1) : DEMO_CONTINUATION_MESSAGES; // Skip first question message for A/B test
      const delaysToUse = isActuallyABTestFlow ? [1000, 2000, 1500, 2000, 1500] : [1000, 2000, 1500, 2000, 1000, 2000, 1500, 2000, 4000, 1500, 2000];

      // Debug logging for message selection
      console.log('📨 Messages Selected:', {
        isActuallyABTestFlow,
        messageCount: messagesToUse.length,
        messageTypes: messagesToUse.map(m => m.type),
        messageIds: messagesToUse.map(m => m.id)
      });

      if (isActuallyABTestFlow) {
        // Keep A/B test phase and set appropriate agent state
        setDemoPhase('abtest');
        setActiveAgent('data-analytics'); // Data Analytics Agent handles A/B test analysis
      } else if (isHalloweenFlow) {
        // For Halloween flow, start the continuation with proper workflow progression
        setDemoPhase('continuation');
        setActiveAgent('audience-persona');
        setCompletedAgents(new Set(['campaign-strategy']));
      }

      // Helper function to inject budget values into messages
      const injectBudgetIntoMessage = (message: Message, campaignBudgetValue: string, abtestBudgetValue: string): Message => {
        const originalBudget = parseBudgetToNumber(campaignBudgetValue);
        const abtestBudgetNum = parseBudgetToNumber(abtestBudgetValue);

        // Create a copy of the message
        let updatedMessage = { ...message };

        // Update A/B test analysis content with dynamic budgets
        if (message.id === 'ab-4' && message.content) {
          // Calculate dynamic ROI and metrics based on budgets
          const originalROI = (originalBudget * 4.2).toFixed(0);
          const abtestROI = (abtestBudgetNum * 3.8).toFixed(0);
          const originalReach = (originalBudget * 5.5).toFixed(0);
          const abtestReach = (abtestBudgetNum * 3.4).toFixed(0);
          const originalCostPerConv = (originalBudget / (originalBudget * 0.024)).toFixed(0);
          const abtestCostPerConv = (abtestBudgetNum / (abtestBudgetNum * 0.028)).toFixed(0);

          updatedMessage.content = `A/B Test Analysis Complete! Here are the key performance differences between your original budget (${formatBudgetForDisplay(campaignBudgetValue)}) and the test variant (${formatBudgetForDisplay(abtestBudgetValue)}):\n\n**ROI Impact:** The higher budget offers similar returns (${(abtestBudgetNum / originalBudget * 3.8).toFixed(1)}x vs 4.2x)\n**Reach Impact:** +${((abtestBudgetNum - originalBudget) / originalBudget * 100).toFixed(0)}% more people reached\n**Budget Efficiency:** Better cost per conversion at ${formatBudgetForDisplay(abtestBudgetValue)}\n**Conversion Rate:** Higher conversion rate (2.8% vs 2.4%, +17%)`;
        }

        // Update A/B test recommendation
        if (message.id === 'ab-5') {
          updatedMessage.content = `**Recommendation:** ${abtestBudgetNum > originalBudget ? `The higher budget (${formatBudgetForDisplay(abtestBudgetValue)}) increases reach significantly but with slightly lower ROI. Start with your original budget (${formatBudgetForDisplay(campaignBudgetValue)}) for better returns, then scale up if performance meets targets.` : `Your original budget (${formatBudgetForDisplay(campaignBudgetValue)}) offers better ROI. The lower test budget (${formatBudgetForDisplay(abtestBudgetValue)}) is more cost-efficient but reaches fewer people.`}`;
        }

        return updatedMessage;
      };

      // Continue with the appropriate demo flow
      let currentIndex = 0;

      const streamContinuation = () => {
        if (currentIndex < messagesToUse.length) {
          let message = {
            ...messagesToUse[currentIndex],
            timestamp: new Date()
          };

          // Inject budget values into A/B test messages
          if (isActuallyABTestFlow) {
            message = injectBudgetIntoMessage(message, campaignBudget, abtestBudget);
          }

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
          if (!isActuallyABTestFlow) {
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
    console.log('Action clicked:', actionLabel);

    switch (actionLabel) {
      case 'halloween-campaign-yes':
      case 'Yes, setup Halloween campaign':
        // Start Halloween campaign flow
        console.log('Starting Halloween campaign flow');
        handleSendMessage('I have a Halloween themed campaign that should deploy two weeks before Halloween');
        break;

      case 'halloween-campaign-no':
      case 'No, something else':
        // Reset to empty state
        console.log('User declined Halloween campaign');
        setMessages([]);
        break;

      case 'Set Up A/B Test':
        // Start A/B test flow
        console.log('🚀 Setting up A/B Test - setting demoPhase to abtest');

        // Add the A/B test question with special metadata to identify A/B test questions
        const abtestQuestion = {
          ...DEMO_ABTEST_MESSAGES[0],
          timestamp: new Date(),
          metadata: {
            ...DEMO_ABTEST_MESSAGES[0].metadata,
            isABTestQuestion: true // Add flag to identify this as A/B test question
          }
        };

        console.log('📋 Adding A/B test question:', abtestQuestion);
        setMessages(prev => [...prev, abtestQuestion]);

        // Set demo phase after adding the message to ensure state consistency
        setDemoPhase('abtest');
        break;

      case 'Use Recommended Strategy':
        // Handle using the recommended A/B test strategy
        // Switch the campaign budget to use the A/B test budget (the recommended one)
        console.log('💰 Switching campaign budget from', campaignBudget, 'to', abtestBudget);
        setCampaignBudget(abtestBudget);

        const recommendedMessage: Message = {
          id: 'recommended-strategy-applied',
          type: 'assistant-text',
          content: `Excellent choice! I've applied the recommended strategy with the ${abtestBudget} budget. Subject Line B "Unlock Halloween Magic - 30% Off Inside!" will be used for your campaign. This strategy shows 23% higher open rates and should drive better engagement with your millennial audience.`,
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

      case 'Download PDF':
        // Download the campaign brief as HTML document
        console.log('Downloading campaign brief with budget:', campaignBudget);

        // Calculate budget allocation based on selected budget
        const totalBudget = parseBudgetToNumber(campaignBudget);
        const emailBudget = (totalBudget * 0.3).toFixed(0);
        const socialBudget = (totalBudget * 0.4).toFixed(0);
        const influencerBudget = (totalBudget * 0.2).toFixed(0);
        const creativeBudget = (totalBudget * 0.1).toFixed(0);

        // Create the campaign brief content
        const campaignBriefContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Halloween 2025 Campaign Brief</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
    h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
    h2 { color: #4a5568; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    h3 { color: #2d3748; margin-top: 20px; }
    .section { margin-bottom: 30px; }
    .metric { background: #f7fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #7c3aed; }
    ul { line-height: 1.8; }
    .budget-item { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .highlight { background: #fef3c7; padding: 2px 5px; }
  </style>
</head>
<body>
  <h1>Halloween 2025 Campaign Brief</h1>

  <div class="section">
    <h2>Campaign Overview</h2>
    <p><strong>Campaign Name:</strong> Halloween Magic 2025</p>
    <p><strong>Launch Date:</strong> Two weeks before Halloween (October 17, 2025)</p>
    <p><strong>Campaign Duration:</strong> 2 weeks</p>
    <p><strong>Primary Objective:</strong> Drive sales and engagement through Halloween-themed promotions</p>
  </div>

  <div class="section">
    <h2>Budget Allocation</h2>
    <div class="budget-item"><strong>Email Marketing:</strong> $${Number(emailBudget).toLocaleString()} (30%)</div>
    <div class="budget-item"><strong>Social Media Ads:</strong> $${Number(socialBudget).toLocaleString()} (40%)</div>
    <div class="budget-item"><strong>Influencer Partnerships:</strong> $${Number(influencerBudget).toLocaleString()} (20%)</div>
    <div class="budget-item"><strong>Creative & Design:</strong> $${Number(creativeBudget).toLocaleString()} (10%)</div>
    <div class="budget-item"><strong>Total Budget:</strong> $${Number(totalBudget).toLocaleString()}</div>
  </div>

  <div class="section">
    <h2>Target Audience Analysis</h2>

    <h3>Primary Segment: Millennials (Ages 25-40)</h3>
    <div class="metric">
      <strong>Demographics:</strong>
      <ul>
        <li>Age: 25-40 years old</li>
        <li>Income: $45,000 - $85,000</li>
        <li>Urban/Suburban locations</li>
        <li>Family-oriented with young children</li>
      </ul>
    </div>

    <div class="metric">
      <strong>Psychographics:</strong>
      <ul>
        <li>Value experiences and creating memories</li>
        <li>Active on social media (Instagram, Facebook, TikTok)</li>
        <li>Enjoy seasonal celebrations and traditions</li>
        <li>Price-conscious but willing to spend on quality</li>
      </ul>
    </div>

    <div class="metric">
      <strong>Shopping Behaviors:</strong>
      <ul>
        <li>Plan Halloween purchases 2-3 weeks in advance</li>
        <li>Prefer online shopping with quick delivery</li>
        <li>Influenced by social media trends and recommendations</li>
        <li>Average order value: $75-150</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Campaign Objectives</h2>
    <ul>
      <li>Increase Halloween season sales by <span class="highlight">35%</span> compared to 2024</li>
      <li>Achieve email open rate of <span class="highlight">32%+</span></li>
      <li>Generate <span class="highlight">10,000+</span> social media engagements</li>
      <li>Acquire <span class="highlight">2,500+</span> new customers</li>
      <li>Maintain customer satisfaction score above <span class="highlight">4.5/5</span></li>
    </ul>
  </div>

  <div class="section">
    <h2>Recommended Tactics</h2>

    <h3>Email Marketing</h3>
    <ul>
      <li><strong>Subject Line:</strong> "Unlock Halloween Magic - 30% Off Inside!"</li>
      <li>3-email sequence: Teaser, Main Offer, Last Chance</li>
      <li>Personalized product recommendations based on browsing history</li>
      <li>Mobile-optimized design with Halloween theme</li>
    </ul>

    <h3>Social Media Strategy</h3>
    <ul>
      <li>Daily Halloween countdown posts (Instagram & TikTok)</li>
      <li>User-generated content campaign with hashtag #HalloweenMagic2025</li>
      <li>Instagram Stories with interactive polls and quizzes</li>
      <li>Influencer partnerships featuring product styling ideas</li>
    </ul>

    <h3>Promotional Offers</h3>
    <ul>
      <li>30% off Halloween-themed products</li>
      <li>Bundle deals: Buy 2, Get 1 Free on select items</li>
      <li>Free shipping on orders over $50</li>
      <li>Early bird special: Extra 10% off for first 48 hours</li>
    </ul>
  </div>

  <div class="section">
    <h2>Key Performance Indicators (KPIs)</h2>
    <div class="metric">
      <ul>
        <li>Email Open Rate: Target 32%+</li>
        <li>Click-Through Rate: Target 4.5%+</li>
        <li>Conversion Rate: Target 3.2%+</li>
        <li>Social Media Engagement: 10,000+ interactions</li>
        <li>Revenue: $175,000+ from campaign</li>
        <li>ROI: 3.5x minimum</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Timeline & Milestones</h2>
    <ul>
      <li><strong>Week 1 (Oct 17-23):</strong> Campaign launch, initial email blast, social media kickoff</li>
      <li><strong>Week 2 (Oct 24-30):</strong> Reminder emails, intensified social ads, final push</li>
      <li><strong>Halloween Day (Oct 31):</strong> Last chance emails, flash sale announcements</li>
      <li><strong>Post-Campaign (Nov 1-7):</strong> Thank you emails, feedback collection, performance analysis</li>
    </ul>
  </div>

  <div class="section">
    <p style="color: #718096; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <strong>Document Generated:</strong> ${new Date().toLocaleDateString()} |
      <strong>Campaign Strategy Agent</strong> |
      Marketing Super Agent Platform
    </p>
  </div>
</body>
</html>
        `;

        // Create blob and download
        const blob = new Blob([campaignBriefContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'Halloween_2025_Campaign_Brief.html';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Show a confirmation message
        const downloadConfirmation: Message = {
          id: `download-confirmation-${Date.now()}`,
          type: 'assistant-text',
          content: 'Campaign brief downloaded successfully! You can open the HTML file in any browser or convert it to PDF.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#7c3aed'
          }
        };
        setMessages(prev => [...prev, downloadConfirmation]);
        break;

      case 'Set Up Approval Workflow':
        // Open document viewer to set up approval workflow
        setIsDocumentViewerOpen(true);
        break;

      case 'approval-submitted':
        // Handle approval workflow submission
        // Retrieve workflow data from localStorage
        const workflowDataStr = localStorage.getItem('temp-approval-workflow');
        if (!workflowDataStr) {
          console.error('No workflow data found');
          return;
        }

        const workflowData = JSON.parse(workflowDataStr);

        // Clean up temporary storage
        localStorage.removeItem('temp-approval-workflow');

        // Generate unique approval ID
        const approvalId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Map workflow approvers to approval request format
        const approvers = workflowData.approvers.map((approver: any) => ({
          id: approver.id,
          name: approver.name,
          email: approver.email,
          title: approver.title,
          status: 'pending' as const
        }));

        // Create approval request object
        const approvalRequest = {
          id: approvalId,
          documentId: 'halloween-2025-brief',
          documentTitle: 'Halloween 2025 Campaign Brief',
          campaignBudget: campaignBudget,
          requestedBy: 'Marketing Team',
          requestedAt: new Date(),
          dueDate: workflowData.dueDate ? new Date(workflowData.dueDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          approvers: approvers,
          comments: workflowData.comments || 'Please review and approve the Halloween 2025 campaign brief. Budget has been set based on initial requirements.',
          status: 'pending' as const
        };

        // Save to localStorage
        localStorage.setItem(`approval-${approvalId}`, JSON.stringify(approvalRequest));

        // Generate shareable approval link
        const approvalLink = `${window.location.origin}/approvals/${approvalId}`;

        // Generate dynamic approval message based on selected approvers
        const approverNames = approvers.map((a: any) => `${a.name} (${a.title})`).join(', ');
        const approverCount = approvers.length;

        const approvalMessage: Message = {
          id: 'approval-confirmation',
          type: 'assistant-text',
          content: `Approval workflow has been sent to ${approverNames}. ${approverCount > 1 ? 'They' : 'They'} will receive email notifications and can review the document within the next ${workflowData.dueDate ? Math.ceil((new Date(workflowData.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 3} days.`,
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#7c3aed',
            actions: [
              {
                label: `Open Approval Portal`,
                variant: 'primary' as const,
                action: `open-approval-${approvalId}`
              },
              {
                label: 'Copy Approval Link',
                variant: 'outline' as const,
                action: `copy-approval-${approvalId}`
              }
            ]
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
        // Handle dynamic approval actions
        if (actionLabel.startsWith('open-approval-')) {
          const approvalId = actionLabel.replace('open-approval-', '');
          const approvalLink = `${window.location.origin}/approvals/${approvalId}`;
          window.open(approvalLink, '_blank');
        } else if (actionLabel.startsWith('copy-approval-')) {
          const approvalId = actionLabel.replace('copy-approval-', '');
          const approvalLink = `${window.location.origin}/approvals/${approvalId}`;

          // Copy to clipboard
          navigator.clipboard.writeText(approvalLink).then(() => {
            // Show success message
            const copyMessage: Message = {
              id: `copy-success-${Date.now()}`,
              type: 'assistant-text',
              content: '✓ Approval link copied to clipboard! You can now paste and share it with approvers.',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                agentName: 'Campaign Strategy Agent',
                agentColor: '#7c3aed'
              }
            };
            setMessages(prev => [...prev, copyMessage]);
          }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy link to clipboard');
          });
        } else {
          console.log('Unhandled action:', actionLabel);
        }
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
      <div className="flex-1 flex flex-col pt-16 overflow-hidden">
        {isCompetitiveMode ? (
          /* Competitive Research Interface - Split View */
          <CompetitiveResearchInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onActionClick={handleActionClick}
          />
        ) : isCampaignExecutionMode ? (
          /* Campaign Execution Interface - Split View */
          <CampaignExecutionInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onActionClick={handleActionClick}
          />
        ) : (
          /* Conversation Area - Full Width, Scrollable */
          <ConversationArea
            messages={messages}
            isLoading={isLoading}
            onStarterPromptClick={handleSendMessage}
            onQuestionSubmit={handleQuestionSubmit}
            onActionClick={handleActionClick}
            onScroll={handleScroll}
            currentWorkflow={currentWorkflow}
            completedAgents={completedAgents}
            activeAgent={activeAgent}
            onSendMessage={handleSendMessage}
            prefilledMessage={prefilledMessage}
            onPrefilledMessageClear={() => setPrefilledMessage('')}
            campaignBudget={campaignBudget}
            abtestBudget={abtestBudget}
          />
        )}
      </div>


      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocumentViewerOpen}
        onClose={handleDocumentViewerClose}
        document={generateCampaignBrief(campaignBudget)}
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
              const message = demoFlowUtils.createMessage('user', state.data.content || '', state.data.metadata as Record<string, unknown>);
              setMessages(prev => [...prev, message]);
            } else if (state.type === 'assistant-message') {
              const message = demoFlowUtils.createMessage('assistant', state.data.content || '', state.data.metadata as Record<string, unknown>);
              setMessages(prev => [...prev, message]);
            } else if (state.type === 'navigate') {
              // Handle navigation to other pages
              const destination = state.data.metadata as { destination: string };
              router.push(destination.destination);
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