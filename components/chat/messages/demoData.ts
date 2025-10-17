import { Message } from './types';

// Starter prompts for the empty state
export const STARTER_PROMPTS = [
  {
    id: '1',
    text: 'Create a campaign brief for my holiday promotion',
    icon: 'Calendar',
    category: 'campaign'
  },
  {
    id: '2',
    text: 'Build an email journey for cart abandonment',
    icon: 'Mail',
    category: 'journey'
  },
  {
    id: '3',
    text: 'Analyze my last campaign\'s performance',
    icon: 'BarChart3',
    category: 'analysis'
  },
  {
    id: '4',
    text: 'Design a multi-channel campaign strategy',
    icon: 'Palette',
    category: 'creative'
  }
];

// Initial demo conversation that stops at questions for user interaction
export const DEMO_INITIAL_MESSAGES: Message[] = [
  // 1. User initial request
  {
    id: '1',
    type: 'user-text',
    content: 'I have a Halloween themed campaign that should deploy two weeks before Halloween',
    sender: 'user',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  },

  // 2. Assistant initial response
  {
    id: '2',
    type: 'assistant-text',
    content: "Great! I'll help you create a comprehensive campaign brief for your Halloween campaign. Let me gather some information first.",
    sender: 'assistant',
    timestamp: new Date(Date.now() - 280000), // 4 min 40 sec ago
  },

  // 3. Thinking indicator - Campaign Strategy Agent
  {
    id: '3',
    type: 'thinking',
    content: '',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 270000), // 4 min 30 sec ago
    metadata: {
      agentName: 'Campaign Strategy Agent',
    },
  },

  // 4. Question prompt
  {
    id: '4',
    type: 'question',
    content: '',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 260000), // 4 min 20 sec ago
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
    },
  },

];

// Messages that continue after user submits question answers
export const DEMO_CONTINUATION_MESSAGES: Message[] = [
  // 1. Assistant orchestration message
  {
    id: 'cont-1',
    type: 'assistant-text',
    content: "Perfect! I'm now working with multiple agents to build your comprehensive campaign brief.",
    sender: 'assistant',
    timestamp: new Date(),
  },

  // 2. Thinking - Audience & Persona Agent
  {
    id: 'cont-2',
    type: 'thinking',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Audience & Persona Agent',
    },
  },

  // 3. Audience & Persona Agent provides recommendations
  {
    id: 'cont-3',
    type: 'assistant-text',
    content: 'Based on our historical data analysis, I\'ve identified the optimal customer segments for your Halloween campaign. Here are the detailed customer profiles with demographic insights and behavioral patterns:',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Audience & Persona Agent',
      agentColor: '#2563eb'
    },
  },

  // 4. Metrics tiles for customer segments
  {
    id: 'cont-4',
    type: 'metrics-tiles',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      metrics: [
        {
          label: 'Primary Segment: Millennials (25-35)',
          value: '267K customers',
          change: '+12% vs last Halloween',
          icon: 'Users',
          color: '#2563eb'
        },
        {
          label: 'Secondary: Gen Z Halloween Enthusiasts (18-25)',
          value: '143K customers',
          change: '+23% seasonal engagement',
          icon: 'TrendingUp',
          color: '#10b981'
        },
        {
          label: 'Avg. Halloween Spend per Customer',
          value: '$127',
          change: '+8% vs seasonal avg',
          icon: 'DollarSign',
          color: '#f59e0b'
        },
        {
          label: 'Total Addressable Audience',
          value: '847K people',
          change: '73% Halloween participation',
          icon: 'Target',
          color: '#7c3aed'
        }
      ]
    },
  },

  // 5. Detailed customer attributes explanation
  {
    id: 'cont-5',
    type: 'assistant-text',
    content: '**Primary Segment Details:**\n• Millennials (25-35): Urban professionals, 65% female, household income $50K-$85K\n• High social media usage, prefer Instagram/TikTok content\n• Halloween spending driven by home decorating and costume parties\n\n**Secondary Segment:**\n• Gen Z (18-25): College students and early career, 58% female\n• Mobile-first shoppers, influenced by trends and peer recommendations\n• Focus on costume creativity and social sharing\n\n**Key Insights:** Both segments show 73% participation in Halloween activities, with peak shopping occurring 2-3 weeks before Halloween.',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Audience & Persona Agent',
      agentColor: '#2563eb'
    },
  },


  // 7. Thinking - Campaign Strategy Agent
  {
    id: 'cont-7',
    type: 'thinking',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Campaign Strategy Agent',
    },
  },

  // 8. Thinking - Data Analytics Agent
  {
    id: 'cont-8',
    type: 'thinking',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Data Analytics Agent',
    },
  },

  // 9. Final result with document
  {
    id: 'cont-9',
    type: 'assistant-text',
    content: "Your campaign brief is ready! I've created a comprehensive strategy document that includes budget allocation, detailed target audience analysis with demographic profiles, campaign objectives, and recommended tactics.",
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Campaign Strategy Agent',
      agentColor: '#7c3aed',
      documentData: {
        title: 'Halloween 2025 Campaign Brief',
        description: 'Complete campaign strategy with data-driven audience targeting and optimized budget allocation',
        fileType: 'PDF',
      },
    },
  },


  // 10. A/B Test Option
  {
    id: 'cont-10',
    type: 'assistant-text',
    content: "Would you like to create an A/B test with a different budget to compare campaign performance across these customer segments?",
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Campaign Strategy Agent',
      agentColor: '#7c3aed',
    },
  },

  // 11. Action buttons for final campaign and A/B test
  {
    id: 'cont-11',
    type: 'action-buttons',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      actions: [
        {
          label: 'Set Up A/B Test',
          variant: 'primary' as const,
        },
        {
          label: 'Set Up Approval Workflow',
          variant: 'outline' as const,
        },
      ],
    },
  },
];

