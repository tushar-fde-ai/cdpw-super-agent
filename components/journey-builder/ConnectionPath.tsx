'use client';

import { motion } from 'framer-motion';
import { ConnectionPathProps } from './types';

export default function ConnectionPath({ from, to, isActive = false }: ConnectionPathProps) {
  // Calculate the path for smooth connection
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Control points for bezier curve
  const controlX1 = from.x + dx * 0.5;
  const controlY1 = from.y;
  const controlX2 = from.x + dx * 0.5;
  const controlY2 = to.y;

  // SVG path string for smooth curve
  const pathData = `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`;

  // Calculate arrow position and angle
  const arrowX = to.x - 15; // Offset from end point
  const arrowY = to.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <g>
      {/* Main connection line */}
      <motion.path
        d={pathData}
        stroke={isActive ? '#3b82f6' : '#9ca3af'}
        strokeWidth={isActive ? 3 : 2}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Arrow head */}
      <motion.polygon
        points="0,0 -10,-4 -10,4"
        fill={isActive ? '#3b82f6' : '#9ca3af'}
        transform={`translate(${arrowX}, ${arrowY}) rotate(${angle})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />

      {/* Animated flow dots (when active) */}
      {isActive && (
        <motion.circle
          r="3"
          fill="#3b82f6"
          opacity="0.7"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={pathData}
          />
        </motion.circle>
      )}
    </g>
  );
}