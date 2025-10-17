'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import AgentNode from './AgentNode';
import ConnectionLine from './ConnectionLine';
import ProgressBar from './ProgressBar';
import { OrchestrationPanelProps, Agent } from './types';
import { DEMO_WORKFLOW, DEMO_AGENTS, getActiveAgents } from './demoData';

export default function OrchestrationPanel({ isExpanded, onToggle, activeWorkflow }: OrchestrationPanelProps) {
  const [agents] = useState(DEMO_AGENTS);

  // Auto-collapse after 10 seconds of inactivity (optional)
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        // Auto-collapse functionality can be enabled here
        // onToggle();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isExpanded, onToggle]);

  // Only show panel when there's an active workflow
  if (!activeWorkflow) {
    return null;
  }

  const currentWorkflow = activeWorkflow;
  const activeAgents = getActiveAgents();

  // Get workflow agents in order
  const workflowAgents = currentWorkflow.steps.map(step => {
    const agent = agents.find(a => a.id === step.agentId);
    return agent ? { ...agent, status: step.status } : null;
  }).filter(Boolean) as Agent[];

  const handleAgentClick = (agent: Agent) => {
    console.log('Agent clicked:', agent);
    // TODO: Show agent details modal or side panel
  };

  // Collapsed state
  if (!isExpanded) {
    return (
      <motion.div
        className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
        initial={false}
        animate={{ height: '44px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <motion.button
          onClick={onToggle}
          className="w-full h-11 flex items-center justify-between px-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
          aria-label="Show orchestration panel"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Settings size={14} className="text-gray-500" />
            </motion.div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {activeAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agent.color }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                ))}
              </div>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeAgents.length} agents working • {currentWorkflow.currentTaskDescription.length > 55
                  ? `${currentWorkflow.currentTaskDescription.substring(0, 55)}...`
                  : currentWorkflow.currentTaskDescription}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={18} className="text-gray-500" />
          </motion.div>
        </motion.button>
      </motion.div>
    );
  }

  // Expanded state
  return (
    <motion.div
      className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-teal-900/20"
      initial={false}
      animate={{ height: 'auto' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ minHeight: '180px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
          Agent Workflow
        </h3>

        <div className="flex items-center space-x-3">
          {/* Step Counter Badge */}
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full text-xs font-medium">
            Step {currentWorkflow.currentStep} of {currentWorkflow.totalSteps}
          </div>

          {/* Hide Button */}
          <motion.button
            onClick={onToggle}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-xs font-medium text-gray-600 dark:text-gray-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Hide orchestration panel"
          >
            <span>Hide</span>
            <ChevronUp size={14} />
          </motion.button>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="px-6 py-4">
        <AnimatePresence>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {/* Agent Flow Container */}
            <div className="flex items-start justify-center space-x-2 mb-6 relative overflow-x-auto px-4 py-2">
              {workflowAgents.map((agent, index) => (
                <div key={agent.id} className="flex items-start">
                  {/* Agent Node */}
                  <AgentNode
                    agent={agent}
                    status={agent.status}
                    onClick={handleAgentClick}
                  />

                  {/* Connection Line (if not last agent) */}
                  {index < workflowAgents.length - 1 && (
                    <div className="flex items-center" style={{ height: '64px', marginTop: '1px' }}>
                      <ConnectionLine
                        fromAgent={agent.id}
                        toAgent={workflowAgents[index + 1].id}
                        isActive={agent.status === 'complete'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Current Task Description - only show when workflow is actually active */}
            {currentWorkflow.currentStep > 0 && currentWorkflow.currentTaskDescription && (
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 mb-4 backdrop-blur-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse" />
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Task:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentWorkflow.currentTaskDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressBar
              current={currentWorkflow.overallProgress}
              total={100}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
    </motion.div>
  );
}