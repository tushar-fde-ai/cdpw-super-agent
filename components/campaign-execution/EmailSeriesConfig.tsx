'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Calendar,
  Users,
  Target,
  Eye,
  Edit3,
  Check,
  Clock,
  ArrowLeft,
  Send,
  BarChart3,
  Settings,
  Sparkles,
  Image,
  Type,
  Zap
} from 'lucide-react';

interface EmailSeriesConfigProps {
  onBack: () => void;
  onSave: (config: any) => void;
}

export default function EmailSeriesConfig({ onBack, onSave }: EmailSeriesConfigProps) {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Halloween email sequence configured by the AI
  const emailSequence = [
    {
      id: 1,
      name: 'Halloween Announcement',
      subject: 'Spook-tacular Deals Are Here! 👻',
      sendDate: 'October 17, 2025',
      sendTime: '10:00 AM',
      audienceSize: '267K',
      template: 'Halloween Hero Banner',
      status: 'configured',
      previewText: 'Get ready for our biggest Halloween sale...',
      content: {
        headline: 'Halloween Magic Awaits',
        ctaText: 'Shop Halloween Collection',
        discount: '25% Off Everything',
        heroImage: 'halloween-hero-banner.jpg'
      },
      metrics: {
        expectedOpenRate: '32%',
        expectedClickRate: '4.2%',
        expectedConversions: '267'
      }
    },
    {
      id: 2,
      name: 'Costume Ideas & Inspiration',
      subject: 'Need Halloween Costume Ideas? We Got You! 🎭',
      sendDate: 'October 20, 2025',
      sendTime: '2:00 PM',
      audienceSize: '243K',
      template: 'Content Gallery',
      status: 'configured',
      previewText: 'Browse our curated costume collections...',
      content: {
        headline: 'Find Your Perfect Halloween Look',
        ctaText: 'Browse Costumes',
        discount: '30% Off Costumes',
        heroImage: 'costume-gallery.jpg'
      },
      metrics: {
        expectedOpenRate: '28%',
        expectedClickRate: '5.1%',
        expectedConversions: '312'
      }
    },
    {
      id: 3,
      name: 'Last Chance - Halloween Sale',
      subject: 'Final Hours: Halloween Savings End Tonight! ⏰',
      sendDate: 'October 30, 2025',
      sendTime: '6:00 PM',
      audienceSize: '298K',
      template: 'Urgency Banner',
      status: 'configured',
      previewText: 'Don\'t miss out on Halloween savings...',
      content: {
        headline: 'Last Chance for Halloween Magic',
        ctaText: 'Shop Before Midnight',
        discount: 'Up to 40% Off',
        heroImage: 'urgency-halloween.jpg'
      },
      metrics: {
        expectedOpenRate: '38%',
        expectedClickRate: '6.8%',
        expectedConversions: '478'
      }
    }
  ];

  const handleEmailClick = (emailId: number) => {
    setSelectedEmail(selectedEmail === emailId ? null : emailId);
  };

  const handleSaveChanges = () => {
    onSave({ emailSequence });
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
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Halloween Email Series</h1>
              <p className="text-sm text-gray-600">Engage Suite Configuration</p>
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
              <Edit3 size={16} className="inline mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Sequence'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Check size={16} className="inline mr-2" />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Campaign Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Overview</h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Email Sequence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">267K</div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">32.7%</div>
                <div className="text-sm text-gray-600">Avg Open Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1,057</div>
                <div className="text-sm text-gray-600">Expected Conversions</div>
              </div>
            </div>
          </div>

          {/* Email Sequence */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Email Sequence Timeline</h2>
              <p className="text-sm text-gray-600 mt-1">AI-optimized send schedule for maximum engagement</p>
            </div>

            <div className="p-6 space-y-4">
              {emailSequence.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEmailClick(email.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{email.name}</h3>
                          <p className="text-sm text-gray-600">"{email.subject}"</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {email.sendDate} at {email.sendTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {email.audienceSize} recipients
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                          {email.status}
                        </span>
                        <div className="text-gray-400">
                          {selectedEmail === email.id ? '▼' : '▶'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Email Details */}
                  {selectedEmail === email.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Email Content */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <Type size={16} />
                              Content Configuration
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <h5 className="font-medium text-gray-800 mb-2">Email Preview</h5>
                                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                                  <div className="text-xs text-gray-500 mb-2">Subject: {email.subject}</div>
                                  <div className="text-xs text-gray-500 mb-4">Preview: {email.previewText}</div>
                                  <div className="border-t pt-4">
                                    <div className="bg-slate-700 text-white p-4 rounded-lg text-center mb-4">
                                      <h3 className="font-bold text-lg">{email.content.headline}</h3>
                                      <p className="text-sm mt-2">{email.content.discount}</p>
                                    </div>
                                    <button className="w-full bg-slate-600 text-white py-2 px-4 rounded font-medium hover:bg-slate-700">
                                      {email.content.ctaText}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {isEditing && (
                                <div className="space-y-3">
                                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Image size={14} />
                                    Change Hero Image
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Sparkles size={14} />
                                    Regenerate Content
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Zap size={14} />
                                    A/B Test Subject Line
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <BarChart3 size={16} />
                              Performance Prediction
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <h5 className="font-medium text-gray-800 mb-3">Expected Metrics</h5>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Open Rate</span>
                                    <span className="font-semibold text-gray-900">{email.metrics.expectedOpenRate}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Click Rate</span>
                                    <span className="font-semibold text-gray-900">{email.metrics.expectedClickRate}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Conversions</span>
                                    <span className="font-semibold text-gray-900">{email.metrics.expectedConversions}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <h5 className="font-medium text-gray-800 mb-3">Send Configuration</h5>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Template</span>
                                    <span className="text-sm font-medium">{email.template}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Audience Segment</span>
                                    <span className="text-sm font-medium">Halloween Shoppers</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Time Zone</span>
                                    <span className="text-sm font-medium">Recipient Local</span>
                                  </div>
                                </div>
                              </div>

                              {isEditing && (
                                <div className="space-y-2">
                                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Settings size={14} />
                                    Advanced Settings
                                  </button>
                                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Clock size={14} />
                                    Change Send Time
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Audience & Segmentation */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audience & Segmentation</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Target Audience</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-gray-900">Primary Segment (65%)</div>
                    <div className="text-sm text-gray-600">Millennials (25-35), Halloween enthusiasts</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-gray-900">Secondary Segment (35%)</div>
                    <div className="text-sm text-gray-600">Gen Z (18-25), seasonal shoppers</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Engagement Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Personalization</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dynamic Content</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Send Time Optimization</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium border border-slate-200">AI-Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}