'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import ChatHeader from './ChatHeader';
import ConversationArea from './ConversationArea';
import CompetitiveResearchInterface from './CompetitiveResearchInterface';
import CampaignExecutionInterface from './CampaignExecutionInterface';
import TRGTMInterface from './TRGTMInterface';
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

// Generate TR GTM Report HTML
const generateTRGTMReport = (
  sections: Array<{id: number, title: string, content: string}>,
  insights: Record<number, string[]>
): string => {
  const sectionsHTML = sections.map(section => {
    const sectionInsights = insights[section.id] || [];
    const insightsHTML = sectionInsights.length > 0
      ? `
        <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-left: 4px solid #3b82f6;">
          <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px;">Strategic Insights</h4>
          ${sectionInsights.map(insight => `
            <p style="margin: 10px 0; color: #334155; font-size: 14px; line-height: 1.6;">
              • ${insight}
            </p>
          `).join('')}
        </div>
      `
      : '';

    return `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <h2 style="color: #475569; border-bottom: 2px solid #475569; padding-bottom: 10px; margin-bottom: 20px;">
          ${section.id}. ${section.title}
        </h2>
        <div style="line-height: 1.8; color: #1e293b;">
          ${section.content.split('\n\n').map(paragraph => {
            if (paragraph.startsWith('•')) {
              return `<p style="margin: 8px 0 8px 20px;">• ${paragraph.substring(1).trim()}</p>`;
            }
            return `<p style="margin: 15px 0;">${paragraph}</p>`;
          }).join('')}
        </div>
        ${insightsHTML}
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Thomson Reuters GTM Strategy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 40px;
      color: #1e293b;
      background: #ffffff;
    }
    h1 {
      color: #0f172a;
      border-bottom: 3px solid #475569;
      padding-bottom: 15px;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #64748b;
      font-size: 18px;
      margin-bottom: 30px;
    }
    .date {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 40px;
    }
    @media print {
      body { margin: 20px; padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>Thomson Reuters</h1>
  <div class="subtitle">Go-to-Market Strategy Document</div>
  <div class="date">Generated on ${new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })}</div>

  ${sectionsHTML}

  <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; text-align: center;">
    Generated with Claude Code - Thomson Reuters GTM Strategy Planning Tool
  </div>
</body>
</html>
  `;
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
  const [isTRGTMMode, setIsTRGTMMode] = useState(false);
  const [trGTMDocumentSections, setTRGTMDocumentSections] = useState<Array<{id: number, title: string, content: string}>>([]);
  const [trGTMVOCInsights, setTRGTMVOCInsights] = useState<Record<number, string[]>>({});
  const [trGTMConflictAlerts, setTRGTMConflictAlerts] = useState<Record<number, string[]>>({});
  const [gtmUploadedDocument, setGtmUploadedDocument] = useState<{ name: string; size: number } | undefined>(undefined);
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
  const handleSendMessage = useCallback(async (content: string, attachment?: File) => {
    // If there's an attachment, show it in the user message
    const messageContent = attachment
      ? `${content}\n\n📎 Attached: ${attachment.name}`
      : content;

    const userMessage: Message = {
      id: generateMessageId(),
      type: 'user-text',
      content: messageContent,
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
          const executionContent = attachment
            ? `Perfect! I've received your campaign brief (${attachment.name}) and I'm now analyzing it. I'm assembling the optimal agent team to create your campaign from this brief. Let me identify the specialized agents and applications we'll need.`
            : 'Perfect! I\'ve analyzed your request and I\'m now assembling the optimal agent team to create your campaign from the brief. Let me identify the specialized agents and applications we\'ll need.';

          const executionMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: executionContent,
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
    } else if (isTRGTMMode) {
      // Handle TR GTM Strategy responses
      setIsLoading(true);

      // Handle document upload
      if (attachment) {
        setGtmUploadedDocument({
          name: attachment.name,
          size: attachment.size
        });

        setTimeout(() => {
          const uploadAckMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `Perfect! I've received your GTM strategy document (${attachment.name}). I'm analyzing the content to understand your current strategy and identify opportunities.\n\nBased on this document, I'll help you refine and expand your GTM strategy across all key sections. Would you like to start with:\n\n• Strategic Definition - Review and refine business objectives\n• Financial Targets - Update pipeline and revenue goals\n• Competitive Intelligence - Analyze market landscape and competitors`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'Campaign Strategy Agent',
              agentColor: '#475569',
              actions: [
                {
                  label: '1. Strategic Definition',
                  variant: 'primary' as const,
                  action: 'tr-gtm-section-1'
                },
                {
                  label: '2. Financial Targets',
                  variant: 'outline' as const,
                  action: 'tr-gtm-section-2'
                },
                {
                  label: 'Competitive Intelligence',
                  variant: 'secondary' as const,
                  action: 'gtm-competitive-intelligence'
                }
              ]
            }
          };

          setMessages(prev => [...prev, uploadAckMessage]);
          setIsLoading(false);
        }, 2000);
        return;
      }

      setTimeout(() => {
        // Check if this is a Section 1 answer
        const section1Options = [
          'Increase market share in existing segments',
          'Enter new geographic markets',
          'Launch new product/solution',
          'Competitive displacement',
          'Digital transformation acceleration',
          'Regulatory compliance modernization'
        ];

        const segmentOptions = [
          'Tax & Accounting Professionals',
          'Legal Professionals',
          'Corporate (Tax, Legal, Risk & Fraud)',
          'Reuters News',
          'Government'
        ];

        if (section1Options.some(opt => content.includes(opt)) || segmentOptions.some(opt => content.includes(opt))) {
          // Check if user selected "Increase market share in existing segments"
          if (content.includes('Increase market share in existing segments')) {
            // Show follow-up question for segment selection
            const segmentQuestion: Message = {
              id: generateMessageId(),
              type: 'question',
              content: '',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                questions: ['Which segment do you want to target?'],
                questionOptions: [
                  {
                    question: 'Which segment do you want to target?',
                    options: [
                      'Tax & Accounting Professionals',
                      'Legal Professionals',
                      'Corporate (Tax, Legal, Risk & Fraud)',
                      'Reuters News',
                      'Government'
                    ]
                  }
                ]
              }
            };
            setMessages(prev => [...prev, segmentQuestion]);
            setIsLoading(false);
            return;
          }

          // Section 1: Strategic Definition - AI Analysis Response
          const aiAnalysis: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `Excellent choice. I've analyzed your objective: **${content}**\n\nBased on Thomson Reuters' market positioning and Voice of Customer insights, this aligns well with current market demands. Let me compile the strategic definition for your GTM document.`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'GTM Strategy Agent',
              agentColor: '#475569'
            }
          };

          setMessages(prev => [...prev, aiAnalysis]);

          // Generate Section 1 document content with specific details based on the challenge
          setTimeout(() => {
            // Add a "generating document" message
            const generatingMessage: Message = {
              id: generateMessageId(),
              type: 'assistant-text',
              content: 'Analyzing market data, customer insights, and competitive intelligence to build your Strategic Definition...',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                agentName: 'GTM Strategy Agent',
                agentColor: '#475569'
              }
            };
            setMessages(prev => [...prev, generatingMessage]);

            // Now generate the actual document after additional delay
            setTimeout(() => {
            let detailedContent = '';
            let insights: string[] = [];

            if (content.includes('Regulatory compliance modernization')) {
              detailedContent = `Objective\nModernize regulatory compliance operations for financial services institutions to reduce regulatory risk exposure, improve compliance efficiency by 40-60%, and achieve real-time regulatory change management across 750+ global jurisdictions.\n\nStrategic Definition\nThis GTM strategy targets Chief Compliance Officers and General Counsel at Tier 1 banks, asset managers, and insurance companies struggling with escalating regulatory complexity. We will position Thomson Reuters Regulatory Intelligence as the definitive AI-powered compliance modernization platform.\n\nTarget Customer Profile:\n• Financial institutions with $50B+ AUM managing multi-jurisdictional compliance\n• Organizations facing 200+ regulatory changes monthly across their operations\n• Compliance teams spending 40%+ of time on manual regulatory tracking and interpretation\n• Firms with recent regulatory penalties or audit findings requiring remediation\n\nUnique Value Proposition:\n"Reduce compliance costs by 50% while eliminating 95% of regulatory change management risk through AI-powered, real-time regulatory intelligence covering every jurisdiction where you operate."\n\nStrategic Rationale\nThomson Reuters processes 40 billion regulatory updates annually across 750+ jurisdictions with 99.7% accuracy. Our AI models, trained on 150 years of regulatory content, identify relevant changes 14 days faster than manual processes. Current customers report 65% reduction in compliance FTEs and 73% fewer false positives.\n\nThis GTM strategy will leverage:\n• Regulatory Intelligence Platform covering MiFID II, Dodd-Frank, Basel III/IV, GDPR, and 450+ other frameworks\n• AI-powered obligation extraction reducing manual review from 8 hours to 12 minutes per regulation\n• Automated impact assessment mapping regulations to 200+ business processes and controls\n• Real-time monitoring of regulatory changes with predictive alerts for upcoming requirements\n\nKey Success Factors\n• Executive sponsorship from CCO and GC with Board-level visibility\n• ROI demonstration: $12M annual savings for $100B AUM institution\n• Risk reduction: 70% fewer compliance violations, 85% reduction in audit findings\n• Integration with existing GRC platforms (Archer, MetricStream, ServiceNow)\n• Proof of concept showing 90-day time-to-value with measurable compliance efficiency gains\n\nMarket Context\nGlobal RegTech market: $42.8B (2025) growing at 12% CAGR. Regulatory complexity increasing 28% YoY with average of 450 new regulations daily worldwide. 2024 global compliance penalties: $10.4B, up 35% from 2023. Post-SVB collapse, regulators intensified scrutiny - 78% of CCOs cite technology modernization as top priority to meet heightened expectations.`;

              insights = [
                'VOC Insight: 84% of compliance officers report "drowning in regulatory changes" - cite inability to keep pace as #1 risk factor',
                'VOC Insight: Customers using our AI platform report 3.2x ROI in 18 months, primarily from 65% FTE reduction and elimination of $2-5M in annual penalties',
                'Market Data: Regulatory change volume increased 28% YoY - manual processes now require 12+ FTEs vs 3 FTEs with automation',
                'VOC Insight: "We went from 8 hours to 12 minutes for regulation review" - Global Compliance Head, Top 5 U.S. Bank',
                'Risk Data: Average compliance breach costs $14.8M (fines + remediation + reputation) - our customers report 85% reduction in violations'
              ];
            } else if (content.includes('Launch new product/solution')) {
              detailedContent = `Objective\nLaunch [new AI-powered legal research assistant] to achieve $50M ARR within 18 months, capturing 25% market penetration among Am Law 200 firms, and establishing category leadership in GenAI-powered legal technology.\n\nStrategic Definition\nThis GTM strategy positions our new GenAI legal research solution as the definitive productivity multiplier for corporate legal departments and law firms. We will target General Counsel at Fortune 500 companies and Managing Partners at Am Law 200 firms seeking to reduce legal research costs by 60% while improving research quality and speed.\n\nTarget Customer Profile:\n• Corporate legal departments with 50+ attorneys spending $2M+ annually on legal research\n• Am Law 200 law firms seeking competitive advantage through AI-powered associate productivity\n• In-house legal teams under mandate to "do more with less" - reduce outside counsel spend by 30%+\n• Early adopter General Counsel who championed previous legal tech transformations (e-discovery, contract analytics)\n\nUnique Value Proposition:\n"Get senior associate-quality legal research in 3 minutes instead of 3 hours - reduce research costs by 60% while uncovering insights that traditional search misses."\n\nStrategic Rationale\nThomson Reuters successfully launched CoCounsel (GenAI legal assistant) in Q2 2024, achieving 40% adoption among beta customers within 6 months and $12M ARR. Customer research from 200+ beta users shows 68% reduction in research time, 4.2x more relevant precedent discovery, and 94% user satisfaction. Our Westlaw platform integration creates immediate workflow adoption - 82% of customers already using Westlaw daily.\n\nThis GTM strategy will leverage:\n• Exclusive GPT-4 integration with proprietary Westlaw legal content (60M+ documents)\n• Customer co-creation with 50 design partner firms providing real-time feedback\n• Integration into existing Westlaw workflow - zero friction adoption for 1.2M existing users\n• Thought leadership platform: Reuters Legal reaches 600K legal professionals, 12M monthly impressions\n\nKey Success Factors\n• Launch with 50 lighthouse customers (10 Am Law 20 firms + 40 Fortune 100 GCs) demonstrating clear ROI\n• ROI calculator showing $1.2M annual savings for 100-attorney department ($60K per attorney saved)\n• Product differentiation: Hallucination rate <2% vs 15-20% for generic LLMs (validated by independent study)\n• Viral adoption model: 80%+ of users become advocates within 30 days based on beta data\n• Time-to-first-value: Deliver "wow moment" within first 10 minutes of use\n\nMarket Context\nLegal AI market: $8.5B TAM growing at 15% CAGR. GenAI subcategory exploding at 47% CAGR as legal sector embraces transformation. First-mover advantage critical - customer research shows 65% of buyers select first vendor evaluated and stick for 3+ years due to switching costs. Current competitive landscape fragmented (Lexis, Casetext, Harvey AI, vLex) with no clear category leader - whitespace opportunity to define and dominate the category.`;

              insights = [
                'VOC Insight: Beta customers report "This is the biggest productivity leap since we moved from books to online research 25 years ago" - 94% user satisfaction',
                'VOC Insight: "We reduced first-year associate research time by 68% - that\'s $180K in cost savings per associate" - GC, Fortune 50 Technology Company',
                'Market Data: Products launched with customer co-creation achieve 2.8x higher adoption rates (40% vs 14%) and 2.1x faster time-to-revenue',
                'VOC Insight: 82% of Westlaw users indicate "high willingness to pay" for AI capabilities - existing relationship reduces CAC by 5x ($12K vs $62K)',
                'Competitive Intel: First-to-market players in legal tech capture 35% higher market share and sustain 28% price premiums vs. fast-followers'
              ];
            } else if (content.includes('Tax & Accounting Professionals') ||
                       content.includes('Legal Professionals') ||
                       content.includes('Corporate (Tax, Legal, Risk & Fraud)') ||
                       content.includes('Reuters News') ||
                       content.includes('Government')) {
              // User selected a specific segment - use Tax & Accounting as the detailed example
              const selectedSegment = content;
              detailedContent = `${content}\n\nObjective\nIncrease market share in the Tax & Accounting Professional segment from 38% to 45% (7-point gain) within 24 months, representing $420M in incremental revenue, through competitive displacement of CCH/Wolters Kluwer and expansion within existing customer accounts.\n\nStrategic Definition\nThis GTM strategy targets mid-market accounting firms (50-500 professionals) and corporate tax departments at Fortune 1000 companies currently using competitive solutions or operating with incomplete Thomson Reuters portfolios. We will execute a coordinated competitive displacement campaign against Wolters Kluwer CCH combined with aggressive cross-sell into existing ONESOURCE customers.\n\nTarget Customer Profile:\n• Mid-market accounting firms (50-500 CPAs) using CCH ProSystem fx or Lacerte with 5+ year old implementations\n• Corporate tax departments at F1000 companies with $500M+ revenue using point solutions vs. integrated platforms\n• Current ONESOURCE customers using only 1-2 modules with expansion potential to 5+ module suites\n• Firms experiencing partner/talent retention challenges seeking modern technology to attract next-gen accountants\n\nUnique Value Proposition:\n"Consolidate 7 tax and accounting tools into one AI-powered platform - reduce software costs by 35%, cut tax compliance time by 40%, and win the war for talent with technology that CPAs actually want to use."\n\nStrategic Rationale\nThomson Reuters holds 38% share of $6B tax & accounting software market, with Wolters Kluwer at 41% and Intuit at 12%. Win/loss analysis shows we lose on "perceived ease of use" but win decisively on "platform breadth" and "technical accuracy." Account penetration analysis reveals 68% of customers use <50% of available portfolio - massive expansion opportunity.\n\nWin-back analysis of 200 churned accounts shows:\n• 73% switched due to pricing (addressable through value selling and TCO models)\n• 58% cited "better user experience" at competitor (addressed by 2024 UX redesign)\n• Average customer stays with competitor for 6.2 years before reconsidering\n• Win-back conversion rate of 22% when we target customers 3+ years post-switch\n\nThis GTM strategy will leverage:\n• Competitive battlecards with win themes against CCH (integration, AI/automation, modern UX, better support)\n• Account-based marketing to 500 named accounts representing $280M revenue opportunity\n• Portfolio expansion playbook: customers using 3+ products show 2.1x higher retention (94% vs 82%) and 3.5x higher LTV\n• Customer success programs including quarterly business reviews, dedicated TAMs for $100K+ accounts, user certification\n\nKey Success Factors\n• Sales team enablement: 100% of reps certified on competitive selling and value-based pricing\n• Executive sponsorship program pairing TR executives with C-suite at top 100 accounts ($180M pipeline)\n• Product integration creating switching costs - customers using integrated workflows show 45% higher retention\n• ROI calculators customized by firm size showing $180K-$2.4M annual value (validated by customer case studies)\n• Digital lead generation: 15K MQLs from content marketing targeting "CCH alternative" and "tax technology modernization"\n\nMarket Context\nTax & accounting software market: $6B growing at 8% CAGR. Market consolidation accelerating - 67% of firms open to switching for 20%+ efficiency gains or 15%+ cost reduction. Competitive vulnerability highest among CCH ProSystem fx customers (42% of market) using 10+ year old on-premise deployments - migration to cloud creates switching opportunity. Talent shortage (200K accountant deficit by 2027) driving technology modernization as competitive advantage for recruiting.`;

              insights = [
                'VOC Insight: "Moving to Thomson Reuters cut our tax season overtime by 40% - that alone paid for the software in year one" - Tax Partner, 180-person CPA firm',
                'VOC Insight: Portfolio customers (3+ products) report 2.1x higher retention (94% vs 82%) and generate 3.5x higher lifetime value due to lower churn and expansion',
                'Market Data: Competitive displacement win rate of 22% when targeting CCH customers with 3+ year old implementations - ROI focused messaging critical',
                'VOC Insight: "We were spending $420K across 7 vendors - consolidated to Thomson Reuters at $290K with better functionality" - VP Tax, F500 Manufacturing',
                'Competitive Intel: Account penetration above 60% of wallet share correlates with 95%+ renewal rates - expansion motion more efficient than new logo acquisition'
              ];
            } else {
              // Default content for other challenges
              detailedContent = `Business Challenge\n${content}\n\nObjective\nAddress the strategic business challenge through a comprehensive go-to-market approach that leverages Thomson Reuters' market position, product capabilities, and customer relationships.\n\nStrategic Rationale\nThomson Reuters is well-positioned to address this challenge through our established market presence, trusted brand reputation, and comprehensive product portfolio. This GTM strategy will leverage our strengths in data analytics, regulatory intelligence, and workflow automation.\n\nKey Success Factors\n• Executive sponsorship and cross-functional alignment\n• Clear value proposition differentiation\n• Measurable outcomes tied to customer ROI\n• Scalable go-to-market approach\n\nMarket Context\nTarget market shows strong growth potential with increasing demand for digital transformation solutions. Current market dynamics favor solutions that combine content, technology, and services.`;

              insights = [
                'Enterprise B2B solutions show average sales cycle of 6-9 months with 3.2x ROI in year 2',
                'Digital-first GTM strategies reduce customer acquisition costs by 35-40%',
                'Solutions demonstrating clear ROI achieve 2.5x higher close rates'
              ];
            }

            setTRGTMDocumentSections([{
              id: 1,
              title: 'Strategic Definition',
              content: detailedContent
            }]);

            setTRGTMVOCInsights({ 1: insights });

            // Show next section options
            const nextSectionMessage: Message = {
              id: generateMessageId(),
              type: 'assistant-text',
              content: `Perfect! I've added Strategic Definition to your GTM document. What would you like to work on next?`,
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                agentName: 'Campaign Strategy Agent',
                agentColor: '#475569',
                actions: [
                  { label: '2. Financial Targets', variant: 'primary' as const, action: 'tr-gtm-section-2' },
                  { label: '3. GTM Strategy & Approach', variant: 'outline' as const, action: 'tr-gtm-section-3' }
                ]
              }
            };

            setMessages(prev => [...prev, nextSectionMessage]);
            setIsLoading(false);
            }, 2500); // Inner timeout for document generation
          }, 2000); // Outer timeout for "analyzing" message
        }

        // Section 2: Financial Targets - Handle responses
        const section2Options = [
          'Revenue growth ($X to $Y over 12-24 months)',
          'Pipeline generation ($ value and # of opportunities)',
          'Customer acquisition cost (CAC) optimization',
          'Average deal size expansion',
          'Customer lifetime value (LTV) improvement',
          'Market share percentage point gains'
        ];

        // Check if this is a revenue range answer (from follow-up questions)
        const revenueRangePattern = /\$[\d,]+[MBK]?\s*-\s*\$[\d,]+[MBK]?/;
        const isRevenueRange = revenueRangePattern.test(content);

        if (section2Options.some(opt => content.includes(opt)) || isRevenueRange) {
          // Check if user selected "Revenue growth" - need follow-up questions
          if (content.includes('Revenue growth ($X to $Y over 12-24 months)')) {
            // Show follow-up questions for current and target revenue
            const revenueQuestions: Message = {
              id: generateMessageId(),
              type: 'question',
              content: '',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                questions: [
                  'What is your current annual revenue (baseline)?',
                  'What is your target revenue in 12-24 months?'
                ],
                questionOptions: [
                  {
                    question: 'What is your current annual revenue (baseline)?',
                    options: [
                      '$50M - $100M',
                      '$100M - $250M',
                      '$250M - $500M',
                      '$500M - $1B',
                      '$1B+'
                    ]
                  },
                  {
                    question: 'What is your target revenue in 12-24 months?',
                    options: [
                      '$100M - $250M',
                      '$250M - $500M',
                      '$500M - $1B',
                      '$1B - $2B',
                      '$2B+'
                    ]
                  }
                ]
              }
            };
            setMessages(prev => [...prev, revenueQuestions]);
            setIsLoading(false);
            return;
          }

          // Section 2: Financial Targets - AI Analysis Response
          const aiAnalysis: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `Great! I'm analyzing your financial objective: **${content}**\n\nLet me pull the relevant market data, benchmarks, and customer success metrics to build your Financial Targets section.`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'GTM Strategy Agent',
              agentColor: '#475569'
            }
          };

          setMessages(prev => [...prev, aiAnalysis]);

          // Generate Section 2 document content
          setTimeout(() => {
            const generatingMessage: Message = {
              id: generateMessageId(),
              type: 'assistant-text',
              content: 'Calculating financial targets, pipeline models, and ROI projections based on Thomson Reuters benchmarks and industry data...',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                agentName: 'GTM Strategy Agent',
                agentColor: '#475569'
              }
            };
            setMessages(prev => [...prev, generatingMessage]);

            setTimeout(() => {
              let financialContent = '';
              let financialInsights: string[] = [];

              // Determine which segment we're targeting from Section 1
              const currentSection1 = trGTMDocumentSections.find(s => s.id === 1);
              const isTaxSegment = currentSection1?.content.includes('Tax & Accounting Professionals');

              // Parse revenue values if present (format: "$X - $Y | $A - $B")
              let currentRevenue = '';
              let targetRevenue = '';
              let incrementalRevenue = '';
              if (content.includes('|')) {
                const parts = content.split('|').map(p => p.trim());
                if (parts.length >= 2) {
                  currentRevenue = parts[0];
                  targetRevenue = parts[1];
                  // Calculate rough midpoint for incremental
                  // For now, use the target range midpoint
                  incrementalRevenue = targetRevenue;
                }
              }

              if (content.includes('Revenue growth') || isRevenueRange) {
                if (isTaxSegment) {
                  // Use actual revenue values if provided
                  const revenueHeader = (currentRevenue && targetRevenue)
                    ? `Current Revenue: ${currentRevenue}\nTarget Revenue: ${targetRevenue}\n\n24-Month Revenue Goal: Grow from ${currentRevenue} to ${targetRevenue}`
                    : `24-Month Revenue Goal: $420M incremental revenue (38% → 45% market share)`;

                  financialContent = `Tax & Accounting Professionals\n\nRevenue Targets\n${revenueHeader}\n• Year 1: 60% of growth target\n• Year 2: Remaining 40% of growth target\n\nRevenue Breakdown by Motion:\n• Competitive Displacement (CCH/Wolters Kluwer): $252M (60% of target)\n  - 340 net new customer acquisitions @ avg $740K ACV\n  - Win rate target: 28% (up from 22% baseline)\n  - Average sales cycle: 6.2 months\n\n• Portfolio Expansion (Existing Customers): $126M (30% of target)\n  - 890 customers expanding from 1-2 modules to 3+ modules\n  - Average expansion value: $142K per customer\n  - Expansion sales cycle: 3.4 months\n\n• Win-Back (Previously Churned Customers): $42M (10% of target)\n  - 72 win-back accounts @ avg $585K ACV\n  - Target accounts 3-7 years post-churn\n  - Win-back conversion rate: 22%\n\nPipeline Requirements\nTo achieve $420M in closed revenue over 24 months:\n• Total pipeline required: $1.68B (4.0x coverage ratio)\n• Year 1 pipeline build: $720M by end of Q2\n• Year 2 pipeline build: $960M by end of Q2\n\nPipeline Sources:\n• Sales-Qualified Leads (SQL): 2,800 accounts @ 12% close rate = 340 new logos\n• Marketing-Qualified Leads (MQL): 15,000 leads → 2,800 SQLs (19% conversion)\n• Account-Based Marketing (ABM): 500 named accounts, 40% engagement, 28% close rate\n• Customer Success-Qualified Expansion: 890 expansion opportunities from 2,100 customer base\n\nKey Financial Metrics & KPIs\n• Customer Acquisition Cost (CAC): $62,000 (industry benchmark)\n  - Competitive displacement CAC: $78,000 (higher touch)\n  - Expansion CAC: $12,000 (existing relationship)\n  - Blended CAC target: $52,000 (16% improvement)\n\n• Customer Lifetime Value (LTV): $2.8M\n  - Average customer tenure: 8.2 years\n  - Net retention rate: 94% (portfolio customers 3+ products)\n  - Annual price increases: 3.5%\n  - LTV:CAC ratio: 53.8:1 (target: 5:1+ is healthy)\n\n• Payback Period: 18 months\n  - New logo payback: 22 months\n  - Expansion payback: 6 months\n  - Blended payback: 18 months\n\nBudget Allocation\nTotal GTM Investment: $86M over 24 months\n\n• Sales & Sales Enablement: $42M (49%)\n  - 28 new enterprise AEs @ $280K OTE = $7.8M\n  - Sales leadership & operations: $4.2M\n  - Sales enablement & training: $2.8M\n  - Competitive battlecards & tools: $1.2M\n  - Partner channel program: $12M\n  - Customer success expansion team: $14M\n\n• Marketing & Demand Generation: $28M (33%)\n  - Account-Based Marketing (500 accounts): $8.4M\n  - Content marketing & thought leadership: $4.2M\n  - Digital advertising (LinkedIn, Google): $6.8M\n  - Events & conferences (12 tier-1 events): $3.2M\n  - Marketing operations & technology: $2.8M\n  - Customer marketing & advocacy: $2.6M\n\n• Product & Solutions: $12M (14%)\n  - Competitive feature development: $6.2M\n  - Integration & platform investments: $3.8M\n  - Customer co-innovation program: $2M\n\n• Technology & Tools: $4M (4%)\n  - CRM & sales tech stack: $1.6M\n  - Marketing automation & analytics: $1.2M\n  - Customer success platform: $1.2M\n\nROI Analysis\nProgram ROI: 4.9x\n• Total Investment: $86M\n• Total Revenue: $420M\n• Gross Margin: 78% = $327.6M gross profit\n• Net Contribution (after GTM costs): $241.6M\n• ROI Ratio: $241.6M / $86M = 2.8x net ROI\n• Payback: 18 months\n\nRisk-Adjusted Scenarios\n• Best Case (110% attainment): $462M revenue, $351M gross profit, 3.1x ROI\n• Base Case (100% attainment): $420M revenue, $327.6M gross profit, 2.8x ROI  \n• Conservative Case (85% attainment): $357M revenue, $278M gross profit, 2.2x ROI`;

                  financialInsights = [
                    'Benchmark Data: Top-performing tax software vendors achieve 4.2x pipeline coverage with 24% win rates - our targets are conservative',
                    'VOC Insight: "The ROI calculator showing $420K in annual savings was the business case that got executive buy-in" - CFO, Mid-Market Accounting Firm',
                    'Market Data: Tax software market 8% CAGR - our 7-point share gain assumes capturing 80% of incremental market growth plus share shifts',
                    'Customer Success Data: Portfolio customers (3+ products) have 2.1x higher LTV ($3.8M vs $1.8M) and 94% retention vs 82% for single-product',
                    'Sales Data: Win-back campaigns targeting 3-7 year churned customers achieve 22% close rate at 25% lower CAC than net new logos'
                  ];
                } else {
                  // Generic revenue growth content
                  financialContent = `Revenue Targets\n24-Month Revenue Goal: Achieve revenue growth from current baseline to target through strategic GTM execution.\n\nRevenue Breakdown:\n• New Customer Acquisition: 60% of incremental revenue\n• Existing Customer Expansion: 30% of incremental revenue\n• Partner/Channel Revenue: 10% of incremental revenue\n\nPipeline Requirements\n• Pipeline coverage ratio: 4.0x\n• Lead-to-opportunity conversion: 18-22%\n• Opportunity-to-close rate: 22-28%\n\nKey Financial Metrics\n• Customer Acquisition Cost (CAC): Industry benchmark\n• Customer Lifetime Value (LTV): 5:1 LTV:CAC ratio target\n• Payback Period: 18-24 months\n\nBudget Allocation\n• Sales & Enablement: 45-50%\n• Marketing & Demand Gen: 30-35%\n• Product & Solutions: 12-15%\n• Technology & Tools: 3-5%\n\nROI Analysis\n• Target program ROI: 3.5-5.0x over 24 months\n• Gross margin expectations: 75-80%\n• Risk-adjusted scenarios modeled`;

                  financialInsights = [
                    'Industry benchmark: B2B SaaS companies achieve 4.0x pipeline coverage for predictable revenue attainment',
                    'Customer acquisition: Best-in-class companies maintain LTV:CAC ratios above 5:1 with 18-month payback periods',
                    'Revenue mix: Companies with 30%+ revenue from expansions show 1.8x higher valuations due to lower CAC and higher retention'
                  ];
                }
              } else if (content.includes('Pipeline generation')) {
                financialContent = `Pipeline Generation Strategy\n\nPipeline Targets\n• 24-Month Total Pipeline: $1.68B\n• Year 1 Pipeline Build: $720M (by end of Q2)\n• Year 2 Pipeline Build: $960M (by end of Q2)\n• Average Deal Size: $740K (new logos), $142K (expansions)\n\nPipeline Sources & Velocity\n• Sales Development (SDR/BDR): 35% of pipeline\n  - 5,250 qualified conversations → 1,838 SQLs\n  - SDR-to-SQL conversion: 35%\n  - SQL-to-close: 22%\n\n• Marketing-Qualified Leads (MQL): 30% of pipeline  \n  - 15,000 MQLs → 2,800 SQLs (19% conversion)\n  - Content downloads, webinars, events\n  - Average time MQL→SQL: 42 days\n\n• Account-Based Marketing: 20% of pipeline\n  - 500 named accounts, 40% engagement rate\n  - High-value deals: avg $1.2M ACV\n  - ABM close rate: 28% vs 22% non-ABM\n\n• Customer Success Expansion: 15% of pipeline\n  - 2,100 customer base → 890 expansion opps\n  - Quarterly Business Reviews identify expansion signals\n  - Expansion close rate: 42%\n\nPipeline Quality Metrics\n• Stage 1 (Discovery): 40% advance rate, 35-day avg duration\n• Stage 2 (Qualification): 65% advance rate, 28-day avg duration  \n• Stage 3 (Proposal): 55% advance rate, 42-day avg duration\n• Stage 4 (Negotiation): 75% advance rate, 21-day avg duration\n• Overall sales cycle: 6.2 months (new logos), 3.4 months (expansion)\n\nLeading Indicators\n• Monthly new pipeline creation: $70M minimum\n• Pipeline coverage by quarter: 4.0x minimum\n• Pipeline velocity: 15% increase quarter-over-quarter\n• Win rate trending: 22% → 28% over 24 months`;

                financialInsights = [
                  'Pipeline Data: Companies maintaining 4.0x+ pipeline coverage achieve 92% of quota vs 67% for <3.0x coverage',
                  'Conversion Benchmarks: ABM programs drive 28% win rates vs 22% traditional lead gen - justify higher investment',
                  'Velocity Analysis: Reducing sales cycle by 15% (6.2mo → 5.3mo) increases annual revenue capacity by $42M with same resources'
                ];
              } else {
                // Generic financial targets
                financialContent = `Financial Objectives\n${content}\n\nKey Performance Indicators\n• Revenue growth targets with quarterly milestones\n• Pipeline coverage and conversion metrics\n• Customer acquisition and retention economics\n• Return on investment analysis\n\nBudget Framework\n• Sales and sales enablement investment\n• Marketing and demand generation allocation\n• Product and solution development\n• Technology and operational tools\n\nSuccess Metrics\n• Target ROI: 3.5-5.0x over program lifecycle\n• Customer acquisition cost optimization\n• Lifetime value maximization\n• Payback period targets`;

                financialInsights = [
                  'Financial Planning: B2B GTM programs typically require 4.0x pipeline coverage for predictable revenue achievement',
                  'Investment Mix: Best-performing programs allocate 45-50% to sales, 30-35% to marketing, 15-20% to product/enablement'
                ];
              }

              // Add Section 2 to document
              setTRGTMDocumentSections(prev => [...prev, {
                id: 2,
                title: 'Financial Targets',
                content: financialContent
              }]);

              // Add Section 2 insights
              setTRGTMVOCInsights(prev => ({ ...prev, 2: financialInsights }));

              // Show final report options
              const nextSectionMessage: Message = {
                id: generateMessageId(),
                type: 'assistant-text',
                content: `Perfect! Your Thomson Reuters GTM Strategy document is complete with Strategic Definition and Financial Targets. The comprehensive strategy is ready for review and approval.\n\nYou can download the full report or set up an approval workflow to get stakeholder sign-off before proceeding.`,
                sender: 'assistant',
                timestamp: new Date(),
                metadata: {
                  agentName: 'Campaign Strategy Agent',
                  agentColor: '#475569',
                  actions: [
                    { label: 'Download GTM Strategy Report', variant: 'primary' as const, action: 'download-tr-gtm-report' },
                    { label: 'Set Up Approval Workflow', variant: 'secondary' as const, action: 'setup-tr-gtm-approval' }
                  ]
                }
              };

              setMessages(prev => [...prev, nextSectionMessage]);
              setIsLoading(false);
            }, 2500);
          }, 2000);
        } else {
          // Generic TR GTM response
          const agentMessage: Message = {
            id: generateMessageId(),
            type: 'assistant-text',
            content: `I'm analyzing your input: "${content}". Let me coordinate with the GTM strategy team to incorporate this into your document.`,
            sender: 'assistant',
            timestamp: new Date(),
            metadata: {
              agentName: 'GTM Strategy Agent',
              agentColor: '#475569'
            }
          };

          setMessages(prev => [...prev, agentMessage]);
          setIsLoading(false);
        }
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
  }, [generateMessageId, isTRGTMMode]);

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
    } else if (modeParam === 'gtm-competitive') {
      // Handle GTM competitive intelligence mode
      processedParams.current.add(paramKey);
      setIsCompetitiveMode(true);

      // Initialize GTM competitive intelligence messages
      const gtmCompetitiveIntroMessage: Message = {
        id: 'gtm-competitive-intro',
        type: 'assistant-text',
        content: 'Welcome to GTM Competitive Intelligence Research for Thomson Reuters! I\'ve activated specialized research agents to help you analyze competitive landscape, market positioning, and strategic opportunities for your enterprise go-to-market strategy.\n\nWhat aspects of competitive intelligence would you like to explore?',
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentName: 'Deep Research Agent',
          agentColor: '#8b5cf6'
        }
      };

      setMessages([gtmCompetitiveIntroMessage]);

      // Clear URL parameters after processing
      router.replace('/chat');
    } else if (modeParam === 'tr-gtm') {
      // Handle TR GTM Strategy mode
      processedParams.current.add(paramKey);
      setIsTRGTMMode(true);

      // Initialize TR GTM Strategy messages
      const trGTMIntroMessage: Message = {
        id: 'tr-gtm-intro',
        type: 'assistant-text',
        content: 'Welcome to Thomson Reuters GTM Strategy Planning! I\'m your Campaign Strategy Agent, here to help you create a comprehensive Go-to-Market strategy for your B2B enterprise campaign.\n\nYou can upload an existing GTM strategy document (PDF) to use as a foundation, or we can build one from scratch. We\'ll work through sections covering Strategic Definition, Financial Targets, GTM Strategy, Products & Market, Audience, Messaging, Metrics, Pipeline, Competitive Analysis, and Approvals.\n\nAs we complete each section, your GTM strategy document will appear on the right.\n\nWhat would you like to work on today?',
        sender: 'assistant',
        timestamp: new Date(),
        metadata: {
          agentName: 'Campaign Strategy Agent',
          agentColor: '#475569',
          actions: [
            {
              label: '1. Strategic Definition',
              variant: 'primary' as const,
              action: 'tr-gtm-section-1'
            },
            {
              label: '2. Financial Targets',
              variant: 'outline' as const,
              action: 'tr-gtm-section-2'
            },
            {
              label: 'Competitive Intelligence',
              variant: 'secondary' as const,
              action: 'gtm-competitive-intelligence'
            }
          ]
        }
      };

      setMessages([trGTMIntroMessage]);

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
    console.log('isTRGTMMode:', isTRGTMMode);

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
        // Download the campaign brief as PDF document
        console.log('Downloading campaign brief with budget:', campaignBudget);

        // Calculate budget allocation based on selected budget
        const totalBudget = parseBudgetToNumber(campaignBudget);
        const emailBudget = (totalBudget * 0.3).toFixed(0);
        const socialBudget = (totalBudget * 0.4).toFixed(0);
        const influencerBudget = (totalBudget * 0.2).toFixed(0);
        const creativeBudget = (totalBudget * 0.1).toFixed(0);

        // Create PDF using jsPDF
        const campaignPdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfPageWidth = campaignPdf.internal.pageSize.getWidth();
        const pdfPageHeight = campaignPdf.internal.pageSize.getHeight();
        const pdfMargin = 20;
        const pdfMaxWidth = pdfPageWidth - (pdfMargin * 2);
        let pdfYPosition = pdfMargin;

        // Helper function for adding text with wrapping
        const addPdfText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
          campaignPdf.setFontSize(fontSize);
          campaignPdf.setFont('helvetica', isBold ? 'bold' : 'normal');
          campaignPdf.setTextColor(color[0], color[1], color[2]);

          const lines = campaignPdf.splitTextToSize(text, pdfMaxWidth);
          lines.forEach((line: string) => {
            if (pdfYPosition > pdfPageHeight - pdfMargin) {
              campaignPdf.addPage();
              pdfYPosition = pdfMargin;
            }
            campaignPdf.text(line, pdfMargin, pdfYPosition);
            pdfYPosition += fontSize * 0.5;
          });
        };

        // Title
        addPdfText('Halloween 2025 Campaign Brief', 18, true, [124, 58, 237]);
        pdfYPosition += 5;
        campaignPdf.setDrawColor(124, 58, 237);
        campaignPdf.setLineWidth(0.5);
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 10;

        // Campaign Overview
        addPdfText('Campaign Overview', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.setDrawColor(226, 232, 240);
        campaignPdf.setLineWidth(0.3);
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('Campaign Name: Halloween Magic 2025', 10);
        addPdfText('Launch Date: Two weeks before Halloween (October 17, 2025)', 10);
        addPdfText('Campaign Duration: 2 weeks', 10);
        addPdfText('Primary Objective: Drive sales and engagement through Halloween-themed promotions', 10);
        pdfYPosition += 8;

        // Budget Allocation
        addPdfText('Budget Allocation', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText(`Email Marketing: $${Number(emailBudget).toLocaleString()} (30%)`, 10);
        addPdfText(`Social Media Ads: $${Number(socialBudget).toLocaleString()} (40%)`, 10);
        addPdfText(`Influencer Partnerships: $${Number(influencerBudget).toLocaleString()} (20%)`, 10);
        addPdfText(`Creative & Design: $${Number(creativeBudget).toLocaleString()} (10%)`, 10);
        addPdfText(`Total Budget: $${Number(totalBudget).toLocaleString()}`, 10, true);
        pdfYPosition += 8;

        // Target Audience Analysis
        addPdfText('Target Audience Analysis', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('Primary Segment: Millennials (Ages 25-40)', 12, true);
        pdfYPosition += 2;
        addPdfText('Demographics:', 11, true);
        addPdfText('• Age: 25-40 years old', 10);
        addPdfText('• Income: $45,000 - $85,000', 10);
        addPdfText('• Urban/Suburban locations', 10);
        addPdfText('• Family-oriented with young children', 10);
        pdfYPosition += 3;
        addPdfText('Psychographics:', 11, true);
        addPdfText('• Value experiences and creating memories', 10);
        addPdfText('• Active on social media (Instagram, Facebook, TikTok)', 10);
        addPdfText('• Enjoy seasonal celebrations and traditions', 10);
        addPdfText('• Price-conscious but willing to spend on quality', 10);
        pdfYPosition += 3;
        addPdfText('Shopping Behaviors:', 11, true);
        addPdfText('• Plan Halloween purchases 2-3 weeks in advance', 10);
        addPdfText('• Prefer online shopping with quick delivery', 10);
        addPdfText('• Influenced by social media trends and recommendations', 10);
        addPdfText('• Average order value: $75-150', 10);
        pdfYPosition += 8;

        // Campaign Objectives
        addPdfText('Campaign Objectives', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('• Increase Halloween season sales by 35% compared to 2024', 10);
        addPdfText('• Achieve email open rate of 32%+', 10);
        addPdfText('• Generate 10,000+ social media engagements', 10);
        addPdfText('• Acquire 2,500+ new customers', 10);
        addPdfText('• Maintain customer satisfaction score above 4.5/5', 10);
        pdfYPosition += 8;

        // Recommended Tactics
        addPdfText('Recommended Tactics', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('Email Marketing', 12, true);
        addPdfText('• Subject Line: "Unlock Halloween Magic - 30% Off Inside!"', 10);
        addPdfText('• 3-email sequence: Teaser, Main Offer, Last Chance', 10);
        addPdfText('• Personalized product recommendations based on browsing history', 10);
        addPdfText('• Mobile-optimized design with Halloween theme', 10);
        pdfYPosition += 3;
        addPdfText('Social Media Strategy', 12, true);
        addPdfText('• Daily Halloween countdown posts (Instagram & TikTok)', 10);
        addPdfText('• User-generated content campaign with hashtag #HalloweenMagic2025', 10);
        addPdfText('• Instagram Stories with interactive polls and quizzes', 10);
        addPdfText('• Influencer partnerships featuring product styling ideas', 10);
        pdfYPosition += 3;
        addPdfText('Promotional Offers', 12, true);
        addPdfText('• 30% off Halloween-themed products', 10);
        addPdfText('• Bundle deals: Buy 2, Get 1 Free on select items', 10);
        addPdfText('• Free shipping on orders over $50', 10);
        addPdfText('• Early bird special: Extra 10% off for first 48 hours', 10);
        pdfYPosition += 8;

        // Key Performance Indicators
        addPdfText('Key Performance Indicators (KPIs)', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('• Email Open Rate: Target 32%+', 10);
        addPdfText('• Click-Through Rate: Target 4.5%+', 10);
        addPdfText('• Conversion Rate: Target 3.2%+', 10);
        addPdfText('• Social Media Engagement: 10,000+ interactions', 10);
        addPdfText('• Revenue: $175,000+ from campaign', 10);
        addPdfText('• ROI: 3.5x minimum', 10);
        pdfYPosition += 8;

        // Timeline & Milestones
        addPdfText('Timeline & Milestones', 14, true, [74, 85, 104]);
        pdfYPosition += 3;
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        addPdfText('• Week 1 (Oct 17-23): Campaign launch, initial email blast, social media kickoff', 10);
        addPdfText('• Week 2 (Oct 24-30): Reminder emails, intensified social ads, final push', 10);
        addPdfText('• Halloween Day (Oct 31): Last chance emails, flash sale announcements', 10);
        addPdfText('• Post-Campaign (Nov 1-7): Thank you emails, feedback collection, performance analysis', 10);
        pdfYPosition += 8;

        // Footer
        if (pdfYPosition > pdfPageHeight - pdfMargin - 20) {
          campaignPdf.addPage();
          pdfYPosition = pdfMargin;
        }
        pdfYPosition += 5;
        campaignPdf.setDrawColor(226, 232, 240);
        campaignPdf.setLineWidth(0.3);
        campaignPdf.line(pdfMargin, pdfYPosition, pdfPageWidth - pdfMargin, pdfYPosition);
        pdfYPosition += 5;
        const pdfFooterText = `Document Generated: ${new Date().toLocaleDateString()} | Campaign Strategy Agent | Marketing Super Agent Platform`;
        addPdfText(pdfFooterText, 8, false, [113, 128, 150]);

        // Save the PDF
        campaignPdf.save('Halloween_2025_Campaign_Brief.pdf');

        // Show confirmation message
        const downloadConfirmation: Message = {
          id: `download-confirmation-${Date.now()}`,
          type: 'assistant-text',
          content: 'Campaign brief downloaded successfully as PDF!',
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

      case 'download-tr-gtm-report': {
        // Handle GTM Strategy Report Download
        console.log('Downloading TR GTM Strategy report');

        // Generate HTML report
        const reportHTML = generateTRGTMReport(trGTMDocumentSections, trGTMVOCInsights);

        // Create downloadable file
        const blob = new Blob([reportHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Thomson_Reuters_GTM_Strategy_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show confirmation message
        const downloadMessage: Message = {
          id: generateMessageId(),
          type: 'assistant-text',
          content: 'Your GTM Strategy document has been downloaded! The comprehensive strategy includes all sections with detailed analysis, financial targets, and strategic insights.',
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#475569'
          }
        };
        setMessages(prev => [...prev, downloadMessage]);
        break;
      }

      case 'setup-tr-gtm-approval': {
        // Handle TR GTM Approval Workflow Setup
        console.log('Setting up TR GTM approval workflow');

        // For demo purposes, simulate approval workflow setup with predefined approvers
        const approvalId = `tr-gtm-${Date.now()}`;

        // Create mock approvers
        const approvers = [
          {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@thomsonreuters.com',
            title: 'VP of Marketing',
            status: 'pending' as const,
            approvedAt: null
          },
          {
            name: 'Michael Chen',
            email: 'michael.chen@thomsonreuters.com',
            title: 'Chief Revenue Officer',
            status: 'pending' as const,
            approvedAt: null
          }
        ];

        // Create approval request
        const approvalRequest = {
          id: approvalId,
          documentId: 'tr-gtm-strategy',
          documentTitle: 'Thomson Reuters GTM Strategy Document',
          requestedBy: 'Marketing Team',
          requestedAt: new Date(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          approvers: approvers,
          comments: 'Please review and approve the Thomson Reuters GTM Strategy document covering Strategic Definition and Financial Targets.',
          status: 'pending' as const
        };

        // Save to localStorage
        localStorage.setItem(`approval-${approvalId}`, JSON.stringify(approvalRequest));

        // Generate approval link
        const approvalLink = `${window.location.origin}/approvals/${approvalId}`;

        const approverNames = approvers.map(a => `${a.name} (${a.title})`).join(', ');

        const confirmationMessage: Message = {
          id: generateMessageId(),
          type: 'assistant-text',
          content: `Perfect! Approval workflow has been created and sent to ${approverNames}.\n\nThey will receive email notifications with a link to review and approve the GTM Strategy document. The approval is due within 3 days.`,
          sender: 'assistant',
          timestamp: new Date(),
          metadata: {
            agentName: 'Campaign Strategy Agent',
            agentColor: '#475569',
            actions: [
              { label: 'Open Approval Portal', variant: 'primary' as const, action: `open-approval-${approvalId}` },
              { label: 'Copy Approval Link', variant: 'outline' as const, action: `copy-approval-${approvalId}` }
            ]
          }
        };
        setMessages(prev => [...prev, confirmationMessage]);
        break;
      }

      case 'gtm-competitive-intelligence':
        // Navigate to competitive intelligence mode for GTM
        console.log('Opening GTM competitive intelligence');
        router.push('/chat?mode=gtm-competitive');
        break;

      default:
        // Handle TR GTM section actions
        if (actionLabel.startsWith('tr-gtm-section-')) {
          const sectionId = parseInt(actionLabel.replace('tr-gtm-section-', ''));

          // Section 1: Strategic Definition
          if (sectionId === 1) {
            const section1Questions: Message = {
              id: 'tr-gtm-section1-questions',
              type: 'question',
              content: '',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                questions: ['What business challenge are you trying to solve?'],
                questionOptions: [
                  {
                    question: 'What business challenge are you trying to solve?',
                    options: [
                      'Increase market share in existing segments',
                      'Enter new geographic markets',
                      'Launch new product/solution',
                      'Competitive displacement',
                      'Digital transformation acceleration',
                      'Regulatory compliance modernization'
                    ]
                  }
                ]
              }
            };
            setMessages(prev => [...prev, section1Questions]);
          }

          // Section 2: Financial Targets
          if (sectionId === 2) {
            const section2Questions: Message = {
              id: 'tr-gtm-section2-questions',
              type: 'question',
              content: '',
              sender: 'assistant',
              timestamp: new Date(),
              metadata: {
                questions: ['What are your primary financial objectives for this GTM strategy?'],
                questionOptions: [
                  {
                    question: 'What are your primary financial objectives for this GTM strategy?',
                    options: [
                      'Revenue growth ($X to $Y over 12-24 months)',
                      'Pipeline generation ($ value and # of opportunities)',
                      'Customer acquisition cost (CAC) optimization',
                      'Average deal size expansion',
                      'Customer lifetime value (LTV) improvement',
                      'Market share percentage point gains'
                    ]
                  }
                ]
              }
            };
            setMessages(prev => [...prev, section2Questions]);
          }

        } else if (actionLabel.startsWith('open-approval-')) {
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
        ) : isTRGTMMode ? (
          /* TR GTM Strategy Interface - Split View */
          <TRGTMInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onActionClick={handleActionClick}
            documentSections={trGTMDocumentSections}
            vocInsights={trGTMVOCInsights}
            conflictAlerts={trGTMConflictAlerts}
            uploadedDocument={gtmUploadedDocument}
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