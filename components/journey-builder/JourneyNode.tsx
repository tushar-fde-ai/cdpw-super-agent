'use client';

import { motion } from 'framer-motion';
import {
  Flag,
  Clock,
  Mail,
  MessageSquare,
  GitBranch,
  Split,
  CheckCircle,
  AlertCircle,
  Circle,
  Sparkles
} from 'lucide-react';
import { JourneyNodeProps, NodeType } from './types';

export default function JourneyNode({ node, isSelected, onClick }: JourneyNodeProps) {
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'entry':
        return Flag;
      case 'wait':
        return Clock;
      case 'email':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'decision':
        return GitBranch;
      case 'split':
        return Split;
      default:
        return Circle;
    }
  };

  const getNodeStyling = (type: NodeType) => {
    switch (type) {
      case 'entry':
        return {
          background: 'bg-gradient-to-br from-green-400 to-green-600',
          border: 'border-green-300',
          iconColor: 'text-white'
        };
      case 'wait':
        return {
          background: 'bg-gradient-to-br from-orange-400 to-orange-600',
          border: 'border-orange-300',
          iconColor: 'text-white'
        };
      case 'email':
        return {
          background: 'bg-gradient-to-br from-blue-400 to-blue-600',
          border: 'border-blue-300',
          iconColor: 'text-white'
        };
      case 'sms':
        return {
          background: 'bg-gradient-to-br from-purple-400 to-purple-600',
          border: 'border-purple-300',
          iconColor: 'text-white'
        };
      case 'decision':
        return {
          background: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          border: 'border-yellow-300',
          iconColor: 'text-white'
        };
      case 'split':
        return {
          background: 'bg-gradient-to-br from-teal-400 to-teal-600',
          border: 'border-teal-300',
          iconColor: 'text-white'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-gray-400 to-gray-600',
          border: 'border-gray-300',
          iconColor: 'text-white'
        };
    }
  };

  const getStatusIcon = () => {
    switch (node.status) {
      case 'configured':
        return <CheckCircle size={12} className="text-green-600" />;
      case 'pending':
        return <AlertCircle size={12} className="text-orange-600" />;
      case 'draft':
        return <Circle size={12} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const IconComponent = getNodeIcon(node.type);
  const styling = getNodeStyling(node.type);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          relative w-40 h-24 rounded-lg border-2 shadow-lg transition-all duration-200
          ${styling.background} ${styling.border}
          ${isSelected ? 'ring-4 ring-blue-300 ring-opacity-50 shadow-xl' : 'hover:shadow-xl'}
        `}
      >
        {/* Node Content */}
        <div className="flex flex-col items-center justify-center h-full p-3">
          {/* Icon */}
          <div className="mb-2">
            <IconComponent size={20} className={styling.iconColor} />
          </div>

          {/* Label */}
          <div className="text-center">
            <p className="text-xs font-medium text-white leading-tight">
              {node.label}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {getStatusIcon()}
        </div>

        {/* A/B Test Badge */}
        {node.hasABTest && (
          <div className="absolute -top-1 -left-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            A/B
          </div>
        )}

        {/* AI Generated Badge */}
        {node.generatedByAI && (
          <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1 shadow-sm">
            <Sparkles size={10} />
          </div>
        )}

        {/* Selected Glow Effect */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg bg-blue-400 opacity-20 animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}