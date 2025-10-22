'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DocumentViewerModal } from '../../components/chat/document-viewer';
import { sampleCampaignBrief } from '../../components/chat/document-viewer/sampleData';
import { Rocket, Target, BarChart3, Sparkles, Lightbulb, Bot, Link, Clock, CheckCircle, AlertCircle, Users, FileText, Calendar, MessageCircle, Search, Zap, Palette, User, Layout, Database, PenTool, Type, BrainCircuit, Share2, Monitor } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();
  const [hasRunningActivities, setHasRunningActivities] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [campaignInput, setCampaignInput] = useState('');
  const [campaignStatus, setCampaignStatus] = useState<'pending_approval' | 'approved' | 'rejected'>('pending_approval');

  // Check localStorage on component mount to restore campaign state if user has created campaigns
  useEffect(() => {
    const savedCampaignState = localStorage.getItem('msa_has_campaigns');
    if (savedCampaignState === 'true') {
      setHasRunningActivities(true);
    }

    // Check for approval status
    const approvalStatus = localStorage.getItem('campaign-approval-status');
    if (approvalStatus) {
      try {
        const statusData = JSON.parse(approvalStatus);
        if (statusData.status === 'approved') {
          setCampaignStatus('approved');
        } else if (statusData.status === 'rejected') {
          setCampaignStatus('rejected');
        }
      } catch (error) {
        console.error('Error parsing approval status:', error);
      }
    }
  }, []);

  // Poll for approval status changes every 2 seconds when on this page
  useEffect(() => {
    const interval = setInterval(() => {
      const approvalStatus = localStorage.getItem('campaign-approval-status');
      if (approvalStatus) {
        try {
          const statusData = JSON.parse(approvalStatus);
          if (statusData.status === 'approved' && campaignStatus !== 'approved') {
            setCampaignStatus('approved');
          } else if (statusData.status === 'rejected' && campaignStatus !== 'rejected') {
            setCampaignStatus('rejected');
          }
        } catch (error) {
          console.error('Error parsing approval status:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [campaignStatus]);

  // Mock data for running activities - in a real app this would come from state management or API
  const runningActivities = [
    {
      id: 1,
      name: 'Halloween 2025 Campaign',
      status: campaignStatus,
      agents: ['Campaign Strategy Agent', 'Audience & Persona Agent', 'Data Analytics Agent'],
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      budget: '$50K - $100K',
      targetAudience: '847K people',
      description: 'Complete campaign strategy with data-driven audience targeting'
    }
  ];

  const handleStarterClick = (promptText: string) => {
    // Navigate to chat with the selected prompt
    router.push(`/chat?prompt=${encodeURIComponent(promptText)}`);
  };

  const handleTaskClick = (action: string) => {
    if (action === 'halloween-campaign') {
      setHasRunningActivities(true); // Show running activities after starting campaign
      localStorage.setItem('msa_has_campaigns', 'true'); // Persist campaign state
      handleStarterClick('I have a Halloween themed campaign that should deploy two weeks before Halloween');
    } else {
      // For now, just go to chat page for other actions
      router.push('/chat');
    }
  };

  const handleViewChatHistory = (campaignId: number) => {
    // Navigate to chat with campaign context and trigger showing the complete conversation
    router.push('/chat?campaign=halloween-brief&view=complete');
  };

  const handleViewCampaignBrief = (campaignId: number) => {
    // Open the document viewer modal directly
    setIsDocumentViewerOpen(true);
  };

  const handleCompetitiveIntelligence = (campaignId: number) => {
    // Navigate to split chat interface for competitive research
    router.push('/chat?mode=competitive&campaign=halloween-brief');
  };

  const handleCampaignExecution = (campaignId: number) => {
    // Navigate to campaign execution interface
    router.push('/chat?mode=execution&campaign=halloween-brief');
  };

  const handleDocumentViewerClose = () => {
    setIsDocumentViewerOpen(false);
  };

  const handleCampaignInputSubmit = () => {
    if (campaignInput.trim()) {
      // Navigate to chat page with Halloween campaign prompt
      router.push('/chat?prompt=Would you like to setup a Halloween campaign?');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCampaignInputSubmit();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-slate-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-white p-8 pt-16">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          className="text-center mb-12 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            Hey Kate! Let&apos;s launch something amazing
            <Rocket className="w-8 h-8 text-slate-700" />
          </h1>
          <p className="text-gray-600">
            Time to orchestrate campaigns that deliver results and drive engagement.
          </p>
        </motion.div>

        {/* Campaign Description Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <textarea
              value={campaignInput}
              onChange={(e) => setCampaignInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your campaign goals, budget, target audience, and timeline..."
              className="w-full p-4 pr-12 border-2 rounded-xl focus:outline-none focus:ring-0 resize-none bg-white text-black placeholder-gray-500 animate-gradient-border"
              rows={3}
            />
            <button
              className="absolute right-3 top-3 p-2 text-gray-400 hover:text-black transition-colors"
              onClick={handleCampaignInputSubmit}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <style jsx>{`
            @keyframes gradient-border {
              0% {
                border-color: #475569;
              }
              33% {
                border-color: #64748b;
              }
              66% {
                border-color: #94a3b8;
              }
              100% {
                border-color: #475569;
              }
            }
            .animate-gradient-border {
              animation: gradient-border 4s ease-in-out infinite;
            }
          `}</style>
        </motion.div>

        {/* Quick Start Tasks */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-4 text-center">
              Quick Start by Task
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 1, label: 'Design a Campaign Program', icon: 'Target', action: 'halloween-campaign' },
                { id: 2, label: 'Pick My Channel Mix', icon: 'BarChart3', action: 'default' },
                { id: 3, label: 'Create a Creative Brief', icon: 'Sparkles', action: 'default' },
                { id: 4, label: 'Brainstorm creative ideas', icon: 'Lightbulb', action: 'default' }
              ].map((task) => {
                const iconMap = {
                  Target: Target,
                  BarChart3: BarChart3,
                  Sparkles: Sparkles,
                  Lightbulb: Lightbulb
                };
                const IconComponent = iconMap[task.icon as keyof typeof iconMap];

                return (
                  <button
                    key={task.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-slate-400 hover:shadow-md transition-all duration-200 text-left"
                    onClick={() => handleTaskClick(task.action)}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-slate-700" />
                      <span className="text-sm font-medium text-black">{task.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Available Agents and Apps */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Available Specialist Agents */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-slate-700" />
              Available Specialist Agents
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Campaign Architect Agent', icon: Target, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Persona Research Agent', icon: User, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Channel Strategy Agent', icon: BarChart3, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Competitive Intelligence Agent', icon: Search, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Creative Brief Agent', icon: FileText, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Ad Copy Agent', icon: Type, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Creative Ideation Agent', icon: BrainCircuit, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Social Creative Agent', icon: Share2, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Display Creative Agent', icon: Monitor, color: 'text-slate-700', bg: 'bg-slate-50' },
                { name: 'Knowledge Base Onboarding Agent', icon: Database, color: 'text-slate-700', bg: 'bg-slate-50' }
              ].map((agent, index) => {
                const IconComponent = agent.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${agent.bg} border border-gray-200`}>
                      <IconComponent className={`w-3.5 h-3.5 ${agent.color}`} />
                    </div>
                    <span className="text-sm text-black">{agent.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Apps */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-slate-700" />
              App Integrations
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Mailchimp', logo: '/logos/mailchimp.png' },
                { name: 'Google Analytics', logo: '/logos/Logo_Google_Analytics.svg' },
                { name: 'Google Ads', logo: '/logos/Google_Ads_logo.svg' },
                { name: 'HubSpot', logo: '/logos/HubSpot_Logo.svg' },
                { name: 'Slack', logo: '/logos/SLA-Slack-from-Salesforce-logo.png' },
                { name: 'Zapier', logo: '/logos/zapier-logo_black.svg' },
                { name: 'Airtable', logo: '/logos/Airtable-Logo-Color.png' },
                { name: 'Marketo', logo: '/logos/Marketo_Company_Logo.png' },
                { name: 'Amazon Ads', logo: '/logos/amazon-ads.png' }
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className={`relative ${app.name === 'Mailchimp' || app.name === 'Google Ads' ? 'w-32 h-12' : 'w-24 h-8'} flex items-center justify-center ${app.name === 'Amazon Ads' ? 'bg-gray-800 rounded px-2' : ''}`}>
                    <Image
                      src={app.logo}
                      alt={app.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Task Manager */}
        {hasRunningActivities && runningActivities.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-700" />
                Task Manager
              </h3>

              <div className="space-y-4">
                {runningActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-black mb-1">
                          {activity.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>

                        {/* Status and Timestamp */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(activity.status)}
                            <span className="text-sm font-medium text-gray-800">
                              {getStatusText(activity.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Campaign Details */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-black" />
                            <span className="text-sm text-gray-800">
                              <span className="font-medium">Target:</span> {activity.targetAudience}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-black" />
                            <span className="text-sm text-gray-800">
                              <span className="font-medium">Budget:</span> {activity.budget}
                            </span>
                          </div>
                        </div>

                        {/* Agents Used */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-800 mb-2">Agents Used:</p>
                          <div className="flex flex-wrap gap-2">
                            {activity.agents.map((agent, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-black border border-gray-300"
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Available Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-black mb-3">Available Actions</h4>
                      <div className="flex justify-start gap-3 flex-wrap">
                        <button
                          onClick={() => handleViewChatHistory(activity.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 hover:border-slate-400 text-black text-sm font-medium rounded-lg border border-gray-300 transition-all duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          View Chat History
                        </button>
                        <button
                          onClick={() => handleCompetitiveIntelligence(activity.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 hover:border-slate-400 text-black text-sm font-medium rounded-lg border border-gray-300 transition-all duration-200"
                        >
                          <Search className="w-4 h-4" />
                          Competitive Intelligence
                        </button>
                        <button
                          onClick={() => handleCampaignExecution(activity.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 hover:border-slate-400 text-black text-sm font-medium rounded-lg border border-gray-300 transition-all duration-200"
                        >
                          <Zap className="w-4 h-4" />
                          Build Campaign
                        </button>
                        <button
                          onClick={() => handleViewCampaignBrief(activity.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 hover:border-slate-400 text-black text-sm font-medium rounded-lg border border-gray-300 transition-all duration-200"
                        >
                          <FileText className="w-4 h-4" />
                          View Campaign Brief
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocumentViewerOpen}
        onClose={handleDocumentViewerClose}
        document={sampleCampaignBrief}
        onActionClick={() => {}} // No actions needed from the start page modal
      />
    </div>
  );
}