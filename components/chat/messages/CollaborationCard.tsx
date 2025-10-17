'use client';

import { motion } from 'framer-motion';
import { Handshake, Target, Users, BarChart3, Workflow, Palette, Rocket } from 'lucide-react';
import { CollaborationInfo } from './types';

interface CollaborationCardProps {
  collaboration: CollaborationInfo;
}

const agentIcons = {
  strategy: Target,
  audience: Users,
  analytics: BarChart3,
  journey: Workflow,
  creative: Palette,
  activation: Rocket,
};

export default function CollaborationCard({ collaboration }: CollaborationCardProps) {
  return (
    <motion.div
      className="mt-3 bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-teal-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
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

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(147, 51, 234, 0.4)',
                '0 0 0 8px rgba(147, 51, 234, 0.1)',
                '0 0 0 0 rgba(147, 51, 234, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Handshake size={20} className="text-white" />
          </motion.div>

          <div className="flex-1">
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 uppercase tracking-wide">
              Multi-Agent Collaboration
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-300">
              {collaboration.status === 'active' ? 'In Progress' : 'Completed'}
            </p>
          </div>

          {collaboration.status === 'active' && (
            <motion.div
              className="w-3 h-3 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </div>

        {/* Agents List */}
        <div className="space-y-3 mb-4">
          {collaboration.agentIds.map((agentId, index) => {
            const agentName = collaboration.agentNames[index];
            const agentColor = collaboration.agentColors[index];
            const IconComponent = agentIcons[agentId as keyof typeof agentIcons] || Target;

            return (
              <motion.div
                key={agentId}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: agentColor }}
                  whileHover={{ scale: 1.1 }}
                >
                  <IconComponent size={16} className="text-white" />
                </motion.div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {agentName}
                  </p>
                </div>

                {collaboration.status === 'active' && (
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agentColor }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: 'easeInOut'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Task Description */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {collaboration.description}
          </p>
        </div>

        {/* Progress Bar */}
        {collaboration.progress !== undefined && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {collaboration.progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${collaboration.progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Connection lines animation */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          style={{ zIndex: 1 }}
        >
          <motion.path
            d="M 20 30 Q 50 50 80 30"
            stroke="url(#collaborationGradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <defs>
            <linearGradient id="collaborationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}