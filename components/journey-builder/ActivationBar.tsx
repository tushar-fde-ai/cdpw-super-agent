'use client';

import { motion } from 'framer-motion';
import { Eye, Save, Play, Users, Zap, TestTube } from 'lucide-react';
import { ActivationBarProps } from './types';

export default function ActivationBar({ campaign, onPreview, onSave, onActivate }: ActivationBarProps) {
  const formatAudienceSize = (size: number) => {
    if (size >= 1000) {
      return `${(size / 1000).toFixed(0)}k`;
    }
    return size.toString();
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-6 py-3 h-16">
        {/* Left Side - Campaign Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">
                Campaign: {campaign.name}
              </h1>
            </div>
          </div>

          {/* Campaign Badges */}
          <div className="flex items-center space-x-2">
            {/* Audience Size */}
            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
              <Users size={12} />
              <span>{formatAudienceSize(campaign.audienceSize)} contacts</span>
            </div>

            {/* Channels */}
            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
              <Zap size={12} />
              <span>{campaign.channels.join(' + ')}</span>
            </div>

            {/* A/B Test Indicator */}
            {campaign.hasExperiment && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                <TestTube size={12} />
                <span>A/B Test</span>
              </div>
            )}

            {/* Status */}
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium
              ${campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
              ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : ''}
              ${campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' : ''}
            `}>
              <span className="capitalize">{campaign.status}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Preview Journey */}
          <motion.button
            onClick={onPreview}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye size={16} />
            <span>Preview Journey</span>
          </motion.button>

          {/* Save as Draft */}
          <motion.button
            onClick={onSave}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </motion.button>

          {/* Activate Campaign */}
          <motion.button
            onClick={onActivate}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={16} />
            <span>Activate Campaign</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}