'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Ghost } from 'lucide-react';
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
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          className="text-center max-w-4xl mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.4 }}
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <MessageCircle size={48} className="text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Sparkles size={24} className="text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.h2
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Hello! I&apos;m your Marketing Super Agent
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            How can I help you today? I can coordinate with specialized agents to create campaigns,
            analyze performance, build customer journeys, and execute complex marketing strategies.
          </motion.p>

          {/* Starter prompts */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {STARTER_PROMPTS.map((prompt, index) => {
              const IconComponent = prompt.icon;

              return (
                <motion.button
                  key={prompt.id}
                  onClick={() => handleStarterClick(prompt.text)}
                  className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 text-left group max-w-md w-full"
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${prompt.color} shadow-lg`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {prompt.text}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Hint */}
          <motion.p
            className="text-sm text-gray-500 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Click a suggestion above or type your own message below
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Messages view
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-h-0">
      {/* Messages container with max width for readability */}
      <div
        className="flex-1 overflow-y-auto p-6 pb-8"
        onScroll={onScroll}
      >
        <div className="max-w-4xl mx-auto w-full min-h-full">
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