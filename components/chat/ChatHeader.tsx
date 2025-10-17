'use client';

import { motion } from 'framer-motion';
import { Settings, Sparkles, Play, Square, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface ChatHeaderProps {
  onToggleOrchestration: () => void;
  isOrchestrationExpanded: boolean;
}

export default function ChatHeader({
  onToggleOrchestration,
  isOrchestrationExpanded
}: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                Marketing Super Agent
              </h1>
            </div>
          </Link>
        </div>

        {/* Center section - Title (mobile) */}
        <div className="sm:hidden">
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            MSA
          </h1>
        </div>

        {/* Right section - Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Orchestration Toggle */}
          <motion.button
            onClick={onToggleOrchestration}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
              ${isOrchestrationExpanded
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={isOrchestrationExpanded ? 'Hide orchestration' : 'Show orchestration'}
            title={isOrchestrationExpanded ? 'Hide Orchestration' : 'Show Orchestration'}
          >
            <span className="hidden md:inline">
              {isOrchestrationExpanded ? 'Hide' : 'Show'} Orchestration
            </span>
            <span className="md:hidden">
              Orchestration
            </span>
            <motion.div
              animate={{ rotate: isOrchestrationExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </motion.button>


          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}