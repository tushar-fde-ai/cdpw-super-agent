'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Users,
  Mail,
  Palette,
  Target,
  Settings,
  Play,
  CheckCircle,
  Globe,
  Database,
  Filter,
  MessageCircle,
  Sparkles,
  FileText,
  Upload,
  ExternalLink,
  Eye,
  Edit3,
  Clock,
  BarChart3
} from 'lucide-react';
import { Message } from './messages/types';
import MessageBubble from './messages/MessageBubble';
import MessageInput from './MessageInput';
import EmailSeriesConfig from '../campaign-execution/EmailSeriesConfig';
import SocialMediaConfig from '../campaign-execution/SocialMediaConfig';
import CampaignAnalyticsConfig from '../campaign-execution/CampaignAnalyticsConfig';
import AudienceTargetingDetail from '../campaign-execution/AudienceTargetingDetail';

interface CampaignExecutionInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string, attachment?: File) => void;
  onActionClick: (actionLabel: string) => void;
}

export default function CampaignExecutionInterface({
  messages,
  isLoading,
  onSendMessage,
  onActionClick
}: CampaignExecutionInterfaceProps) {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<'initialization' | 'agent-selection' | 'workflow-building' | 'review' | 'activation' | 'audience-targeting'>('initialization');
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [connectedApplications, setConnectedApplications] = useState<string[]>([]);
  const [journeySteps, setJourneySteps] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDetailView, setSelectedDetailView] = useState<string | null>(null);
  const [preFilledMessage, setPreFilledMessage] = useState('');
  const [isAudienceMode, setIsAudienceMode] = useState(false);

  // Available agents for campaign execution
  const availableAgents = [
    {
      id: 'creation-agent',
      name: 'Creation Agent',
      icon: Palette,
      description: 'Handles creative asset generation and brand compliance',
      color: 'bg-purple-500'
    },
    {
      id: 'journey-agent',
      name: 'Journey Agent',
      icon: Target,
      description: 'Designs customer journey flows and automation sequences',
      color: 'bg-blue-500'
    },
    {
      id: 'engagement-agent',
      name: 'Engagement Agent',
      icon: Users,
      description: 'Manages audience targeting and engagement strategies',
      color: 'bg-green-500'
    },
    {
      id: 'analytics-agent',
      name: 'Analytics Agent',
      icon: Database,
      description: 'Sets up tracking, measurement, and optimization',
      color: 'bg-orange-500'
    },
    {
      id: 'segment-analytics-agent',
      name: 'Audience & Segment Analytics Agent',
      icon: Users,
      description: 'Analyzes audience segments and creates personalized targeting strategies',
      color: 'bg-teal-500'
    }
  ];

  // Available applications
  const availableApplications = [
    {
      id: 'engage-suite',
      name: 'Engage Suite',
      icon: Mail,
      description: 'Email marketing and automation platform',
      status: 'ready'
    },
    {
      id: 'creative-suite',
      name: 'Creative Suite',
      icon: Palette,
      description: 'Brand-safe creative asset generation',
      status: 'ready'
    },
    {
      id: 'journey-builder',
      name: 'Journey Builder',
      icon: Target,
      description: 'Customer journey design and orchestration',
      status: 'ready'
    }
  ];

  // Campaign brief summary (from the approved brief)
  const campaignBrief = {
    name: 'Halloween 2025 Campaign',
    budget: '$75K',
    timeline: 'October 17 - November 3, 2025',
    channels: ['Email Marketing', 'Social Media', 'Display Ads'],
    audience: 'Millennials (25-40), Gen Z (18-27)',
    objectives: [
      'Drive 30% increase in seasonal sales',
      'Boost brand awareness among millennials',
      'Generate 25% more email signups'
    ]
  };

  // Simulate agent activation and workflow building
  const startCampaignCreation = () => {
    setIsProcessing(true);
    setCurrentPhase('agent-selection');

    // Simulate agent selection process
    setTimeout(() => {
      setActiveAgents(['creation-agent', 'journey-agent', 'engagement-agent']);
      setCurrentPhase('workflow-building');

      // Simulate application connection
      setTimeout(() => {
        setConnectedApplications(['engage-suite', 'creative-suite', 'journey-builder']);

        // Simulate journey creation
        setTimeout(() => {
          setJourneySteps([
            {
              id: 'email-sequence',
              type: 'email',
              title: 'Halloween Email Series',
              application: 'engage-suite',
              status: 'configured'
            },
            {
              id: 'social-campaign',
              type: 'social',
              title: 'Social Media Activation',
              application: 'creative-suite',
              status: 'configured'
            },
            {
              id: 'analytics-setup',
              type: 'tracking',
              title: 'Campaign Analytics',
              application: 'journey-builder',
              status: 'configured'
            }
          ]);

          setCurrentPhase('review');
          setIsProcessing(false);
        }, 3000);
      }, 2000);
    }, 2000);
  };

  // Simulate audience targeting workflow - adds to existing campaign
  const startAudienceTargeting = () => {
    setIsProcessing(true);
    setIsAudienceMode(true);
    setCurrentPhase('agent-selection');

    // Activate Audience & Segment Analytics Agent (add to existing agents)
    setTimeout(() => {
      setActiveAgents(prev => [...new Set([...prev, 'segment-analytics-agent'])]);
      setCurrentPhase('audience-targeting');

      // Simulate audience analysis - add to existing journey steps
      setTimeout(() => {
        setJourneySteps(prev => [
          ...prev,
          {
            id: 'audience-targeting',
            type: 'audience',
            title: 'High Churn User Segment - US',
            application: 'segment-analytics',
            status: 'configured'
          }
        ]);

        setIsProcessing(false);
        // Automatically open the audience detail view
        setSelectedDetailView('audience-targeting');
      }, 2500);
    }, 1500);
  };

  // Handle detail view navigation
  const handleDetailView = (stepId: string) => {
    setSelectedDetailView(stepId);
  };

  const handleBackToMain = () => {
    setSelectedDetailView(null);
  };

  const handleSaveDetailConfig = (config: any) => {
    // Here you would save the configuration to your backend
    console.log('Saving configuration:', config);
    setSelectedDetailView(null);
  };

  const handleActivateCampaign = () => {
    // Open journey builder page in a new tab
    window.open('/journey-builder', '_blank');
  };

  // Pre-fill message when component loads
  useEffect(() => {
    if (currentPhase === 'initialization') {
      // Check URL params to see if we should start in audience mode
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');

      if (mode === 'audience') {
        setIsAudienceMode(true);
        setPreFilledMessage('create a hyper-personalized campaign targeting high churn users in the United States');
      } else {
        setPreFilledMessage('build me a campaign from this campaign brief');
      }
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Check if we should trigger campaign creation or audience targeting from messages
  useEffect(() => {
    console.log('📊 Debug - Messages:', messages.length, 'Phase:', currentPhase, 'AudienceMode:', isAudienceMode);

    if (messages.length === 0) return;

    // Check for assistant message from Audience & Segment Analytics Agent
    const hasAudienceAgentMessage = messages.some(msg =>
      msg.sender === 'assistant' &&
      msg.metadata?.agentName === 'Audience & Segment Analytics Agent'
    );

    // Check for user messages about audience targeting
    const hasUserAudienceRequest = messages.some(msg => {
      if (msg.sender !== 'user') return false;
      const content = msg.content?.toLowerCase() || '';
      return (content.includes('hyper-personali') && content.includes('high churn')) ||
             (content.includes('target') && content.includes('high churn')) ||
             (content.includes('create') && content.includes('audience') && content.includes('high churn')) ||
             (content.includes('segment') && content.includes('high churn'));
    });

    // Check for campaign creation request
    const hasCampaignRequest = messages.some(msg =>
      msg.sender === 'user' &&
      (msg.content?.toLowerCase().includes('build me a campaign') ||
       msg.content?.toLowerCase().includes('create campaign'))
    );

    console.log('🔍 Checks - AudienceAgent:', hasAudienceAgentMessage, 'UserAudience:', hasUserAudienceRequest, 'Campaign:', hasCampaignRequest);

    // Allow triggering even if not in initialization phase if we haven't started audience mode yet
    if ((hasAudienceAgentMessage || hasUserAudienceRequest) && !isAudienceMode && !isProcessing) {
      console.log('🎯 Triggering audience targeting flow');
      startAudienceTargeting();
    } else if (hasCampaignRequest && currentPhase === 'initialization' && !isAudienceMode && !isProcessing) {
      console.log('🚀 Triggering campaign creation flow');
      startCampaignCreation();
    }
  }, [messages, currentPhase, isAudienceMode, isProcessing]);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Side - Interactive Chat */}
      <div className="w-[35%] flex flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-700 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Campaign Execution</h2>
                <p className="text-sm text-gray-500">AI-powered campaign orchestration</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-gray-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="font-medium">Active</span>
            </div>
          </div>

          {/* Active Agents Display */}
          {activeAgents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeAgents.map((agentId, index) => {
                const agent = availableAgents.find(a => a.id === agentId);
                if (!agent) return null;

                // Enterprise color mapping
                const enterpriseColors: Record<string, string> = {
                  'creation-agent': 'bg-slate-700',
                  'journey-agent': 'bg-slate-600',
                  'engagement-agent': 'bg-slate-700',
                  'analytics-agent': 'bg-slate-600',
                  'segment-analytics-agent': 'bg-slate-700'
                };

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium text-white ${enterpriseColors[agent.id] || 'bg-slate-700'}`}
                  >
                    <agent.icon size={14} className="opacity-90" />
                    <span>{agent.name}</span>
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

          {/* Agent Selection Phase */}
          {currentPhase === 'agent-selection' && (
            <div className="flex justify-start">
              <div className="bg-slate-50 rounded-lg p-4 max-w-md border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Agent Selection</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Analyzing campaign brief and selecting optimal agents...
                </p>
                <div className="space-y-2">
                  {availableAgents.slice(0, 3).map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5, duration: 0.5 }}
                      className="flex items-center gap-3 p-2.5 rounded-md bg-white border border-slate-100"
                    >
                      <div className="p-1.5 rounded-md bg-slate-700 text-white">
                        <agent.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.description}</p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.5 + 0.8 }}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Workflow Building Phase */}
          {currentPhase === 'workflow-building' && (
            <div className="flex justify-start">
              <div className="bg-slate-50 rounded-lg p-4 max-w-md border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Building Campaign Workflow</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Creating journey and connecting applications...
                </p>
                <div className="space-y-2">
                  {connectedApplications.map((appId, index) => {
                    const app = availableApplications.find(a => a.id === appId);
                    if (!app) return null;

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3, duration: 0.5 }}
                        className="flex items-center gap-3 p-2.5 rounded-md bg-white border border-slate-100"
                      >
                        <app.icon size={16} className="text-slate-700" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{app.name}</p>
                          <p className="text-xs text-gray-500">Connected</p>
                        </div>
                        <span className="text-xs text-emerald-600 font-semibold">Ready</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Audience Targeting Phase */}
          {currentPhase === 'audience-targeting' && (
            <div className="flex justify-start">
              <div className="bg-slate-50 rounded-lg p-4 max-w-md border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Audience Analysis Complete</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  I've identified your high churn risk segment in the United States (42,847 users) and created 4 hyper-personalized sub-segments with tailored engagement strategies. Check the panel on the right for detailed insights!
                </p>
                <div className="bg-white rounded-md p-3 border border-slate-200">
                  <div className="text-xs font-semibold text-gray-900 mb-2">Key Insights</div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <span>73% churn probability detected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <span>$620K revenue recovery potential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <span>29.5% avg. reactivation rate expected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Ready Phase */}
          {currentPhase === 'review' && !isAudienceMode && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 max-w-md border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Campaign Ready</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your Halloween campaign has been configured. What would you like to do next?
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/journey-builder', '_blank')}
                    className="w-full px-4 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Target size={16} />
                    Customize in Journey Builder
                  </button>
                  <button
                    onClick={() => {
                      // Trigger audience targeting flow
                      const message = 'create a hyper-personalized campaign targeting high churn users in the United States';
                      onSendMessage(message);
                    }}
                    className="w-full px-4 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Users size={16} />
                    Hyper-Personalize Campaign
                  </button>
                  <button
                    onClick={handleActivateCampaign}
                    className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    Activate Campaign Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Ready with Audience Targeting */}
          {currentPhase === 'audience-targeting' && journeySteps.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 max-w-md border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Hyper-Personalized Campaign Ready</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Your campaign is now hyper-personalized for 4 sub-segments with tailored strategies!
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/journey-builder', '_blank')}
                    className="w-full px-4 py-2.5 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Target size={16} />
                    Finalize in Journey Builder
                  </button>
                  <button
                    onClick={handleActivateCampaign}
                    className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    Activate Campaign Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading && !isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <MessageInput
            onSendMessage={onSendMessage}
            placeholder="Upload campaign brief or ask questions..."
            disabled={isLoading}
            initialValue={preFilledMessage}
            allowAttachments={true}
          />
        </div>
      </div>

      {/* Right Side - Campaign Journey & Applications */}
      <div className="w-[65%] bg-gray-50 overflow-y-auto">
        {/* Conditional Content Based on Selected Detail View */}
        {selectedDetailView === 'email-sequence' ? (
          <EmailSeriesConfig
            onBack={handleBackToMain}
            onSave={handleSaveDetailConfig}
          />
        ) : selectedDetailView === 'social-campaign' ? (
          <SocialMediaConfig
            onBack={handleBackToMain}
            onSave={handleSaveDetailConfig}
          />
        ) : selectedDetailView === 'analytics-setup' ? (
          <CampaignAnalyticsConfig
            onBack={handleBackToMain}
            onSave={handleSaveDetailConfig}
          />
        ) : selectedDetailView === 'audience-targeting' ? (
          <AudienceTargetingDetail
            onBack={handleBackToMain}
            onSave={handleSaveDetailConfig}
          />
        ) : (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-700">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isAudienceMode && journeySteps.some(s => s.type !== 'audience')
                      ? 'Campaign Builder with Audience Targeting'
                      : isAudienceMode
                      ? 'Audience Targeting & Hyper-Personalization'
                      : 'Campaign Journey Builder'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isAudienceMode && journeySteps.some(s => s.type !== 'audience')
                      ? 'Complete campaign orchestration with hyper-personalized targeting'
                      : isAudienceMode
                      ? 'AI-powered segment analysis and personalization'
                      : 'Real-time campaign orchestration'}
                  </p>
                </div>
              </div>
            </div>

        {/* Campaign Overview */}
        <div className="p-6 space-y-6">
          {/* Campaign Brief Context - Show if we have campaign steps */}
          {journeySteps.some(step => step.type !== 'audience') && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-slate-700 rounded">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Source Campaign Brief</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">{campaignBrief.name} • {campaignBrief.budget} • {campaignBrief.timeline}</p>
              <div className="flex flex-wrap gap-1">
                {campaignBrief.channels.map((channel, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Audience Segment Context - Show when audience targeting is added */}
          {isAudienceMode && journeySteps.some(step => step.type === 'audience') && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-slate-700 rounded">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Targeted Audience Segment</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">High Churn Risk Users • United States • 42,847 users</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                  73% Churn Risk
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                  $1,247 Avg. LTV
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                  4 Sub-Segments
                </span>
              </div>
            </div>
          )}

          {/* Journey Steps */}
          {journeySteps.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Campaign Journey</h3>
                <p className="text-sm text-gray-500">Automated workflow steps</p>
              </div>
              <div className="p-4 space-y-3">
                {journeySteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-xs text-gray-500">Connected to {step.application}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-600 font-semibold">Configured</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <button
                      onClick={() => handleDetailView(step.id)}
                      className="p-1.5 text-gray-400 hover:text-slate-700 transition-colors rounded hover:bg-slate-100"
                      title="Configure details"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Applications */}
          {connectedApplications.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Connected Applications</h3>
                <p className="text-sm text-gray-600">Integrated marketing tools</p>
              </div>
              <div className="p-4 grid grid-cols-1 gap-3">
                {connectedApplications.map((appId, index) => {
                  const app = availableApplications.find(a => a.id === appId);
                  if (!app) return null;

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="p-2 bg-gray-100 rounded">
                        <app.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{app.name}</h4>
                        <p className="text-xs text-gray-600">{app.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-xs text-gray-600">Connected</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Placeholder when nothing is built yet */}
          {currentPhase === 'initialization' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                {isAudienceMode ? (
                  <Users className="w-8 h-8 mx-auto" />
                ) : (
                  <Upload className="w-8 h-8 mx-auto" />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isAudienceMode
                  ? 'Describe your target audience segment to begin hyper-personalization analysis'
                  : 'Upload your campaign brief or reference it to begin campaign creation'
                }
              </p>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}