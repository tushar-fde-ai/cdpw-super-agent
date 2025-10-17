'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Clock,
  Users,
  Mail,
  MessageSquare,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Play,
  Sparkles
} from 'lucide-react';
import { Campaign, JourneyNode } from './types';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSchedule: (date: Date) => void;
  campaign: Campaign;
  journey: JourneyNode[];
}

export default function ActivationModal({
  isOpen,
  onClose,
  onConfirm,
  onSchedule,
  campaign,
  journey
}: ActivationModalProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const preflightChecks = [
    { label: `Journey configured (${journey.length} steps)`, completed: true },
    { label: 'Audience validated', completed: true },
    { label: 'Creative approved', completed: true },
    { label: 'A/B test configured', completed: campaign.hasExperiment },
    { label: 'Send time optimized', completed: true },
    { label: 'All steps reviewed', completed: true }
  ];

  const predictions = [
    { label: 'Open Rate', value: '24-28%', icon: Mail, trend: '+12%' },
    { label: 'Click Rate', value: '3.5-4.2%', icon: TrendingUp, trend: '+8%' },
    { label: 'Conversion', value: '2.1-2.8%', icon: BarChart3, trend: '+15%' },
    { label: 'Est. Revenue', value: '$105k-$126k', icon: DollarSign, trend: '+22%' }
  ];

  const formatAudienceSize = (size: number) => {
    return size >= 1000 ? `${(size / 1000).toFixed(0)}k` : size.toString();
  };

  const handleActivateNow = async () => {
    setIsActivating(true);

    // Simulate activation process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsActivating(false);
    setIsSuccess(true);

    // Auto close after success animation
    setTimeout(() => {
      onConfirm();
      setIsSuccess(false);
    }, 3000);
  };

  const handleScheduleLater = () => {
    if (!scheduleDate || !scheduleTime) return;

    const [hours, minutes] = scheduleTime.split(':');
    const scheduledDate = new Date(scheduleDate);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes));

    onSchedule(scheduledDate);
    setIsScheduling(false);
  };

  const getDurationDisplay = () => {
    // Calculate estimated campaign duration based on journey steps
    const totalHours = journey.reduce((total, node) => {
      if (node.config && 'duration' in node.config) {
        const config = node.config as any;
        const hours = config.unit === 'hours' ? config.duration :
                     config.unit === 'days' ? config.duration * 24 :
                     config.duration / 60; // minutes to hours
        return total + hours;
      }
      return total;
    }, 0);

    const days = Math.ceil(totalHours / 24);
    return `Oct 15 - Oct ${15 + days}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Success Animation Overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className="text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Check size={64} className="mx-auto mb-4" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Campaign Activated!
                  </motion.h2>
                  <motion.p
                    className="text-green-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Your campaign is now live and running
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play size={20} className="text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Ready to Launch?</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Campaign Summary */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <span className="text-sm text-gray-900">{campaign.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Audience:</span>
                  <span className="text-sm text-gray-900">{formatAudienceSize(campaign.audienceSize)} contacts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Duration:</span>
                  <span className="text-sm text-gray-900">{getDurationDisplay()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Channels:</span>
                  <span className="text-sm text-gray-900">{campaign.channels.join(', ')}</span>
                </div>
                {campaign.hasExperiment && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Experiments:</span>
                    <span className="text-sm text-gray-900">A/B subject line test</span>
                  </div>
                )}
              </div>
            </section>

            {/* Pre-flight Checklist */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pre-flight Checklist</h2>
              <div className="space-y-3">
                {preflightChecks.map((check, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`
                      flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                      ${check.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                    `}>
                      <Check size={12} />
                    </div>
                    <span className={`text-sm ${check.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {check.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* AI Predictions */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles size={18} className="text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Expected Results (AI Prediction)</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {predictions.map((prediction, index) => {
                  const IconComponent = prediction.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">{prediction.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">{prediction.value}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {prediction.trend}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Scheduling Section */}
            <AnimatePresence>
              {isScheduling && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Launch</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleScheduleLater}
                        disabled={!scheduleDate}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Calendar size={16} />
                        <span>Schedule Campaign</span>
                      </button>
                      <button
                        onClick={() => setIsScheduling(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {!isScheduling && (
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setIsScheduling(true)}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Clock size={16} />
                  <span>Schedule for Later</span>
                </motion.button>

                <motion.button
                  onClick={handleActivateNow}
                  disabled={isActivating}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${isActivating
                      ? 'bg-green-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    }
                  `}
                  whileHover={!isActivating ? { scale: 1.02 } : {}}
                  whileTap={!isActivating ? { scale: 0.98 } : {}}
                >
                  {isActivating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Activate Now</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}