'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  ArrowLeft,
  Calendar,
  Activity,
  Zap,
  Settings,
  Download,
  Share2,
  Bell,
  Layers,
  PieChart,
  LineChart,
  Filter
} from 'lucide-react';

interface CampaignAnalyticsConfigProps {
  onBack: () => void;
  onSave: (config: any) => void;
}

export default function CampaignAnalyticsConfig({ onBack, onSave }: CampaignAnalyticsConfigProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Analytics configuration created by the AI
  const analyticsConfig = {
    trackingSetup: {
      googleAnalytics: { enabled: true, propertyId: 'GA4-H4LL0W33N-2025' },
      facebookPixel: { enabled: true, pixelId: 'FB_PIX_H4LL0W33N' },
      customEvents: ['halloween_product_view', 'costume_category_browse', 'cart_abandon_halloween'],
      conversionGoals: [
        { name: 'Halloween Purchase', value: '$75', priority: 'high' },
        { name: 'Email Signup', value: '$5', priority: 'medium' },
        { name: 'Social Share', value: '$2', priority: 'low' }
      ]
    },
    dashboards: [
      {
        id: 1,
        name: 'Halloween Campaign Overview',
        type: 'real-time',
        metrics: ['impressions', 'clicks', 'conversions', 'revenue'],
        updateFrequency: '5 minutes',
        widgets: 8
      },
      {
        id: 2,
        name: 'Email Performance Deep Dive',
        type: 'email-focused',
        metrics: ['open_rate', 'click_rate', 'unsubscribe_rate', 'revenue_per_email'],
        updateFrequency: '30 minutes',
        widgets: 12
      },
      {
        id: 3,
        name: 'Social Media Analytics',
        type: 'social-focused',
        metrics: ['engagement_rate', 'reach', 'shares', 'comments', 'social_conversions'],
        updateFrequency: '1 hour',
        widgets: 10
      },
      {
        id: 4,
        name: 'Attribution Analysis',
        type: 'attribution',
        metrics: ['first_touch', 'last_touch', 'multi_touch', 'assisted_conversions'],
        updateFrequency: '6 hours',
        widgets: 6
      }
    ],
    automatedReports: [
      {
        name: 'Daily Halloween Performance',
        schedule: 'Daily at 9 AM',
        recipients: ['kate@company.com', 'marketing-team@company.com'],
        format: 'PDF + Excel',
        sections: ['overview', 'email', 'social', 'conversions']
      },
      {
        name: 'Weekly Campaign Insights',
        schedule: 'Monday at 8 AM',
        recipients: ['leadership@company.com'],
        format: 'Executive Summary',
        sections: ['key_metrics', 'trends', 'recommendations']
      }
    ],
    alerts: [
      {
        metric: 'Conversion Rate Drop',
        threshold: '> 20% decrease',
        notification: 'Slack + Email',
        urgency: 'high'
      },
      {
        metric: 'Email Open Rate',
        threshold: '< 25%',
        notification: 'Email',
        urgency: 'medium'
      },
      {
        metric: 'Budget Utilization',
        threshold: '> 80% spent',
        notification: 'Slack',
        urgency: 'medium'
      }
    ]
  };

  const performanceMetrics = [
    {
      id: 'impressions',
      name: 'Total Impressions',
      value: '2.4M',
      change: '+18%',
      trend: 'up',
      icon: Eye,
      color: 'slate',
      forecast: '3.1M by Oct 31'
    },
    {
      id: 'clicks',
      name: 'Total Clicks',
      value: '89.2K',
      change: '+23%',
      trend: 'up',
      icon: MousePointer,
      color: 'slate',
      forecast: '125K by Oct 31'
    },
    {
      id: 'conversions',
      name: 'Conversions',
      value: '1,847',
      change: '+31%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'slate',
      forecast: '2,650 by Oct 31'
    },
    {
      id: 'revenue',
      name: 'Revenue Generated',
      value: '$138,525',
      change: '+28%',
      trend: 'up',
      icon: DollarSign,
      color: 'slate',
      forecast: '$195K by Oct 31'
    },
    {
      id: 'ctr',
      name: 'Click-Through Rate',
      value: '3.72%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'slate',
      forecast: '4.1% by Oct 31'
    },
    {
      id: 'roas',
      name: 'Return on Ad Spend',
      value: '4.2x',
      change: '+0.6x',
      trend: 'up',
      icon: TrendingUp,
      color: 'slate',
      forecast: '4.8x by Oct 31'
    }
  ];

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(selectedMetric === metricId ? null : metricId);
  };

  const handleSaveChanges = () => {
    onSave({ analyticsConfig });
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="p-2 bg-slate-700 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Halloween Campaign Analytics</h1>
              <p className="text-sm text-gray-600">Comprehensive Performance Tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-slate-700 text-white hover:bg-slate-800'
              }`}
            >
              <Settings size={16} className="inline mr-2" />
              {isEditing ? 'Cancel Edit' : 'Configure Analytics'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Zap size={16} className="inline mr-2" />
                Save Configuration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Real-Time Performance Metrics */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Performance Metrics</h2>
            <div className="grid grid-cols-3 gap-6">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleMetricClick(metric.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      metric.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{metric.name}</div>
                  <div className="text-xs text-gray-500">{metric.forecast}</div>

                  {selectedMetric === metric.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Last 24h: +12%</div>
                        <div>Last 7d: +18%</div>
                        <div>Last 30d: +25%</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Analytics Dashboards */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboards</h2>
              <p className="text-sm text-gray-600 mt-1">AI-configured dashboards for comprehensive insights</p>
            </div>

            <div className="p-6 space-y-4">
              {analyticsConfig.dashboards.map((dashboard, index) => (
                <motion.div
                  key={dashboard.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {dashboard.type === 'real-time' && <Activity className="w-5 h-5 text-white" />}
                        {dashboard.type === 'email-focused' && <BarChart3 className="w-5 h-5 text-white" />}
                        {dashboard.type === 'social-focused' && <PieChart className="w-5 h-5 text-white" />}
                        {dashboard.type === 'attribution' && <LineChart className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{dashboard.name}</h3>
                        <p className="text-sm text-gray-600">{dashboard.widgets} widgets • Updates every {dashboard.updateFrequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                      {isEditing && (
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Settings size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {dashboard.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {metric.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tracking & Attribution Setup */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking & Attribution Setup</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Platform Integrations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Google Analytics 4</div>
                        <div className="text-xs text-gray-600">{analyticsConfig.trackingSetup.googleAnalytics.propertyId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded font-medium">Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Facebook Pixel</div>
                        <div className="text-xs text-gray-600">{analyticsConfig.trackingSetup.facebookPixel.pixelId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-3">Conversion Goals</h3>
                <div className="space-y-3">
                  {analyticsConfig.trackingSetup.conversionGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{goal.name}</div>
                        <div className="text-sm text-gray-600">Value: {goal.value}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        goal.priority === 'high' ? 'bg-slate-700 text-white' :
                        goal.priority === 'medium' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Automated Reports & Alerts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Automated Reports */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Download size={18} />
                Automated Reports
              </h2>
              <div className="space-y-4">
                {analyticsConfig.automatedReports.map((report, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200 font-medium">
                        {report.format}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        {report.schedule}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={12} />
                        {report.recipients.length} recipients
                      </div>
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    + Add New Report
                  </button>
                )}
              </div>
            </div>

            {/* Alert Configuration */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={18} />
                Smart Alerts
              </h2>
              <div className="space-y-4">
                {analyticsConfig.alerts.map((alert, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{alert.metric}</h3>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        alert.urgency === 'high' ? 'bg-slate-700 text-white' :
                        alert.urgency === 'medium' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {alert.urgency}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Threshold: {alert.threshold}</div>
                      <div>Notify via: {alert.notification}</div>
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    + Add New Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}