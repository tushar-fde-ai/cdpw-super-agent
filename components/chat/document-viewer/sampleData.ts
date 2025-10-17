import { Document, TeamMember } from './types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    title: 'CMO',
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.j@company.com',
    title: 'Lifecycle Marketing Lead',
    avatar: 'MJ'
  },
  {
    id: '3',
    name: 'Jessica Williams',
    email: 'j.williams@company.com',
    title: 'Marketing Manager',
    avatar: 'JW'
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'd.brown@company.com',
    title: 'Content Director',
    avatar: 'DB'
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.d@company.com',
    title: 'Campaign Manager',
    avatar: 'ED'
  },
];

export const sampleCampaignBrief: Document = {
  id: 'halloween-2025-brief',
  title: 'Halloween 2025 Campaign Brief',
  type: 'campaign-brief',
  status: 'draft',
  createdAt: new Date(),
  content: [
    {
      id: 'exec-summary',
      heading: 'Executive Summary',
      content: 'This Halloween 2025 campaign targets millennials aged 25-40 with spooky-themed promotions designed to drive online sales during the peak Halloween shopping season. With a strategic $50,000 budget allocated across email marketing and social media channels, we aim to achieve a 15% increase in October revenue compared to last year. Our data-driven approach focuses on high-engagement customer segments who have shown strong seasonal purchasing behavior, leveraging personalized messaging and exclusive Halloween offers to maximize conversion rates.'
    },
    {
      id: 'objectives',
      heading: 'Campaign Objectives',
      content: 'Primary Goal: Drive online sales and increase October revenue by 15% year-over-year\n\nSecondary Goals:\n• Increase email list engagement by 25%\n• Grow social media following by 2,000 new followers\n• Build brand awareness among target demographic\n• Test new creative formats for future seasonal campaigns\n• Achieve customer acquisition cost under $25\n• Maintain brand consistency across all touchpoints'
    },
    {
      id: 'audience',
      heading: 'Target Audience',
      content: 'Our primary audience consists of millennials aged 25-40 who are digitally native, engage actively with seasonal promotions, and have demonstrated purchasing behavior during previous Halloween campaigns. This demographic shows high social media engagement and prefers online shopping experiences.',
      subsections: [
        {
          id: 'persona-1',
          heading: 'Primary Persona: Halloween Enthusiast Hannah',
          content: 'Age: 28-35\nIncome: $60,000-$90,000\nLocation: Urban and suburban areas\nBehavior: Actively plans Halloween celebrations, shops online frequently, follows brands on social media, shares seasonal content\nMotivations: Unique finds, good deals, convenience, social sharing\nPain Points: Limited time for shopping, overwhelming choices, wants quality products\nShopping Habits: Browses on mobile, purchases on desktop, influenced by reviews'
        },
        {
          id: 'persona-2',
          heading: 'Secondary Persona: Busy Parent Ben',
          content: 'Age: 32-40\nIncome: $75,000-$120,000\nLocation: Suburban family neighborhoods\nBehavior: Shops for family Halloween needs, values efficiency and reliability\nMotivations: Family-friendly options, bulk deals, trusted brands\nPain Points: Time constraints, budget considerations, quality concerns\nShopping Habits: Quick decision-maker, values reviews and recommendations'
        }
      ]
    },
    {
      id: 'strategy',
      heading: 'Campaign Strategy',
      content: 'Our multi-channel approach leverages email marketing and social media to create brand awareness, drive engagement, and convert prospects into customers. The strategy focuses on storytelling, user-generated content, and personalized experiences to build emotional connections with our Halloween themes.',
      subsections: [
        {
          id: 'channels',
          heading: 'Channel Mix & Budget Allocation',
          content: 'Email Marketing: 60% of budget ($30,000)\n• Primary conversion driver\n• Segmented campaigns for different personas\n• Automated welcome and cart abandonment series\n\nSocial Media: 40% of budget ($20,000)\n• Instagram and Facebook focus\n• Awareness and engagement driver\n• User-generated content campaigns\n• Influencer partnerships'
        },
        {
          id: 'messaging',
          heading: 'Messaging Framework',
          content: 'Core Message: "Make This Halloween Unforgettable"\n\nKey Themes:\n• Spooky Fun: Playful and engaging Halloween spirit\n• Quality & Style: Premium products that stand out\n• Easy Shopping: Convenient online experience\n• Community: Join the Halloween celebration\n\nTone: Playful, confident, seasonal, inclusive'
        }
      ]
    },
    {
      id: 'tactics',
      heading: 'Tactics & Execution',
      content: 'Detailed execution plan with specific tactics for each channel and phase of the campaign.',
      subsections: [
        {
          id: 'email-tactics',
          heading: 'Email Marketing Tactics',
          content: '• Welcome Series: 3-email Halloween onboarding sequence\n• Product Showcases: Weekly featured Halloween collections\n• Flash Sales: Limited-time Halloween offers\n• Cart Abandonment: Spooky-themed recovery emails\n• Countdown Campaigns: Building urgency as Halloween approaches'
        },
        {
          id: 'social-tactics',
          heading: 'Social Media Tactics',
          content: '• Halloween Transformation Posts: Before/after content\n• User-Generated Content: Customer Halloween setups\n• Halloween Tips & Tricks: Educational content\n• Live Halloween Prep Sessions: Real-time engagement\n• Costume & Decoration Contests: Community building'
        }
      ]
    },
    {
      id: 'metrics',
      heading: 'Success Metrics & KPIs',
      content: 'Primary Metrics:\n• Revenue Target: $150,000 in October sales\n• ROI Target: Minimum 300% return on ad spend\n• Conversion Rate: >2.5% across all channels\n\nEmail Metrics:\n• Open Rate: >25% (above industry average)\n• Click-through Rate: >4%\n• Unsubscribe Rate: <0.5%\n\nSocial Media Metrics:\n• Engagement Rate: >5%\n• Follower Growth: 2,000 new followers\n• User-Generated Content: 500+ customer posts\n• Social Traffic: 15% of total website traffic'
    },
    {
      id: 'budget',
      heading: 'Budget Allocation',
      content: 'Total Campaign Budget: $50,000\n\nEmail Marketing: $30,000 (60%)\n• Platform costs: $5,000\n• Creative development: $8,000\n• Automation setup: $7,000\n• A/B testing: $5,000\n• Analytics & reporting: $5,000\n\nSocial Media: $20,000 (40%)\n• Paid advertising: $12,000\n• Content creation: $5,000\n• Influencer partnerships: $2,000\n• Community management: $1,000'
    },
    {
      id: 'timeline',
      heading: 'Timeline & Milestones',
      content: 'September 15-30: Campaign Planning & Creative Development\n• Finalize creative assets\n• Set up email automation\n• Create social media content calendar\n• Brief influencer partners\n\nOctober 1-7: Campaign Setup & Soft Launch\n• Upload all creative assets\n• Test email automations\n• Launch social media teasers\n• Monitor initial performance\n\nOctober 8-14: Full Campaign Launch\n• Deploy main email campaigns\n• Activate paid social advertising\n• Begin user-generated content campaign\n• Daily performance monitoring\n\nOctober 15-25: Peak Campaign Period\n• Intensify promotional messaging\n• Launch flash sales and urgency campaigns\n• Maximize social media engagement\n• Real-time optimization\n\nOctober 26-31: Final Push\n• Last-chance messaging\n• Expedited shipping promotions\n• Halloween day celebrations\n• Campaign wrap-up\n\nNovember 1-5: Analysis & Reporting\n• Compile final performance metrics\n• Analyze customer feedback\n• Document learnings for future campaigns\n• Prepare executive summary report'
    }
  ]
};