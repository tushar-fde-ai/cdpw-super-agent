'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  placeholder = "Type your message here...",
  disabled = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 5 lines (24px line height)
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = () => {
    // File attachment functionality - placeholder for now
    console.log('File attachment clicked');
    // TODO: Implement file upload functionality
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto p-4">
        <motion.div
          className="relative flex items-end space-x-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-md focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-colors duration-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* File attachment button */}
          <motion.button
            onClick={handleFileAttach}
            disabled={disabled}
            className="flex-shrink-0 p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            aria-label="Attach file"
            title="Attach file"
          >
            <Paperclip size={20} />
          </motion.button>

          {/* Message input */}
          <div className="flex-1 py-3">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
          </div>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className={`
              flex-shrink-0 p-3 rounded-lg transition-all duration-200
              ${message.trim() && !disabled
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
            whileHover={message.trim() && !disabled ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !disabled ? { scale: 0.95 } : {}}
            aria-label="Send message"
            title="Send message (Enter)"
          >
            <Send size={20} />
          </motion.button>
        </motion.div>

        {/* AI thinking indicator */}
        {disabled && (
          <motion.div
            className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full"
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
            <span>AI agents are thinking...</span>
          </motion.div>
        )}

        {/* Hint text */}
        {!disabled && (
          <motion.p
            className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Press Enter to send, Shift+Enter for new line
          </motion.p>
        )}
      </div>
    </div>
  );
}