// A/B Test flow messages (triggered when user clicks "Set Up A/B Test")
export const DEMO_ABTEST_MESSAGES: Message[] = [
  // 1. Budget question for A/B test
  {
    id: 'ab-1',
    type: 'question',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      questions: [
        'What budget would you like for the A/B test variant?',
      ],
      questionOptions: [
        {
          question: 'What budget would you like for the A/B test variant?',
          options: ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K+']
        }
      ]
    },
  },

  // 2. Processing A/B test
  {
    id: 'ab-2',
    type: 'assistant-text',
    content: 'Perfect! I\'m now creating your A/B test with budget comparison analysis.',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Campaign Strategy Agent',
      agentColor: '#7c3aed',
    },
  },

  // 3. Thinking - Processing A/B test
  {
    id: 'ab-3',
    type: 'thinking',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Data Analytics Agent',
    },
  },

  // 4. A/B Test Comparison Metrics
  {
    id: 'ab-4',
    type: 'metrics-tiles',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      metrics: [
        {
          label: 'Budget A Performance',
          value: '4.2x ROI',
          change: 'Baseline',
          icon: 'DollarSign',
          color: '#2563eb'
        },
        {
          label: 'Budget B Performance',
          value: '3.8x ROI',
          change: '-9%',
          icon: 'DollarSign',
          color: '#f59e0b'
        },
        {
          label: 'Reach Difference',
          value: '+24%',
          change: 'Budget B',
          icon: 'Target',
          color: '#10b981'
        },
        {
          label: 'Cost Per Conversion',
          value: '$23',
          change: 'vs $31',
          icon: 'TrendingUp',
          color: '#7c3aed'
        }
      ]
    },
  },

  // 5. A/B Test Results
  {
    id: 'ab-5',
    type: 'assistant-text',
    content: 'Based on the analysis, the higher budget shows 24% more reach but 9% lower ROI. The optimal approach would be to start with your original budget and scale up if initial performance meets targets.',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      agentName: 'Data Analytics Agent',
      agentColor: '#14b8a6',
    },
  },

  // 6. Final A/B Test Actions
  {
    id: 'ab-6',
    type: 'action-buttons',
    content: '',
    sender: 'assistant',
    timestamp: new Date(),
    metadata: {
      actions: [
        {
          label: 'Use Recommended Strategy',
          variant: 'primary' as const,
        },
        {
          label: 'View Detailed A/B Report',
          variant: 'outline' as const,
        },
      ],
    },
  },
];

// Complete demo messages (for backward compatibility)
export const DEMO_CAMPAIGN_BRIEF_MESSAGES = DEMO_INITIAL_MESSAGES;

// Helper function to get a subset of messages for testing
export const getTestMessages = (count: number = 5): Message[] => {
  return DEMO_CAMPAIGN_BRIEF_MESSAGES.slice(0, count);
};

// Helper function to simulate real-time message arrival
export const simulateMessageFlow = (
  onMessage: (message: Message) => void,
  delay: number = 2000
): (() => void) => {
  let currentIndex = 0;
  let intervalId: NodeJS.Timeout;

  const sendNextMessage = () => {
    if (currentIndex < DEMO_CAMPAIGN_BRIEF_MESSAGES.length) {
      onMessage(DEMO_CAMPAIGN_BRIEF_MESSAGES[currentIndex]);
      currentIndex++;
    } else {
      clearInterval(intervalId);
    }
  };

  // Start sending messages
  intervalId = setInterval(sendNextMessage, delay);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};