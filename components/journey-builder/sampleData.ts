import { JourneyNode, Campaign } from './types';

export const sampleCampaign: Campaign = {
  id: 'halloween-email-2025',
  name: 'Halloween Email Campaign',
  audienceSize: 45000,
  channels: ['Email', 'SMS'],
  hasExperiment: true,
  status: 'draft'
};

export const halloweenJourney: JourneyNode[] = [
  {
    id: 'entry-1',
    type: 'entry',
    label: 'Campaign Entry',
    status: 'configured',
    position: { x: 400, y: 80 },
    config: {
      audienceSize: 45000,
      entryConditions: ['Subscribed to newsletter', 'Located in US/CA', 'Active in last 30 days'],
      segmentName: 'Halloween Campaign Audience 2025'
    },
    nextNodes: ['wait-1'],
    generatedByAI: true
  },
  {
    id: 'wait-1',
    type: 'wait',
    label: 'Wait 24 hours',
    status: 'configured',
    position: { x: 400, y: 200 },
    config: {
      duration: 24,
      unit: 'hours',
      type: 'time'
    },
    nextNodes: ['email-1'],
    generatedByAI: true
  },
  {
    id: 'email-1',
    type: 'email',
    label: 'Email 1: Spooky Savings',
    status: 'configured',
    position: { x: 400, y: 320 },
    config: {
      subjectLine: 'Spooky Savings Start Now! 🎃',
      subjectLineVariants: ['Spooky Savings Start Now! 🎃', 'Get Ready for Halloween Deals 👻'],
      previewText: 'Don\'t miss our Halloween promotion - exclusive deals inside!',
      templateId: 'halloween-2025-v1',
      content: '<html><body><h1>Halloween Savings Are Here!</h1><p>Get ready for spook-tacular deals...</p></body></html>',
      generatedBy: ['creative-agent']
    },
    nextNodes: ['wait-2'],
    hasABTest: true,
    generatedByAI: true
  },
  {
    id: 'wait-2',
    type: 'wait',
    label: 'Wait 48 hours',
    status: 'configured',
    position: { x: 400, y: 440 },
    config: {
      duration: 48,
      unit: 'hours',
      type: 'time'
    },
    nextNodes: ['decision-1'],
    generatedByAI: true
  },
  {
    id: 'decision-1',
    type: 'decision',
    label: 'Opened Email 1?',
    status: 'configured',
    position: { x: 400, y: 560 },
    config: {
      criteria: 'Email Open Rate',
      branches: [
        { condition: 'Opened Email', nextNodeId: 'email-2' },
        { condition: 'Did Not Open', nextNodeId: 'sms-1' }
      ]
    },
    nextNodes: ['email-2', 'sms-1'],
    generatedByAI: true
  },
  {
    id: 'email-2',
    type: 'email',
    label: 'Email 2: Last Chance',
    status: 'configured',
    position: { x: 200, y: 680 },
    config: {
      subjectLine: 'Last Chance for Halloween Deals! ⏰',
      previewText: 'Don\'t let these spooky savings disappear...',
      templateId: 'halloween-2025-v2',
      content: '<html><body><h1>Final Days of Halloween Sale!</h1><p>Last chance to save...</p></body></html>',
      generatedBy: ['creative-agent']
    },
    nextNodes: ['wait-3'],
    generatedByAI: true
  },
  {
    id: 'sms-1',
    type: 'sms',
    label: 'SMS: Don\'t Miss Out',
    status: 'configured',
    position: { x: 600, y: 680 },
    config: {
      content: '🎃 Halloween Sale! Don\'t miss 40% off everything. Shop now: [link] Reply STOP to opt out.',
      generatedBy: ['creative-agent']
    },
    nextNodes: ['wait-3'],
    generatedByAI: true
  },
  {
    id: 'wait-3',
    type: 'wait',
    label: 'Wait 72 hours',
    status: 'configured',
    position: { x: 400, y: 800 },
    config: {
      duration: 72,
      unit: 'hours',
      type: 'time'
    },
    nextNodes: ['email-3'],
    generatedByAI: true
  },
  {
    id: 'email-3',
    type: 'email',
    label: 'Email 3: Final Hours',
    status: 'configured',
    position: { x: 400, y: 920 },
    config: {
      subjectLine: 'FINAL HOURS: Halloween Sale Ends Tonight! 🚨',
      previewText: 'This is it - Halloween sale ends in hours...',
      templateId: 'halloween-2025-v3',
      content: '<html><body><h1>Halloween Sale Ends Tonight!</h1><p>Final hours to save...</p></body></html>',
      generatedBy: ['creative-agent']
    },
    nextNodes: [],
    generatedByAI: true
  }
];

export const sampleMessages = [
  {
    id: '1',
    type: 'user' as const,
    content: 'Build me a campaign from this brief',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    type: 'assistant' as const,
    content: 'I\'ll create a complete campaign based on your Halloween brief. Let me ask a couple questions first.',
    timestamp: new Date(Date.now() - 280000)
  },
  {
    id: '3',
    type: 'assistant' as const,
    content: 'Do you want to run A/B experiments with different subject lines?',
    timestamp: new Date(Date.now() - 260000)
  },
  {
    id: '4',
    type: 'user' as const,
    content: 'Yes, that would be great',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '5',
    type: 'assistant' as const,
    content: 'Which creative assets should I use for the Halloween theme?',
    timestamp: new Date(Date.now() - 220000)
  },
  {
    id: '6',
    type: 'user' as const,
    content: 'Use the Halloween 2025 creative assets',
    timestamp: new Date(Date.now() - 200000)
  },
  {
    id: '7',
    type: 'assistant' as const,
    content: 'Perfect! I\'m now building your journey with the Journey Agent and Creative Agent working together...',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '8',
    type: 'assistant' as const,
    content: 'Your campaign is ready! I\'ve created a 3-email sequence with SMS backup for non-openers. The journey includes A/B testing for subject lines and targets your 45k Halloween audience. Click any step to review the details.',
    timestamp: new Date(Date.now() - 120000)
  }
];