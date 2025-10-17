'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { UserMessageProps } from './types';

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div>
      <MessageBubble
        content={message.content}
        sender={message.sender}
        timestamp={message.timestamp}
      >
        {/* Optional attached file display */}
        {message.metadata?.attachedFile && (
          <motion.div
            className="mt-2 flex items-center space-x-2 text-xs text-blue-100 bg-blue-800/30 rounded-lg px-3 py-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FileText size={12} className="text-blue-200" />
            <span className="font-medium">{message.metadata.attachedFile.name}</span>
            <span className="text-blue-200">({message.metadata.attachedFile.type})</span>
          </motion.div>
        )}
      </MessageBubble>
    </div>
  );
}