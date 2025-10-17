'use client';

import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import { CollaborationBadgeProps } from './types';

export default function CollaborationBadge({ agents }: CollaborationBadgeProps) {
  if (agents.length < 2) return null;

  return (
    <motion.div
      className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg z-10"
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-1">
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Handshake size={12} />
        </motion.div>
        <span>
          {agents.length} agents collaborating
        </span>
      </div>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
}