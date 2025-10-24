'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, X, FileText } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, attachment?: File) => void;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  allowAttachments?: boolean;
}

export default function MessageInput({
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
  initialValue = '',
  allowAttachments = false
}: MessageInputProps) {
  const [inputMessage, setInputMessage] = useState(initialValue);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAttachedFile(file);
    } else if (file) {
      alert('Please select a PDF file');
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage.trim(), attachedFile || undefined);
      setInputMessage('');
      setAttachedFile(null);
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
    <div className="space-y-2">
      {/* Attached file preview */}
      {attachedFile && (
        <motion.div
          className="flex items-center justify-between px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-purple-600" />
            <span className="text-sm text-purple-900 font-medium">{attachedFile.name}</span>
            <span className="text-xs text-purple-600">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
          <motion.button
            onClick={handleRemoveFile}
            className="p-1 hover:bg-purple-100 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Remove file"
          >
            <X size={14} className="text-purple-700" />
          </motion.button>
        </motion.div>
      )}

      <motion.div
        className="relative flex items-end space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-purple-500 transition-colors duration-200"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File attachment button */}
        {allowAttachments && (
          <motion.button
            onClick={handleAttachClick}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            aria-label="Attach PDF file"
            title="Attach PDF file"
          >
            <Paperclip size={16} />
          </motion.button>
        )}

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
    </div>
  );
}