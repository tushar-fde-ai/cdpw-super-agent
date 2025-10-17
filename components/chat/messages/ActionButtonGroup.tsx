'use client';

import { motion } from 'framer-motion';
import { Check, X, Download, Eye, Edit, Play } from 'lucide-react';
import { Action } from './types';

interface ActionButtonGroupProps {
  actions: Action[];
  onActionClick?: (actionId: string) => void;
}

const iconMap = {
  check: Check,
  x: X,
  download: Download,
  eye: Eye,
  edit: Edit,
  play: Play,
};

export default function ActionButtonGroup({ actions, onActionClick }: ActionButtonGroupProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  const handleActionClick = (action: Action) => {
    action.onClick();
    onActionClick?.(action.id);
  };

  return (
    <motion.div
      className="flex flex-wrap gap-2 mt-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {actions.map((action, index) => {
        const IconComponent = iconMap[action.icon as keyof typeof iconMap];

        return (
          <motion.button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${action.type === 'primary'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : action.type === 'danger'
                ? 'border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            {IconComponent && <IconComponent size={16} />}
            <span>{action.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}