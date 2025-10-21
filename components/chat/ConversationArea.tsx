'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Sparkles,
  Ghost,
  Calendar,
  Send,
  Paperclip,
  Target,
  Users,
  BarChart3,
  Settings,
  CheckCircle,
  Clock,
  Rocket,
  FileText,
  Brain,
  DollarSign,
  TrendingUp,
  Activity,
  Beaker,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
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
  currentWorkflow?: any;
  completedAgents?: Set<string>;
  activeAgent?: string | null;
  onSendMessage?: (message: string) => void;
  prefilledMessage?: string;
  onPrefilledMessageClear?: () => void;
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
  onScroll,
  currentWorkflow,
  completedAgents,
  activeAgent,
  onSendMessage,
  prefilledMessage,
  onPrefilledMessageClear
}: ConversationAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [showAgentSelection, setShowAgentSelection] = useState(false);
  const [agentSelectionStartTime, setAgentSelectionStartTime] = useState<number | null>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle prefilledMessage changes
  useEffect(() => {
    if (prefilledMessage) {
      setInputMessage(prefilledMessage);
      // Focus the textarea when prefilled message is set
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Adjust textarea height for prefilled content
        adjustTextareaHeight();
      }
    }
  }, [prefilledMessage]);

  // Handle agent selection timing
  useEffect(() => {
    const userMessageExists = messages.length >= 1 && messages[0].type === 'user-text';

    if (userMessageExists && !showAgentSelection && !agentSelectionStartTime) {
      // First user message sent - start agent selection phase
      setShowAgentSelection(true);
      setAgentSelectionStartTime(Date.now());
    } else if (showAgentSelection && agentSelectionStartTime) {
      // Check if we should end the agent selection phase
      const elapsed = Date.now() - agentSelectionStartTime;
      const minDisplayTime = 4000; // Show for at least 4 seconds

      if (elapsed >= minDisplayTime || messages.length > 1) {
        // Either minimum time has passed OR we have assistant responses
        const timer = setTimeout(() => {
          setShowAgentSelection(false);
        }, Math.max(0, minDisplayTime - elapsed));

        return () => clearTimeout(timer);
      }
    }
  }, [messages, showAgentSelection, agentSelectionStartTime]);

  const handleStarterClick = (promptText: string) => {
    onStarterPromptClick?.(promptText);
  };

  const handleQuestionSubmit = (answers: string[]) => {
    console.log('Question answers submitted:', answers);
    onQuestionSubmit?.(answers);
  };

  // Chat input handlers
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 80); // Max 3 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();

    // Clear prefilled message when user starts typing (if they clear the prefilled content)
    if (prefilledMessage && e.target.value !== prefilledMessage && onPrefilledMessageClear) {
      onPrefilledMessageClear();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      // Clear prefilled message if it was used
      if (prefilledMessage && onPrefilledMessageClear) {
        onPrefilledMessageClear();
      }
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  // Empty state when no messages - now redirect to start page (but not if there's a prefilledMessage)
  if (messages.length === 0 && !isLoading && !prefilledMessage) {
    return (
      <div className="flex-1 bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-4">
            No active conversation
          </h2>
          <p className="text-gray-600 mb-6">
            Start a new conversation from the campaign setup page.
          </p>
          <button
            onClick={() => window.location.href = '/start'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Campaign Setup
          </button>
        </div>
      </div>
    );
  }

  // Check if we should show split screen for Halloween campaign or when prefilledMessage exists
  const isHalloweenCampaign = messages.some(msg =>
    msg.content?.includes('Halloween') ||
    msg.metadata?.agentName?.includes('Campaign')
  );
  const hasHalloweenPrefilledMessage = prefilledMessage?.includes('Halloween');
  const showSplitScreen = (messages.length > 0 && isHalloweenCampaign) || hasHalloweenPrefilledMessage;

  // Extract dynamic budget information from user responses
  const getBudgetInfo = () => {
    const budgetMessages = messages.filter(msg =>
      msg.type === 'user-text' &&
      (msg.content?.includes('$') ||
       msg.content?.includes('Under') ||
       msg.content?.includes('10K') ||
       msg.content?.includes('50K') ||
       msg.content?.includes('100K'))
    );

    if (budgetMessages.length > 0) {
      const latestBudget = budgetMessages[budgetMessages.length - 1].content;
      return latestBudget;
    }
    return null;
  };

  // Calculate budget breakdown based on user selection
  const calculateBudgetBreakdown = (budgetRange: string | null) => {
    if (!budgetRange) return null;

    let totalBudget = '';
    let digitalAds = '';
    let contentCreation = '';
    let emailMarketing = '';
    let influencer = '';
    let expectedROAS = '4.2x';

    if (budgetRange.includes('Under $10K')) {
      totalBudget = 'Under $10K';
      digitalAds = '60% ($3K-$6K)';
      contentCreation = '25% ($1.5K-$2.5K)';
      emailMarketing = '10% ($500-$1K)';
      influencer = '5% ($250-$500)';
      expectedROAS = '5.1x';
    } else if (budgetRange.includes('$10K - $50K')) {
      totalBudget = '$10K - $50K';
      digitalAds = '60% ($6K-$30K)';
      contentCreation = '25% ($2.5K-$12.5K)';
      emailMarketing = '10% ($1K-$5K)';
      influencer = '5% ($500-$2.5K)';
      expectedROAS = '4.8x';
    } else if (budgetRange.includes('$50K - $100K')) {
      totalBudget = '$50K - $100K';
      digitalAds = '60% ($30K-$60K)';
      contentCreation = '25% ($12.5K-$25K)';
      emailMarketing = '10% ($5K-$10K)';
      influencer = '5% ($2.5K-$5K)';
      expectedROAS = '4.2x';
    } else if (budgetRange.includes('$100K+')) {
      totalBudget = '$100K+';
      digitalAds = '60% ($60K+)';
      contentCreation = '25% ($25K+)';
      emailMarketing = '10% ($10K+)';
      influencer = '5% ($5K+)';
      expectedROAS = '3.8x';
    }

    return {
      totalBudget,
      digitalAds,
      contentCreation,
      emailMarketing,
      influencer,
      expectedROAS
    };
  };

  // Check if we're in A/B test mode - only after user has actually clicked "Set Up A/B Test"
  const isABTestMode = messages.some(msg =>
    msg.metadata?.questions?.[0]?.includes('A/B test variant') ||
    (msg.content?.includes('A/B test') && msg.sender === 'assistant' &&
     msg.content?.includes('creating') || msg.content?.includes('comparison'))
  );

  // Get A/B test budget if available
  const getABTestBudget = () => {
    const abtestBudgetIndex = messages.findIndex(msg =>
      msg.metadata?.questions?.[0]?.includes('A/B test variant')
    );

    if (abtestBudgetIndex !== -1 && abtestBudgetIndex < messages.length - 1) {
      const userResponse = messages[abtestBudgetIndex + 1];
      if (userResponse.type === 'user-text') {
        return userResponse.content;
      }
    }
    return null;
  };

  // Check if approval workflow has been set up
  const isApprovalWorkflowActive = () => {
    return messages.some(msg =>
      msg.content?.includes('Approval workflow has been sent to') ||
      msg.content?.includes('approval workflow is set up') ||
      (msg.content?.includes('approval workflow') && msg.content?.includes('submitted'))
    );
  };

  const currentBudget = getBudgetInfo();
  const budgetBreakdown = calculateBudgetBreakdown(currentBudget);
  const abtestBudget = getABTestBudget();

  // Messages view
  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      {showSplitScreen ? (
        // Split screen layout for Halloween campaign
        <div className="flex-1 flex min-h-0">
          {/* Left Side - Chat Interface */}
          <div className="w-[35%] flex flex-col border-r border-gray-200 min-h-0">
            {/* Agent Status Bar - Fixed height */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                    <MessageCircle size={16} className="text-blue-600" />
                    Campaign Generation Chat
                  </h3>
                  <p className="text-xs text-black">
                    Agentic Team Collaboration
                  </p>
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
                    { id: 'campaign-strategy', name: 'Campaign Strategy', icon: Target, color: 'bg-blue-100 text-blue-800' },
                    { id: 'audience-persona', name: 'Audience Research', icon: Users, color: 'bg-purple-100 text-purple-800' },
                    { id: 'data-analytics', name: 'Data Analytics', icon: BarChart3, color: 'bg-green-100 text-green-800' }
                  ].map((agent, index) => {
                    const isCompleted = completedAgents?.has(agent.id);
                    const isActive = activeAgent === agent.id;

                    // Show activation sequence during agent selection phase
                    const shouldShowActivation = showAgentSelection && index <= 2; // Show all 3 agents activating
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
                            : isActive
                            ? 'bg-blue-500 text-white shadow-md'
                            : isCompleted
                            ? 'bg-green-100 text-green-800'
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
                        {isCompleted && <span className="text-green-600">✓</span>}
                        {(isActive || shouldShowActivation) && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: shouldShowActivation ? activationDelay + 0.5 : 0
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chat Messages - Scrollable area */}
            <div className="flex-1 overflow-y-auto min-h-0" onScroll={onScroll}>
              <div className="p-4">
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

            {/* Chat Input - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white p-3">
              <motion.div
                className="relative flex items-end space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-purple-500 transition-colors duration-200"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* File attachment button */}
                <motion.button
                  onClick={() => console.log('File attachment clicked')}
                  disabled={isLoading}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Paperclip size={16} />
                </motion.button>

                {/* Message input */}
                <div className="flex-1 py-2">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Continue the conversation..."
                    disabled={isLoading}
                    className="w-full resize-none border-0 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={1}
                    style={{ maxHeight: '80px' }}
                  />
                </div>

                {/* Send button */}
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`
                    flex-shrink-0 p-2 rounded-md transition-all duration-200
                    ${inputMessage.trim() && !isLoading
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }
                  `}
                  whileHover={inputMessage.trim() && !isLoading ? { scale: 1.05 } : {}}
                  whileTap={inputMessage.trim() && !isLoading ? { scale: 0.95 } : {}}
                  aria-label="Send message"
                  title="Send message (Enter)"
                >
                  <Send size={16} />
                </motion.button>
              </motion.div>

              {/* Hint text */}
              {!isLoading && (
                <motion.p
                  className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Press Enter to send, Shift+Enter for new line
                </motion.p>
              )}
            </div>
          </div>

          {/* Right Side - Campaign Brief Document */}
          <div className="w-[65%] bg-white flex flex-col min-h-0">
            {/* Document Header - Fixed height */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h3
                    className="text-lg font-semibold text-black"
                    key={messages.length === 0 ? 'initial' : messages.length === 1 ? 'selecting' : 'brief'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      {messages.length === 0 ? (
                        <>
                          <Rocket size={18} className="text-purple-600" />
                          Campaign Assistant
                        </>
                      ) : showAgentSelection ? (
                        <>
                          <Brain size={18} className="text-blue-600" />
                          Agent Selection
                        </>
                      ) : (
                        <>
                          <FileText size={18} className="text-green-600" />
                          Halloween Campaign Brief
                        </>
                      )}
                    </div>
                  </motion.h3>
                  <motion.p
                    className="text-sm text-black"
                    key={messages.length === 0 ? 'initial-desc' : showAgentSelection ? 'selecting-desc' : 'brief-desc'}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {messages.length === 0
                      ? 'Ready to help you create your campaign'
                      : showAgentSelection
                      ? 'Assembling your specialist agent team'
                      : `Real-time document generation ${budgetBreakdown ? `• Budget: ${budgetBreakdown.totalBudget}` : ''}${isABTestMode ? ' • A/B Testing Active' : ''}`
                    }
                  </motion.p>
                </div>
                {showAgentSelection ? (
                  // Agent selection phase indicators
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.span
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Selecting Agents
                    </motion.span>
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                ) : !showAgentSelection && messages.length > 0 ? (
                  // Campaign brief phase indicators
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Auto-updating
                    </span>
                    {budgetBreakdown && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {budgetBreakdown.totalBudget}
                      </span>
                    )}
                    {isABTestMode && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        A/B Test
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Document Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6">
                {messages.length === 0 ? (
                  // Simple instructions when no messages
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center max-w-md">
                      <div className="mb-6 flex justify-center">
                        <Target size={64} className="text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-black mb-4">
                        Ready to Create Your Campaign
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        Enter your campaign idea in the chat and let your agentic marketing team do the rest.
                        They'll help you with strategy, targeting, budgeting, and execution.
                      </p>
                    </div>
                  </motion.div>
                ) : showAgentSelection ? (
                  // Agent selection phase - right after user sends first message
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center max-w-lg">
                      <motion.div
                        className="mb-6 flex justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings size={64} className="text-blue-600" />
                      </motion.div>
                      <h2 className="text-2xl font-semibold text-black mb-4">
                        Picking the Right Agents for the Task
                      </h2>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Our AI is analyzing your campaign requirements and assembling the perfect team of specialist agents to handle your project.
                      </p>

                      {/* Agent Selection Animation */}
                      <div className="space-y-4">
                        {[
                          { name: 'Campaign Strategy Agent', icon: Target, color: 'bg-blue-100 text-blue-800' },
                          { name: 'Audience Research Agent', icon: Users, color: 'bg-purple-100 text-purple-800' },
                          { name: 'Data Analytics Agent', icon: BarChart3, color: 'bg-green-100 text-green-800' }
                        ].map((agent, index) => (
                          <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3 + 0.5, duration: 0.5 }}
                            className={`flex items-center space-x-3 p-3 rounded-lg ${agent.color} max-w-xs mx-auto`}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                            >
                              <agent.icon size={24} />
                            </motion.div>
                            <div className="text-left">
                              <p className="font-medium text-sm">{agent.name}</p>
                              <motion.p
                                className="text-xs opacity-70"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: index * 0.3 + 1 }}
                              >
                                {index === 0 ? 'Analyzing campaign objectives...' :
                                 index === 1 ? 'Researching target demographics...' :
                                 'Processing performance data...'}
                              </motion.p>
                            </div>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.3 + 1.5 }}
                              className="text-green-600"
                            >
                              <CheckCircle size={16} />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Complex document content when messages exist
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                <div className="space-y-6">
                  {/* Campaign Overview */}
                  <div>
                    <h4 className="text-md font-semibold text-black mb-3 flex items-center gap-2">
                      <Target size={16} className="text-orange-600" />
                      Campaign Overview
                    </h4>
                    <div className="space-y-2 text-sm text-black">
                      <p><strong>Campaign Type:</strong> Halloween Seasonal Promotion</p>
                      <p><strong>Launch Timeline:</strong> 2 weeks before Halloween</p>
                      <p><strong>Duration:</strong> October 17-31, 2024</p>
                      <p><strong>Primary Goal:</strong> Drive seasonal sales and engagement</p>
                    </div>
                  </div>

                  {/* Real-time Campaign Status */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-md font-semibold text-black mb-3 flex items-center gap-2">
                      <Rocket size={16} className="text-blue-600" />
                      Campaign Status
                      <motion.div
                        className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="flex items-center gap-2">
                          <strong>Budget Status:</strong>
                          {budgetBreakdown ? (
                            <span className="text-green-800 font-medium flex items-center gap-1">
                              <CheckCircle size={12} />
                              Configured ({budgetBreakdown.totalBudget})
                            </span>
                          ) : (
                            <span className="text-orange-800 font-medium flex items-center gap-1">
                              <Clock size={12} />
                              Awaiting input
                            </span>
                          )}
                        </p>
                        <p className="flex items-center gap-2">
                          <strong>Target Audience:</strong>
                          {completedAgents?.has('audience-persona') ? (
                            <span className="text-green-800 font-medium flex items-center gap-1">
                              <CheckCircle size={12} />
                              Analyzed (410K reach)
                            </span>
                          ) : activeAgent === 'audience-persona' ? (
                            <span className="text-blue-800 font-medium flex items-center gap-1">
                              <Activity size={12} />
                              Analyzing...
                            </span>
                          ) : (
                            <span className="text-gray-800 font-medium flex items-center gap-1">
                              <Clock size={12} />
                              Pending
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2">
                          <strong>A/B Testing:</strong>
                          {isABTestMode ? (
                            <span className="text-blue-800 font-medium flex items-center gap-1">
                              <Beaker size={12} />
                              Active
                            </span>
                          ) : messages.some(msg =>
                            msg.type === 'action-buttons' &&
                            msg.metadata?.actions?.some(action => action.label === 'Set Up A/B Test')
                          ) ? (
                            <span className="text-orange-800 font-medium flex items-center gap-1">
                              <Settings size={12} />
                              Available
                            </span>
                          ) : (
                            <span className="text-gray-800 font-medium">Not configured</span>
                          )}
                        </p>
                        <p className="flex items-center gap-2">
                          <strong>Campaign Ready:</strong>
                          {completedAgents?.has('data-analytics') ? (
                            <span className="text-green-800 font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Ready to launch
                            </span>
                          ) : (
                            <span className="text-orange-800 font-medium flex items-center gap-1">
                              <Settings size={12} />
                              In development
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Target Audience */}
                  {(completedAgents?.has('audience-persona') || activeAgent === 'audience-persona') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-md font-semibold text-black mb-3 flex items-center gap-2">
                        <Users size={16} className="text-purple-600" />
                        Target Audience
                        {activeAgent === 'audience-persona' && (
                          <motion.span
                            className="ml-2 text-xs text-blue-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            Analyzing...
                          </motion.span>
                        )}
                      </h4>
                      <div className="space-y-3 text-sm text-black">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p><strong>Primary Segment:</strong> Millennials (25-35)</p>
                          <p>• 267K customers, 65% female</p>
                          <p>• Urban professionals, $50K-$85K income</p>
                          <p>• High social media usage (Instagram/TikTok)</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p><strong>Secondary Segment:</strong> Gen Z (18-25)</p>
                          <p>• 143K customers, 58% female</p>
                          <p>• College students and early career</p>
                          <p>• Mobile-first, trend-influenced shoppers</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Budget Allocation */}
                  {(messages.some(msg => msg.metadata?.questions?.[0]?.includes('budget')) || budgetBreakdown) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-md font-semibold text-black mb-3 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        Budget Allocation
                        {!budgetBreakdown && (
                          <motion.span
                            className="ml-2 text-xs text-blue-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            Awaiting budget input...
                          </motion.span>
                        )}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {budgetBreakdown ? (
                          <div className="grid grid-cols-2 gap-4 text-sm text-black">
                            <div>
                              <p className="text-black"><strong>Total Budget:</strong> {budgetBreakdown.totalBudget}</p>
                              <p className="text-black"><strong>Digital Ads:</strong> {budgetBreakdown.digitalAds}</p>
                              <p className="text-black"><strong>Content Creation:</strong> {budgetBreakdown.contentCreation}</p>
                            </div>
                            <div>
                              <p className="text-black"><strong>Email Marketing:</strong> {budgetBreakdown.emailMarketing}</p>
                              <p className="text-black"><strong>Influencer Partnerships:</strong> {budgetBreakdown.influencer}</p>
                              <p className="text-black"><strong>Expected ROAS:</strong> {budgetBreakdown.expectedROAS}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-800 italic">
                            Budget allocation will be calculated based on your budget selection above.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Campaign Strategy */}
                  {(completedAgents?.has('data-analytics') || activeAgent === 'data-analytics') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-md font-semibold text-black mb-3 flex items-center gap-2">
                        <BarChart3 size={16} className="text-blue-600" />
                        Strategy & Tactics
                        {activeAgent === 'data-analytics' && (
                          <motion.span
                            className="ml-2 text-xs text-blue-600"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            Optimizing strategy...
                          </motion.span>
                        )}
                      </h4>
                      <div className="space-y-3 text-sm text-black">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p><strong>Primary Channels:</strong></p>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            <li>Facebook & Instagram Ads ({budgetBreakdown ? '40%' : 'TBD'} of budget)</li>
                            <li>Google Ads - Search & Shopping ({budgetBreakdown ? '35%' : 'TBD'} of budget)</li>
                            <li>TikTok Campaigns ({budgetBreakdown ? '15%' : 'TBD'} of budget)</li>
                            <li>Email Sequences ({budgetBreakdown ? '10%' : 'TBD'} of budget)</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p><strong>Key Messages:</strong></p>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            <li>"Spook-tacular Halloween Deals"</li>
                            <li>"Transform Your Halloween Look"</li>
                            <li>"Limited-Time Halloween Magic"</li>
                          </ul>
                        </div>

                        {/* Campaign Performance Indicators */}
                        {budgetBreakdown && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p><strong>Projected Performance:</strong></p>
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                              <div className="text-center">
                                <div className="font-semibold text-blue-800">Reach</div>
                                <div className="text-black">{budgetBreakdown.totalBudget.includes('Under') ? '125K' :
                                       budgetBreakdown.totalBudget.includes('$10K') ? '285K' :
                                       budgetBreakdown.totalBudget.includes('$50K') ? '410K' : '650K'}</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-800">Engagement</div>
                                <div className="text-black">{budgetBreakdown.totalBudget.includes('Under') ? '6.2%' :
                                       budgetBreakdown.totalBudget.includes('$10K') ? '5.8%' :
                                       budgetBreakdown.totalBudget.includes('$50K') ? '5.4%' : '4.8%'}</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-purple-800">Conv. Rate</div>
                                <div className="text-black">{budgetBreakdown.totalBudget.includes('Under') ? '3.1%' :
                                       budgetBreakdown.totalBudget.includes('$10K') ? '2.8%' :
                                       budgetBreakdown.totalBudget.includes('$50K') ? '2.4%' : '2.0%'}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* A/B Test Results Section */}
                  {isABTestMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                        <Beaker size={16} className="text-purple-600" />
                        A/B Test Analysis
                        {abtestBudget && (
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            Budget B: {abtestBudget}
                          </span>
                        )}
                      </h4>
                      <div className="space-y-4">
                        {/* A/B Test Performance Comparison */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <BarChart3 size={14} />
                              Original Budget
                              {budgetBreakdown && (
                                <span className="ml-2 text-xs bg-blue-700 text-white px-2 py-1 rounded">
                                  {budgetBreakdown.totalBudget}
                                </span>
                              )}
                            </h5>
                            <div className="text-sm space-y-1 text-black">
                              <p className="text-black"><strong>ROI:</strong> 4.2x</p>
                              <p className="text-black"><strong>Reach:</strong> 410K people</p>
                              <p className="text-black"><strong>Cost per Conversion:</strong> $31</p>
                              <p className="text-black"><strong>Conversion Rate:</strong> 2.4%</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <TrendingUp size={14} />
                              A/B Test Budget
                              {abtestBudget && (
                                <span className="ml-2 text-xs bg-green-700 text-white px-2 py-1 rounded">
                                  {abtestBudget}
                                </span>
                              )}
                            </h5>
                            <div className="text-sm space-y-1 text-black">
                              <p className="text-black"><strong>ROI:</strong> 3.8x <span className="text-red-600">(-9%)</span></p>
                              <p className="text-black"><strong>Reach:</strong> 508K people <span className="text-green-600">(+24%)</span></p>
                              <p className="text-black"><strong>Cost per Conversion:</strong> $23 <span className="text-green-600">(-26%)</span></p>
                              <p className="text-black"><strong>Conversion Rate:</strong> 2.8% <span className="text-green-600">(+17%)</span></p>
                            </div>
                          </div>
                        </div>

                        {/* A/B Test Recommendation */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                            <Lightbulb size={14} />
                            Recommendation
                          </h5>
                          <p className="text-sm text-black">
                            The A/B test shows that while the higher budget increases reach by 24%, it reduces ROI by 9%.
                            We recommend starting with your original budget and scaling up based on performance metrics.
                            The optimal approach would be to monitor cost per conversion closely and adjust spend accordingly.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Approval Workflow Section */}
                  {isApprovalWorkflowActive() && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="text-md font-semibold text-black mb-4 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Approval Workflow
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              SC
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">Sarah Chen (CMO)</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Final approval required</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            Pending
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              MJ
                            </div>
                            <div>
                              <p className="text-sm font-medium text-black">Mike Johnson (Marketing Lead)</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Strategy review</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Approved
                          </span>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </div>
                </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Regular single-column layout for empty state and non-Halloween campaigns
        <div className="flex-1 flex flex-col bg-white min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 pb-8" onScroll={onScroll}>
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

          {/* Chat Input - Show when there's a prefilledMessage or messages exist */}
          {(prefilledMessage || messages.length > 0) && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-white">
              <div className="max-w-6xl mx-auto p-6">
                <motion.div
                  className="relative flex items-end space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-purple-500 transition-colors duration-200"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* File attachment button */}
                  <motion.button
                    onClick={() => console.log('File attachment clicked')}
                    disabled={isLoading}
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    aria-label="Attach file"
                    title="Attach file"
                  >
                    <Paperclip size={16} />
                  </motion.button>

                  {/* Message input */}
                  <div className="flex-1 py-2">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Start your conversation..."
                      disabled={isLoading}
                      className="w-full resize-none border-0 bg-transparent text-black placeholder-gray-400 focus:outline-none text-sm leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
                      rows={1}
                      style={{ maxHeight: '80px' }}
                    />
                  </div>

                  {/* Send button */}
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className={`
                      flex-shrink-0 p-2 rounded-md transition-all duration-200
                      ${inputMessage.trim() && !isLoading
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    whileHover={inputMessage.trim() && !isLoading ? { scale: 1.05 } : {}}
                    whileTap={inputMessage.trim() && !isLoading ? { scale: 0.95 } : {}}
                    aria-label="Send message"
                    title="Send message (Enter)"
                  >
                    <Send size={16} />
                  </motion.button>
                </motion.div>

                {/* Hint text */}
                {!isLoading && (
                  <motion.p
                    className="text-xs text-gray-500 mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Press Enter to send, Shift+Enter for new line
                  </motion.p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}