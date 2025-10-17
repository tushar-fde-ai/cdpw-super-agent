'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { MessageBubbleProps } from './types';

export default function MessageBubble({ content, sender, timestamp, children }: MessageBubbleProps) {
  const isUser = sender === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[70%]`}>
        {/* Avatar for Assistant */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-1 flex-shrink-0">
            <Bot size={16} className="text-white" />
          </div>
        )}

        {/* Message Bubble */}
        <motion.div
          className={`
            relative px-5 py-4 rounded-2xl shadow-lg
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
            }
          `}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Message Content */}
          <div className="text-sm leading-relaxed">
            {content}
          </div>

          {/* Children (for embedded components) */}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}

        </motion.div>

        {/* Spacer for alignment */}
        {isUser && <div className="w-8" />}
      </div>
    </motion.div>
  );
}