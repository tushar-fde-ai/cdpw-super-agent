'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Target, Users, BarChart3, Workflow, Palette, Rocket } from 'lucide-react';
import { AgentNodeProps } from './types';

// Icon mapping for agents
const iconMap = {
  Target,
  Users,
  BarChart3,
  Workflow,
  Palette,
  Rocket
};

export default function AgentNode({ agent, status, onClick }: AgentNodeProps) {
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Target;

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Check size={12} className="text-white" />
          </motion.div>
        );
      case 'waiting':
        return (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock size={10} className="text-white" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  const getNodeStyle = () => {
    const baseStyle = "w-16 h-16 rounded-xl flex items-center justify-center shadow-lg relative transition-all duration-200 cursor-pointer";

    switch (status) {
      case 'active':
        return `${baseStyle} shadow-xl transform scale-110`;
      case 'complete':
        return `${baseStyle} shadow-md opacity-90`;
      case 'waiting':
        return `${baseStyle} opacity-60`;
      case 'idle':
        return `${baseStyle} opacity-40 grayscale`;
      default:
        return baseStyle;
    }
  };

  const getPulseEffect = () => {
    if (status === 'active') {
      return {
        boxShadow: [
          `0 0 0 0 ${agent.color}40`,
          `0 0 0 10px ${agent.color}20`,
          `0 0 0 0 ${agent.color}40`
        ]
      };
    }
    return {};
  };

  const getStatusText = () => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'active':
        return 'Working';
      case 'waiting':
        return 'Waiting';
      case 'idle':
        return 'Ready';
      default:
        return 'Ready';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'complete':
        return 'text-green-600 dark:text-green-400';
      case 'active':
        return 'text-blue-600 dark:text-blue-400';
      case 'waiting':
        return 'text-amber-600 dark:text-amber-400';
      case 'idle':
        return 'text-gray-500 dark:text-gray-500';
      default:
        return 'text-gray-500 dark:text-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 min-w-[90px] p-1">
      {/* Agent Node */}
      <motion.div
        className={getNodeStyle()}
        style={{ backgroundColor: agent.color }}
        onClick={() => onClick?.(agent)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={getPulseEffect()}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: status === 'active' ? Infinity : 0,
            ease: 'easeInOut'
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${agent.name} agent - ${status}`}
        title={agent.currentTask || agent.name}
      >
        <IconComponent size={24} className="text-white" />
        {getStatusBadge()}
      </motion.div>

      {/* Agent Name - Most prominent */}
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
          {agent.name}
        </p>

        {/* Status Text - Small and subtle */}
        <motion.p
          className={`text-xs font-medium mt-1 ${getStatusTextColor()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getStatusText()}
        </motion.p>
      </div>
    </div>
  );
}