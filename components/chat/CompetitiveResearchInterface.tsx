'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Target, TrendingUp, Users, Calendar, DollarSign, FileText, Lightbulb, Eye, BarChart3, Clock, Globe, Filter, Database, CheckCircle } from 'lucide-react';
import { Message } from './messages/types';
import MessageBubble from './messages/MessageBubble';
import MessageInput from './MessageInput';

interface CompetitiveResearchInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onActionClick: (actionLabel: string) => void;
}

export default function CompetitiveResearchInterface({
  messages,
  isLoading,
  onSendMessage,
  onActionClick
}: CompetitiveResearchInterfaceProps) {
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<string | null>(null);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<Array<{id: string, text: string, icon: any, completed: boolean}>>([]);
  const [visibleInsights, setVisibleInsights] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedWorkflows, setCompletedWorkflows] = useState<Record<string, Array<{id: string, text: string, icon: any, completed: boolean}>>>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);

  // Sample competitive intelligence questions organized by category
  const questionCategories = [
    {
      id: 'creative-strategies',
      title: 'Creative Strategies',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-white text-gray-900 border-gray-200',
      questions: [
        'What creative themes are major brands using for Halloween 2025?',
        'Which visual styles are trending in Halloween campaigns?',
        'What messaging strategies are competitors focusing on?',
        'How are brands incorporating seasonal elements into their creative?'
      ]
    },
    {
      id: 'audience-targeting',
      title: 'Audience & Targeting',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-white text-gray-900 border-gray-200',
      questions: [
        'Which demographics are competitors targeting for Halloween?',
        'What audience segments show highest engagement?',
        'How are brands personalizing Halloween content?',
        'What geographic targeting strategies are being used?'
      ]
    },
    {
      id: 'channel-mix',
      title: 'Channel Strategy',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-white text-gray-900 border-gray-200',
      questions: [
        'Which channels are driving the most Halloween engagement?',
        'How are brands coordinating cross-channel campaigns?',
        'What social media platforms are most effective?',
        'Which email strategies are performing best?'
      ]
    },
    {
      id: 'timing-budget',
      title: 'Timing & Investment',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-white text-gray-900 border-gray-200',
      questions: [
        'When did competitors launch their Halloween campaigns?',
        'What budget levels are indicated by campaign scale?',
        'How long are Halloween campaign windows?',
        'What pre-Halloween vs post-Halloween strategies exist?'
      ]
    }
  ];

  // Competitive research insights organized by category
  const competitiveInsights = {
    'creative-strategies': {
      title: 'Creative Strategies',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-purple-100 border-purple-200',
      insights: [
        {
          title: 'Trending Visual Themes',
          icon: <Eye className="w-4 h-4 text-gray-600" />,
          content: 'Retro 80s horror aesthetics, neon colors, and vintage movie poster styles are dominating Halloween 2025 campaigns across major brands.',
          brands: ['Netflix', 'Spotify', 'Nike']
        },
        {
          title: 'Popular Creative Elements',
          icon: <Lightbulb className="w-4 h-4 text-gray-600" />,
          content: 'Interactive AR filters, user-generated costume contests, and cinematic video teasers are the most engaging creative formats.',
          brands: ['Instagram', 'TikTok', 'Snapchat']
        },
        {
          title: 'Messaging Focus',
          icon: <FileText className="w-4 h-4 text-gray-600" />,
          content: 'Brands emphasize community, nostalgia, and "spook-tacular" wordplay while avoiding genuinely scary content.',
          brands: ['Target', 'Starbucks', 'Disney']
        }
      ]
    },
    'audience-targeting': {
      title: 'Audience & Targeting',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-100 border-blue-200',
      insights: [
        {
          title: 'Primary Demographics',
          icon: <Users className="w-4 h-4 text-gray-600" />,
          content: 'Millennials (25-40) with disposable income, Gen Z (18-27) seeking experiences, and families with children under 12.',
          brands: ['Amazon', 'Target', 'Walmart']
        },
        {
          title: 'Geographic Targeting',
          icon: <Target className="w-4 h-4 text-gray-600" />,
          content: 'Heavy focus on suburban markets, college towns, and metropolitan areas with high trick-or-treat participation.',
          brands: ['Home Depot', 'Lowes', 'Party City']
        },
        {
          title: 'Personalization Tactics',
          icon: <Eye className="w-4 h-4 text-gray-600" />,
          content: 'Costume recommendations based on purchase history, location-based store promotions, and family size targeting.',
          brands: ['Amazon', 'Google', 'Facebook']
        }
      ]
    },
    'channel-mix': {
      title: 'Channel Strategy',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-green-100 border-green-200',
      insights: [
        {
          title: 'Top Performing Channels',
          icon: <BarChart3 className="w-4 h-4 text-gray-600" />,
          content: 'Instagram Stories and Reels drive 40% of engagement, followed by TikTok (25%) and YouTube Shorts (20%).',
          brands: ['Sephora', 'Urban Outfitters', 'Hot Topic']
        },
        {
          title: 'Cross-Channel Integration',
          icon: <TrendingUp className="w-4 h-4 text-gray-600" />,
          content: 'QR codes in physical stores linking to digital experiences, social media driving to email capture, TV ads promoting app downloads.',
          brands: ['Target', 'Best Buy', 'Macy\'s']
        },
        {
          title: 'Email Performance',
          icon: <FileText className="w-4 h-4 text-gray-600" />,
          content: 'Halloween email campaigns see 35% higher open rates than average, with countdown sequences performing best.',
          brands: ['Pottery Barn', 'Williams Sonoma', 'Crate & Barrel']
        }
      ]
    },
    'timing-budget': {
      title: 'Timing & Investment',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-orange-100 border-orange-200',
      insights: [
        {
          title: 'Campaign Launch Windows',
          icon: <Clock className="w-4 h-4 text-gray-600" />,
          content: 'Early birds launch September 15th, mainstream brands start October 1st, last-minute push begins October 20th.',
          brands: ['Costco', 'Target', 'CVS']
        },
        {
          title: 'Budget Allocation',
          icon: <DollarSign className="w-4 h-4 text-gray-600" />,
          content: 'Average spend: $50K-500K for major retailers, 60% digital, 25% traditional media, 15% in-store experiences.',
          brands: ['Walmart', 'Amazon', 'Target']
        },
        {
          title: 'Post-Halloween Strategy',
          icon: <Calendar className="w-4 h-4 text-gray-600" />,
          content: 'Immediate pivot to Christmas (November 1st), Halloween clearance sales, and "Thanksgiving prep" messaging.',
          brands: ['Target', 'Home Depot', 'Walmart']
        }
      ]
    }
  };

  // Halloween campaign summary data
  const campaignSummary = {
    name: 'Halloween 2025 Campaign',
    budget: '$50K - $100K',
    targetAudience: '847K people',
    timeline: 'October 17 - November 3, 2025',
    objectives: [
      'Drive 30% increase in seasonal sales',
      'Boost brand awareness among millennials',
      'Generate 25% more email signups',
      'Increase social media engagement by 40%'
    ],
    channels: ['Email Marketing', 'Social Media', 'Display Ads', 'Content Marketing'],
    keyMetrics: [
      { label: 'Target Reach', value: '847K', icon: Users },
      { label: 'Budget', value: '$75K', icon: DollarSign },
      { label: 'Campaign Duration', value: '18 days', icon: Calendar },
      { label: 'Channels', value: '4', icon: TrendingUp }
    ]
  };

  // Workflow definitions for each category
  const workflowDefinitions = {
    'creative-strategies': [
      { id: 'search', text: 'Searching web for Halloween creative campaigns...', icon: Globe, completed: false },
      { id: 'gather', text: 'Gathered 247 campaign examples from major brands', icon: Database, completed: false },
      { id: 'filter', text: 'Filtering for creative strategy patterns...', icon: Filter, completed: false },
      { id: 'analyze', text: 'Analyzing visual themes and messaging trends', icon: Eye, completed: false },
      { id: 'complete', text: 'Creative strategy insights ready', icon: CheckCircle, completed: false }
    ],
    'audience-targeting': [
      { id: 'search', text: 'Scanning audience targeting data...', icon: Globe, completed: false },
      { id: 'gather', text: 'Collected 156 audience insights from campaigns', icon: Database, completed: false },
      { id: 'filter', text: 'Filtering demographic and geographic data...', icon: Filter, completed: false },
      { id: 'analyze', text: 'Analyzing targeting strategies and personas', icon: Users, completed: false },
      { id: 'complete', text: 'Audience targeting insights ready', icon: CheckCircle, completed: false }
    ],
    'channel-mix': [
      { id: 'search', text: 'Researching channel performance data...', icon: Globe, completed: false },
      { id: 'gather', text: 'Gathered 189 channel strategy examples', icon: Database, completed: false },
      { id: 'filter', text: 'Filtering cross-channel integration data...', icon: Filter, completed: false },
      { id: 'analyze', text: 'Analyzing channel mix and performance metrics', icon: BarChart3, completed: false },
      { id: 'complete', text: 'Channel strategy insights ready', icon: CheckCircle, completed: false }
    ],
    'timing-budget': [
      { id: 'search', text: 'Analyzing campaign timing and spend data...', icon: Globe, completed: false },
      { id: 'gather', text: 'Collected 134 budget and timeline insights', icon: Database, completed: false },
      { id: 'filter', text: 'Filtering investment and timing patterns...', icon: Filter, completed: false },
      { id: 'analyze', text: 'Analyzing budget allocation and launch windows', icon: Calendar, completed: false },
      { id: 'complete', text: 'Timing & investment insights ready', icon: CheckCircle, completed: false }
    ]
  };

  const startWorkflow = async (categoryId: string) => {
    setCurrentWorkflow(categoryId);
    setIsProcessing(true);

    const workflow = workflowDefinitions[categoryId as keyof typeof workflowDefinitions];
    const steps = [...workflow];
    setWorkflowSteps(steps);

    // Simulate agent workflow with timed steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); // 1.5-2.5s per step

      setWorkflowSteps(prev =>
        prev.map((step, index) =>
          index === i ? { ...step, completed: true } : step
        )
      );

      // Show insights progressively after certain steps - ADD to existing insights
      if (i === 2) { // After filtering
        setVisibleInsights(prev => {
          if (!prev.includes(categoryId)) {
            return [...prev, categoryId];
          }
          return prev;
        });
      }
    }

    // Save completed workflow and mark category as complete
    setCompletedWorkflows(prev => ({
      ...prev,
      [categoryId]: steps.map(step => ({ ...step, completed: true }))
    }));
    setCompletedCategories(prev => [...prev.filter(id => id !== categoryId), categoryId]);
    setIsProcessing(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = questionCategories.find(cat => cat.id === categoryId);
    if (category) {
      // If already completed, just show the insights without sending a message
      if (completedCategories.includes(categoryId)) {
        if (!visibleInsights.includes(categoryId)) {
          setVisibleInsights(prev => [...prev, categoryId]);
        }
      } else {
        // Start workflow without sending a message that triggers generic response
        startWorkflow(categoryId);
      }
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Side - Interactive Chat */}
      <div className="w-[35%] flex flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Competitive Intelligence</h2>
                <p className="text-sm text-gray-600">Research Halloween campaign strategies</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Active</span>
            </div>
          </div>

          {/* Active Agents Display - Only show when there are messages */}
          {messages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'deep-research', name: 'Deep Research', icon: Globe, color: 'bg-blue-100 text-blue-800' },
                { id: 'whitespace-analysis', name: 'Whitespace Analysis', icon: Filter, color: 'bg-purple-100 text-purple-800' },
                { id: 'competitive-intelligence', name: 'Competitive Intelligence', icon: Search, color: 'bg-green-100 text-green-800' }
              ].map((agent, index) => {
                // Show activation sequence during agent selection phase
                const shouldShowActivation = true; // Always show activation for competitive intelligence
                const activationDelay = index * 0.5; // Stagger the activation

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      backgroundColor: shouldShowActivation
                        ? ['rgb(243 244 246)', 'rgb(59 130 246)', 'rgb(59 130 246)']
                        : undefined,
                      color: shouldShowActivation
                        ? ['rgb(75 85 99)', 'rgb(255 255 255)', 'rgb(255 255 255)']
                        : undefined
                    }}
                    transition={{
                      delay: activationDelay,
                      duration: 0.5,
                      backgroundColor: shouldShowActivation
                        ? { delay: activationDelay + 0.3, duration: 0.3 }
                        : undefined,
                      color: shouldShowActivation
                        ? { delay: activationDelay + 0.3, duration: 0.3 }
                        : undefined
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      shouldShowActivation
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <motion.span
                      animate={shouldShowActivation ? { scale: [1, 1.2, 1] } : {}}
                      transition={shouldShowActivation ? {
                        duration: 1,
                        repeat: Infinity,
                        delay: activationDelay + 0.5
                      } : {}}
                    >
                      <agent.icon size={14} />
                    </motion.span>
                    <span>{agent.name}</span>
                    {shouldShowActivation && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: activationDelay + 0.5
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              metadata={message.metadata}
              onActionClick={onActionClick}
            />
          ))}

          {/* Research Categories (show initially, before any workflows complete) */}
          {!isProcessing && Object.keys(completedWorkflows).length === 0 && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 max-w-md border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Research Categories</span>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {completedCategories.length === 0
                    ? "Select a category to begin competitive analysis:"
                    : "Select additional categories or view completed research:"
                  }
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {questionCategories.map((category) => {
                    const isCompleted = completedCategories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left hover:shadow-sm ${
                          isCompleted
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : category.color
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            category.icon
                          )}
                          <span className="text-sm font-medium">{category.title}</span>
                          {isCompleted && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Agent Workflow Display */}
          {isProcessing && workflowSteps.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 max-w-md border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Deep Research Agent</span>
                </div>
                <div className="space-y-2">
                  {workflowSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`flex items-center gap-3 p-2 rounded transition-all duration-500 ${
                        step.completed
                          ? 'bg-green-50 text-green-800'
                          : index === workflowSteps.findIndex(s => !s.completed)
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${step.completed ? 'text-green-600' : 'text-blue-600'}`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : index === workflowSteps.findIndex(s => !s.completed) ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <step.icon className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-xs">{step.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Display Completed Workflows with Categories after each */}
          {Object.entries(completedWorkflows).map(([categoryId, steps], index) => (
            <div key={`completed-${categoryId}`}>
              {/* Completed Workflow */}
              <div className="flex justify-start mb-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 max-w-md border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {questionCategories.find(cat => cat.id === categoryId)?.title} - Complete
                    </span>
                  </div>
                  <div className="space-y-2">
                    {steps.map((step, stepIndex) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-2 rounded bg-green-50 text-green-800"
                      >
                        <div className="flex-shrink-0 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-xs">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Categories after each completed workflow (except the last one if processing) */}
              {(index === Object.keys(completedWorkflows).length - 1) && !isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 max-w-md border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Research Categories</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      {completedCategories.length === questionCategories.length
                        ? "All research completed! Click any category to review insights."
                        : "Select additional categories to continue research:"
                      }
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {questionCategories.map((category) => {
                        const isCompleted = completedCategories.includes(category.id);
                        return (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`p-3 rounded-lg border transition-all duration-200 text-left hover:shadow-sm ${
                              isCompleted
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : category.color
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                category.icon
                              )}
                              <span className="text-sm font-medium">{category.title}</span>
                              {isCompleted && (
                                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Completed
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && !isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-600">Researching...</span>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <MessageInput
            onSendMessage={onSendMessage}
            placeholder="Ask about competitor strategies..."
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Right Side - Competitive Research Insights */}
      <div className="w-[65%] bg-gray-50 overflow-y-auto">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Competitive Research Insights</h2>
              <p className="text-sm text-gray-600">Halloween 2025 campaign intelligence</p>
            </div>
          </div>
        </div>

        {/* Competitive Insights */}
        <div className="p-6 space-y-6">
          {/* Campaign Context */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-blue-100 rounded">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Your Campaign</h3>
            </div>
            <p className="text-xs text-gray-600 mb-2">{campaignSummary.name} • {campaignSummary.budget} • {campaignSummary.targetAudience}</p>
            <p className="text-xs text-gray-500">{campaignSummary.timeline}</p>
          </div>

          {/* Insights by Category - Show visible ones in order they were added */}
          {visibleInsights.map((categoryId) => {
            const categoryData = competitiveInsights[categoryId as keyof typeof competitiveInsights];
            if (!categoryData) return null;
            return (
            <AnimatePresence key={categoryId}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl border border-gray-200"
              >
                <div className={`p-4 rounded-t-xl border-b border-gray-200 ${categoryData.color}`}>
                  <div className="flex items-center gap-3">
                    {categoryData.icon}
                    <h3 className="text-base font-semibold text-gray-900">{categoryData.title}</h3>
                    {isProcessing && currentWorkflow === categoryId && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {categoryData.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-white rounded border flex items-center justify-center w-8 h-8">
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-xs text-gray-700 mb-2">{insight.content}</p>
                          <div className="flex flex-wrap gap-1">
                            {insight.brands.map((brand, brandIndex) => (
                              <motion.span
                                key={brandIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (index * 0.2) + (brandIndex * 0.1) }}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                              >
                                {brand}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            );
          })}

          {/* Placeholder when no insights are visible yet */}
          {visibleInsights.length === 0 && !isProcessing && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">
                Select a research category to view competitive insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}