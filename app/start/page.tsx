'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DocumentViewerModal } from '../../components/chat/document-viewer';
import { sampleCampaignBrief } from '../../components/chat/document-viewer/sampleData';
import { Rocket, Target, BarChart3, Sparkles, Lightbulb, Bot, Link, Clock, CheckCircle, AlertCircle, Users, FileText, Calendar, MessageCircle } from 'lucide-react';

export default function StartPage() {
  const router = useRouter();
  const [hasRunningActivities, setHasRunningActivities] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  // Don't automatically restore campaign state from localStorage
  // The running activities should only show after starting a campaign in this session

  // Mock data for running activities - in a real app this would come from state management or API
  const runningActivities = [
    {
      id: 1,
      name: 'Halloween 2025 Campaign',
      status: 'pending_approval',
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

  const handleDocumentViewerClose = () => {
    setIsDocumentViewerOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
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
            <Rocket className="w-8 h-8 text-blue-600" />
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
              placeholder="Describe your campaign goals, budget, target audience, and timeline..."
              className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none bg-white text-black placeholder-gray-500"
              rows={3}
            />
            <button
              className="absolute right-3 top-3 p-2 text-gray-400 hover:text-blue-600 transition-colors"
              onClick={() => router.push('/chat')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Quick Start Tasks */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
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
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                  onClick={() => handleTaskClick(task.action)}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-black">{task.label}</span>
                  </div>
                </button>
              );
            })}
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
              <Bot className="w-5 h-5 text-blue-600" />
              Available Specialist Agents
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Campaign Architect Agent', color: 'bg-blue-100 text-blue-700', icon: 'A' },
                { name: 'Persona Research Agent', color: 'bg-green-100 text-green-700', icon: 'P' },
                { name: 'Channel Strategy Agent', color: 'bg-orange-100 text-orange-700', icon: 'C' },
                { name: 'Competitive Intelligence Agent', color: 'bg-purple-100 text-purple-700', icon: 'CI' },
                { name: 'Creative Brief Agent', color: 'bg-red-100 text-red-700', icon: 'CB' },
                { name: 'Ad Copy Agent', color: 'bg-indigo-100 text-indigo-700', icon: 'AC' },
                { name: 'Creative Ideation Agent', color: 'bg-pink-100 text-pink-700', icon: 'CI' },
                { name: 'Social Creative Agent', color: 'bg-purple-100 text-purple-700', icon: 'SC' },
                { name: 'Display Creative Agent', color: 'bg-orange-100 text-orange-700', icon: 'DC' },
                { name: 'Knowledge Base Onboarding Agent', color: 'bg-teal-100 text-teal-700', icon: 'KB' }
              ].map((agent, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${agent.color}`}>
                    {agent.icon}
                  </div>
                  <span className="text-sm text-black">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Apps */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-600" />
              Connected Apps
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Salesforce', color: 'bg-blue-100 text-blue-700', icon: 'SF' },
                { name: 'HubSpot', color: 'bg-orange-100 text-orange-700', icon: 'HS' },
                { name: 'Mailchimp', color: 'bg-yellow-100 text-yellow-700', icon: 'MC' },
                { name: 'Google Analytics', color: 'bg-red-100 text-red-700', icon: 'GA' },
                { name: 'Facebook Ads', color: 'bg-blue-100 text-blue-700', icon: 'FB' },
                { name: 'Google Ads', color: 'bg-green-100 text-green-700', icon: 'GA' },
                { name: 'Shopify', color: 'bg-green-100 text-green-700', icon: 'SH' },
                { name: 'Slack', color: 'bg-purple-100 text-purple-700', icon: 'SL' },
                { name: 'Zapier', color: 'bg-orange-100 text-orange-700', icon: 'ZA' },
                { name: 'Canva', color: 'bg-pink-100 text-pink-700', icon: 'CA' }
              ].map((app, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${app.color}`}>
                    {app.icon}
                  </div>
                  <span className="text-sm text-black">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Running Activities */}
        {hasRunningActivities && runningActivities.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Running Activities
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
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-800">
                              <span className="font-medium">Target:</span> {activity.targetAudience}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-600" />
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
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleViewChatHistory(activity.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        View Chat History
                      </button>
                      <button
                        onClick={() => handleViewCampaignBrief(activity.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Campaign Brief
                      </button>
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