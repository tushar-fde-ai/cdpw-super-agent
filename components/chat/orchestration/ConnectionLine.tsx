'use client';

import { motion } from 'framer-motion';
import { ConnectionLineProps } from './types';

export default function ConnectionLine({ fromAgent, toAgent, isActive }: ConnectionLineProps) {
  const lineLength = 60; // Reduced length for better spacing

  return (
    <div className="flex items-center justify-center" style={{ width: lineLength }}>
      <svg
        width={lineLength}
        height="24"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Base line */}
        <motion.line
          x1="0"
          y1="12"
          x2={lineLength - 12}
          y2="12"
          stroke={isActive ? '#2563eb' : '#9ca3af'}
          strokeWidth={isActive ? "3" : "2"}
          strokeDasharray={isActive ? "0" : "4,4"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Arrow head - more prominent */}
        <motion.polygon
          points={`${lineLength - 12},8 ${lineLength - 12},16 ${lineLength - 2},12`}
          fill={isActive ? '#2563eb' : '#9ca3af'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Animated flowing dots when active - brighter and more visible */}
        {isActive && (
          <>
            <motion.circle
              cx="0"
              cy="12"
              r="3"
              fill="#3b82f6"
              animate={{
                cx: [0, lineLength - 12]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.circle
              cx="0"
              cy="12"
              r="2"
              fill="#60a5fa"
              animate={{
                cx: [0, lineLength - 12]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.3
              }}
            />
          </>
        )}

        {/* Enhanced active line with glow effect */}
        {isActive && (
          <motion.line
            x1="0"
            y1="12"
            x2={lineLength - 12}
            y2="12"
            stroke="#3b82f6"
            strokeWidth="4"
            opacity="0.6"
            filter="url(#glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Glow filter definition */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}