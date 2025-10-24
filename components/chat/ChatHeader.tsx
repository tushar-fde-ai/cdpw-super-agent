'use client';

import { motion } from 'framer-motion';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ChatHeaderProps {
  onToggleOrchestration: () => void;
  isOrchestrationExpanded: boolean;
}

export default function ChatHeader({
  onToggleOrchestration,
  isOrchestrationExpanded
}: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section - Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/start" className="flex items-center space-x-3 group">
            <motion.div
              className="relative w-10 h-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/logos/td-icon.png"
                alt="TD Logo"
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                Marketing Super Agent
              </h1>
            </div>
          </Link>
        </div>

        {/* Center section - Title (mobile) */}
        <div className="sm:hidden">
          <h1 className="text-lg font-bold text-black">
            MSA
          </h1>
        </div>

        {/* Right section - Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/start" className="flex items-center space-x-2 group">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline font-medium">Back to Dashboard</span>
              <span className="sm:hidden font-medium">Dashboard</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </header>
  );
}