'use client';

import { motion } from 'framer-motion';
import { FileText, Eye } from 'lucide-react';
import { DocumentPreviewCardProps } from './types';

export default function DocumentPreviewCard({
  title,
  description,
  fileType,
  onView
}: DocumentPreviewCardProps) {
  return (
    <motion.div
      className="max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start space-x-3">
          {/* Document Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badge */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h4>
              <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                {fileType}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            onClick={onView}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={14} />
            <span>Review Document</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}