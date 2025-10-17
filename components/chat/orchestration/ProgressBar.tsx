'use client';

import { motion } from 'framer-motion';
import { ProgressBarProps } from './types';

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round(current);

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar Container */}
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${percentage}% complete`}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Progress Counter */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{percentage}% complete</span>
        <span>{100 - percentage}% remaining</span>
      </div>
    </div>
  );
}