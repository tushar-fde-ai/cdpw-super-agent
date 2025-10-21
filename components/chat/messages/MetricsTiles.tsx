'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Target, Calendar, DollarSign } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change?: string;
  icon?: string;
  color?: string;
}

interface MetricsTilesProps {
  metrics: Metric[];
  timestamp: Date;
}

// Icon mapping
const iconMap = {
  Users,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
};

export default function MetricsTiles({ metrics, timestamp }: MetricsTilesProps) {
  const getIcon = (iconName?: string) => {
    if (!iconName) return Users;
    return iconMap[iconName as keyof typeof iconMap] || Users;
  };

  const getChangeIcon = (change?: string) => {
    if (!change) return null;
    const isPositive = change.startsWith('+');
    return isPositive ? TrendingUp : TrendingDown;
  };

  const getChangeColor = (change?: string) => {
    if (!change) return '';
    const isPositive = change.startsWith('+');
    return isPositive ? 'text-green-700' : 'text-red-700';
  };

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-end space-x-2 max-w-[90%]">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-1 flex-shrink-0">
          <Target size={16} className="text-white" />
        </div>

        {/* Metrics Grid */}
        <motion.div
          className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-200"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = getIcon(metric.icon);
              const ChangeIcon = getChangeIcon(metric.change);

              return (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: metric.color ? `${metric.color}15` : '#7c3aed15' }}
                    >
                      <IconComponent
                        size={18}
                        style={{ color: metric.color || '#7c3aed' }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Label */}
                      <div className="text-sm font-semibold text-gray-800 mb-1 leading-tight">
                        {metric.label}
                      </div>

                      {/* Value and Change */}
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-gray-900">
                          {metric.value}
                        </div>
                        {metric.change && (
                          <div className={`flex items-center space-x-1 text-xs font-medium ${getChangeColor(metric.change)} bg-white px-2 py-1 rounded-md shadow-sm`}>
                            {ChangeIcon && <ChangeIcon size={12} />}
                            <span>{metric.change}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* Spacer for alignment */}
        <div className="w-8" />
      </div>
    </motion.div>
  );
}