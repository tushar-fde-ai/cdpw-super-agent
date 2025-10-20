'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Ghost, Calendar } from 'lucide-react';
import { Message } from './messages/types';
import UserMessage from './messages/UserMessage';
import AssistantMessage from './messages/AssistantMessage';
import ThinkingIndicator from './messages/ThinkingIndicator';
import QuestionPrompt from './messages/QuestionPrompt';
import MetricsTiles from './messages/MetricsTiles';

interface ConversationAreaProps {
  messages?: Message[];
  isLoading?: boolean;
  onStarterPromptClick?: (prompt: string) => void;
  onQuestionSubmit?: (answers: string[]) => void;
  onActionClick?: (actionLabel: string) => void;
  onScroll?: () => void;
}

const STARTER_PROMPTS = [
  {
    id: '1',
    text: 'I have a Halloween themed campaign that should deploy two weeks before Halloween',
    icon: Ghost,
    color: 'from-orange-500 to-purple-600'
  }
];

export default function ConversationArea({
  messages = [],
  isLoading = false,
  onStarterPromptClick,
  onQuestionSubmit,
  onActionClick,
  onScroll
}: ConversationAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStarterClick = (promptText: string) => {
    onStarterPromptClick?.(promptText);
  };

  const handleQuestionSubmit = (answers: string[]) => {
    console.log('Question answers submitted:', answers);
    onQuestionSubmit?.(answers);
  };

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case 'user-text':
        return (
          <UserMessage
            key={message.id}
            message={message}
          />
        );

      case 'assistant-text':
      case 'document-preview':
      case 'action-buttons':
        return (
          <AssistantMessage
            key={message.id}
            message={message}
            onActionClick={onActionClick}
          />
        );

      case 'thinking':
        return (
          <ThinkingIndicator
            key={message.id}
            agentName={message.metadata?.agentName}
            timestamp={message.timestamp}
          />
        );

      case 'question':
        return (
          <QuestionPrompt
            key={message.id}
            questions={message.metadata?.questions || []}
            onSubmit={handleQuestionSubmit}
            timestamp={message.timestamp}
            questionOptions={message.metadata?.questionOptions}
          />
        );

      case 'metrics-tiles':
        return (
          <MetricsTiles
            key={message.id}
            metrics={message.metadata?.metrics || []}
            timestamp={message.timestamp}
          />
        );

      default:
        return null;
    }
  };

  // Empty state when no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Hey Kate! Let&apos;s launch something amazing 🚀
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
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
                className="w-full p-4 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                onClick={() => handleStarterClick('I have a Halloween themed campaign that should deploy two weeks before Halloween')}
              />
              <button
                className="absolute right-3 top-3 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                onClick={() => handleStarterClick('I have a Halloween themed campaign that should deploy two weeks before Halloween')}
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Quick Start by Task
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 1, label: 'Design a Campaign Program', icon: '🎯' },
                { id: 2, label: 'Pick My Channel Mix', icon: '📊' },
                { id: 3, label: 'Create a Creative Brief', icon: '✨' },
                { id: 4, label: 'Brainstorm creative ideas', icon: '💡' }
              ].map((task) => (
                <button
                  key={task.id}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left"
                  onClick={() => handleStarterClick('I have a Halloween themed campaign that should deploy two weeks before Halloween')}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{task.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.label}</span>
                  </div>
                </button>
              ))}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                🤖 Available Specialist Agents
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
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${agent.color}`}>
                      {agent.icon}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Apps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                🔗 Connected Apps
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
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${app.color}`}>
                      {app.icon}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Messages view
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-h-0">
      {/* Messages container with wider max width */}
      <div
        className="flex-1 overflow-y-auto p-6 pb-8"
        onScroll={onScroll}
      >
        <div className="max-w-6xl mx-auto w-full min-h-full">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {messages.map((message) => renderMessage(message))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mr-4 max-w-[70%]">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-4" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}