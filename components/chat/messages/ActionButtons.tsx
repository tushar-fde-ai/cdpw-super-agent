'use client';

import { motion } from 'framer-motion';
import { ActionButtonsProps } from './types';

export default function ActionButtons({ actions }: ActionButtonsProps) {
  const getButtonStyles = (variant: 'primary' | 'secondary' | 'outline') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg';
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          onClick={action.onClick}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${getButtonStyles(action.variant)}
          `}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            duration: 0.3,
            type: 'spring',
            stiffness: 300
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}