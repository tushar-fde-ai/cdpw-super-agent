'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  TrendingDown,
  MapPin,
  ArrowLeft,
  Sparkles,
  BarChart3,
  AlertTriangle,
  Zap,
  Mail,
  MessageSquare,
  ShoppingBag,
  Heart,
  DollarSign,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';

interface AudienceTargetingDetailProps {
  onBack: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (config: any) => void;
}

export default function AudienceTargetingDetail({ onBack, onSave }: AudienceTargetingDetailProps) {
  const [selectedSubSegment, setSelectedSubSegment] = useState<string | null>(null);

  // High churn user segment in United States
  const audienceSegment = {
    name: 'High Churn Risk - United States',
    totalSize: '42,847',
    churnProbability: '73%',
    location: 'United States',
    averageLifetimeValue: '$1,247',
    avgDaysSinceLastPurchase: '87 days',
    riskFactors: [
      'No purchase in 60+ days',
      'Email engagement declining',
      'Reduced website visits',
      'Abandoned cart (3x in last month)'
    ]
  };

  // Sub-segments for hyper-personalization
  const subSegments = [
    {
      id: 'price-sensitive',
      name: 'Price-Sensitive Shoppers',
      size: '14,567',
      percentage: '34%',
      icon: DollarSign,
      color: 'bg-green-500',
      characteristics: [
        'Respond well to discount offers',
        'Cart abandonment due to price',
        'Previously used promo codes frequently'
      ],
      personalizationStrategy: {
        emailSubject: 'Exclusive 25% Discount Just for You',
        contentFocus: 'Price-driven messaging with urgency',
        offerType: 'Tiered discounts (15-30% off)',
        timing: 'Send during evening hours (6-9 PM)',
        channels: ['Email', 'SMS', 'Push Notifications']
      },
      expectedImpact: {
        reactivationRate: '31%',
        expectedRevenue: '$182K',
        costPerReactivation: '$12.50'
      }
    },
    {
      id: 'product-explorers',
      name: 'Product Explorers',
      size: '12,234',
      percentage: '29%',
      icon: Eye,
      color: 'bg-blue-500',
      characteristics: [
        'High browse-to-purchase ratio',
        'Need product recommendations',
        'Engaged with new arrivals section'
      ],
      personalizationStrategy: {
        emailSubject: 'New Products Curated for Your Style',
        contentFocus: 'Personalized product recommendations',
        offerType: 'Free shipping + early access to new collections',
        timing: 'Send during weekday mornings (9-11 AM)',
        channels: ['Email', 'Website Personalization', 'Retargeting Ads']
      },
      expectedImpact: {
        reactivationRate: '27%',
        expectedRevenue: '$156K',
        costPerReactivation: '$9.75'
      }
    },
    {
      id: 'seasonal-buyers',
      name: 'Seasonal Buyers',
      size: '10,891',
      percentage: '25%',
      icon: Calendar,
      color: 'bg-purple-500',
      characteristics: [
        'Purchase during specific seasons',
        'Halloween purchases in past years',
        'Triggered by seasonal campaigns'
      ],
      personalizationStrategy: {
        emailSubject: 'Halloween is Here - Your Favorites are Back!',
        contentFocus: 'Seasonal urgency + nostalgia marketing',
        offerType: 'Limited-time seasonal bundle deals',
        timing: 'Send 2 weeks before Halloween',
        channels: ['Email', 'Social Media', 'Display Ads']
      },
      expectedImpact: {
        reactivationRate: '38%',
        expectedRevenue: '$215K',
        costPerReactivation: '$8.25'
      }
    },
    {
      id: 'engagement-seekers',
      name: 'Engagement Seekers',
      size: '5,155',
      percentage: '12%',
      icon: Heart,
      color: 'bg-pink-500',
      characteristics: [
        'Value brand connection',
        'Engage with social media content',
        'Respond to interactive campaigns'
      ],
      personalizationStrategy: {
        emailSubject: 'We Miss You! Share Your Style & Win',
        contentFocus: 'Community-driven engagement + contests',
        offerType: 'UGC campaign participation rewards',
        timing: 'Send during weekend (Saturday afternoon)',
        channels: ['Social Media', 'Email', 'Community Forum']
      },
      expectedImpact: {
        reactivationRate: '22%',
        expectedRevenue: '$67K',
        costPerReactivation: '$15.00'
      }
    }
  ];

  const handleSubSegmentClick = (id: string) => {
    setSelectedSubSegment(selectedSubSegment === id ? null : id);
  };

  const handleSaveConfiguration = () => {
    onSave({
      segment: audienceSegment,
      subSegments,
      selectedSubSegments: selectedSubSegment ? [selectedSubSegment] : []
    });
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
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Audience Targeting & Hyper-Personalization</h1>
              <p className="text-sm text-gray-500">Segment Analytics Configuration</p>
            </div>
          </div>
          <button
            onClick={handleSaveConfiguration}
            className="px-4 py-2 bg-slate-700 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Zap size={16} className="inline mr-2" />
            Apply Personalization
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Segment Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{audienceSegment.name}</h2>
                <p className="text-sm text-gray-500">High-value customers at risk of churning</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Users className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{audienceSegment.totalSize}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <TrendingDown className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{audienceSegment.churnProbability}</div>
                <div className="text-sm text-gray-600">Churn Risk</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <DollarSign className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{audienceSegment.averageLifetimeValue}</div>
                <div className="text-sm text-gray-600">Avg. LTV</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                <MapPin className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{audienceSegment.location}</div>
                <div className="text-sm text-gray-600">Location</div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                Key Churn Risk Factors
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {audienceSegment.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hyper-Personalization Strategy */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-gray-900">Hyper-Personalization Sub-Segments</h2>
              </div>
              <p className="text-sm text-gray-500">AI-identified behavioral segments with tailored engagement strategies</p>
            </div>

            <div className="p-6 space-y-4">
              {subSegments.map((segment, index) => {
                const Icon = segment.icon;
                const isSelected = selectedSubSegment === segment.id;

                return (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      isSelected ? 'border-slate-300 shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => handleSubSegmentClick(segment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white">
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">{segment.size} users</span>
                              <span className="text-sm font-semibold text-slate-700">{segment.percentage} of segment</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {isSelected ? '▼' : '▶'}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Sub-Segment Details */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Characteristics & Strategy */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <Filter size={16} />
                                  Behavioral Characteristics
                                </h4>
                                <div className="space-y-2">
                                  {segment.characteristics.map((char, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                                      <span>{char}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-white rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <Sparkles size={16} className="text-purple-600" />
                                  Personalization Strategy
                                </h4>
                                <div className="space-y-3 text-sm">
                                  <div>
                                    <span className="text-gray-600">Email Subject:</span>
                                    <div className="font-medium text-gray-900 mt-1">&quot;{segment.personalizationStrategy.emailSubject}&quot;</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Content Focus:</span>
                                    <div className="font-medium text-gray-900 mt-1">{segment.personalizationStrategy.contentFocus}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Offer Type:</span>
                                    <div className="font-medium text-gray-900 mt-1">{segment.personalizationStrategy.offerType}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Optimal Timing:</span>
                                    <div className="font-medium text-gray-900 mt-1">{segment.personalizationStrategy.timing}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Channels:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {segment.personalizationStrategy.channels.map((channel, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                                          {channel}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Expected Impact */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <BarChart3 size={16} />
                                Expected Impact
                              </h4>
                              <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Reactivation Rate</span>
                                      <div className="text-right">
                                        <span className="text-lg font-bold text-gray-900">{segment.expectedImpact.reactivationRate}</span>
                                        <div className="text-xs text-gray-500">vs. 12% baseline</div>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Expected Revenue</span>
                                      <div className="text-right">
                                        <span className="text-lg font-bold text-gray-900">{segment.expectedImpact.expectedRevenue}</span>
                                        <div className="text-xs text-gray-500">30-day projection</div>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Cost per Reactivation</span>
                                      <div className="text-right">
                                        <span className="text-lg font-bold text-gray-900">{segment.expectedImpact.costPerReactivation}</span>
                                        <div className="text-xs text-gray-500">ROI: 4.8x</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                  <h5 className="font-semibold text-gray-900 mb-2">AI Recommendation</h5>
                                  <p className="text-sm text-gray-700">
                                    This segment shows {segment.expectedImpact.reactivationRate} reactivation potential.
                                    Prioritize {segment.personalizationStrategy.channels[0]} channel for immediate impact.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Campaign Summary */}
          <div className="bg-slate-700 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Overall Hyper-Personalization Impact</h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">$620K</div>
                <div className="text-sm opacity-80">Total Potential Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">29.5%</div>
                <div className="text-sm opacity-80">Avg. Reactivation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">12,654</div>
                <div className="text-sm opacity-80">Expected Reactivations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5.2x</div>
                <div className="text-sm opacity-80">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
