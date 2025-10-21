'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
}

export default function MessageInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
  initialValue = ''
}: MessageInputProps) {
  const [inputMessage, setInputMessage] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update input when initialValue changes
  useEffect(() => {
    setInputMessage(initialValue);
  }, [initialValue]);

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
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
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

  return (
    <motion.div
      className="relative flex items-end space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-purple-500 transition-colors duration-200"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* File attachment button */}
      <motion.button
        onClick={() => console.log('File attachment clicked')}
        disabled={disabled}
        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
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
          placeholder={placeholder}
          disabled={disabled}
          className="w-full resize-none border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm leading-5 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          style={{ maxHeight: '80px' }}
        />
      </div>

      {/* Send button */}
      <motion.button
        onClick={handleSendMessage}
        disabled={disabled || !inputMessage.trim()}
        className={`
          flex-shrink-0 p-2 rounded-md transition-all duration-200
          ${inputMessage.trim() && !disabled
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        whileHover={inputMessage.trim() && !disabled ? { scale: 1.05 } : {}}
        whileTap={inputMessage.trim() && !disabled ? { scale: 0.95 } : {}}
        aria-label="Send message"
        title="Send message (Enter)"
      >
        <Send size={16} />
      </motion.button>
    </motion.div>
  );
}