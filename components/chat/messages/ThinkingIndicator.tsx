'use client';

import { motion } from 'framer-motion';
import { Bot, Brain } from 'lucide-react';
import { ThinkingIndicatorProps } from './types';

export default function ThinkingIndicator({ agentName, timestamp }: ThinkingIndicatorProps) {
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-end space-x-2 max-w-[70%]">
        {/* Agent Avatar */}
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-1 flex-shrink-0"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Brain size={16} className="text-white" />
        </motion.div>

        {/* Thinking Bubble */}
        <motion.div
          className="relative px-5 py-4 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 shadow-lg"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Thinking Text */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {agentName ? `${agentName} is thinking` : 'Thinking'}...
            </span>

            {/* Animated Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>

        </motion.div>

        {/* Spacer for alignment */}
        <div className="w-8" />
      </div>
    </motion.div>
  );
}