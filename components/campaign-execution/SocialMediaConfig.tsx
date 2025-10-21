'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  Users,
  Eye,
  Heart,
  MessageCircle,
  ArrowLeft,
  Edit3,
  Check,
  Image,
  Video,
  Sparkles,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SocialMediaConfigProps {
  onBack: () => void;
  onSave: (config: any) => void;
}

export default function SocialMediaConfig({ onBack, onSave }: SocialMediaConfigProps) {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Social media campaign configured by AI
  const socialCampaign = {
    platforms: [
      {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        color: 'bg-slate-700',
        audience: '185K',
        expectedReach: '142K',
        engagementRate: '4.8%'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: Facebook,
        color: 'bg-slate-700',
        audience: '234K',
        expectedReach: '89K',
        engagementRate: '2.3%'
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: Twitter,
        color: 'bg-slate-700',
        audience: '98K',
        expectedReach: '67K',
        engagementRate: '3.1%'
      }
    ],
    posts: [
      {
        id: 1,
        title: 'Halloween Collection Reveal',
        platform: 'instagram',
        type: 'carousel',
        scheduled: 'October 17, 2025 at 9:00 AM',
        content: {
          caption: '👻 Spook-tacular news! Our Halloween collection is here! Which look will you choose? #Halloween2025 #SpookyStyle',
          hashtags: ['#Halloween2025', '#SpookyStyle', '#HalloweenFashion', '#TrickOrTreat'],
          images: ['halloween-hero.jpg', 'costume-1.jpg', 'costume-2.jpg', 'costume-3.jpg']
        },
        metrics: {
          expectedLikes: '2.8K',
          expectedComments: '156',
          expectedShares: '89',
          expectedReach: '45K'
        },
        status: 'scheduled'
      },
      {
        id: 2,
        title: 'User-Generated Content Campaign',
        platform: 'instagram',
        type: 'story_series',
        scheduled: 'October 19, 2025 at 6:00 PM',
        content: {
          caption: '🎭 Show us your Halloween transformation! Share your costume using #MyHalloweenLook for a chance to be featured!',
          hashtags: ['#MyHalloweenLook', '#HalloweenContest', '#SpookyTransformation'],
          images: ['ugc-template.jpg']
        },
        metrics: {
          expectedLikes: '1.9K',
          expectedComments: '234',
          expectedShares: '156',
          expectedReach: '38K'
        },
        status: 'scheduled'
      },
      {
        id: 3,
        title: 'Halloween Styling Tips Video',
        platform: 'facebook',
        type: 'video',
        scheduled: 'October 22, 2025 at 2:00 PM',
        content: {
          caption: '🎃 Need last-minute Halloween inspiration? Our styling experts share 5 quick costume ideas you can put together today!',
          hashtags: ['#HalloweenTips', '#LastMinuteCostumes', '#StyleHacks'],
          video: 'halloween-styling-tips.mp4'
        },
        metrics: {
          expectedLikes: '1.2K',
          expectedComments: '67',
          expectedShares: '234',
          expectedReach: '52K'
        },
        status: 'scheduled'
      },
      {
        id: 4,
        title: 'Halloween Sale Announcement',
        platform: 'twitter',
        type: 'thread',
        scheduled: 'October 25, 2025 at 11:00 AM',
        content: {
          caption: '🚨 FLASH SALE ALERT! 40% off ALL Halloween items for the next 48 hours! Don\'t let these deals disappear like a ghost! 👻',
          hashtags: ['#HalloweenSale', '#FlashSale', '#LimitedTime'],
          thread: ['Main announcement', 'Product highlights', 'Sale terms', 'Call to action']
        },
        metrics: {
          expectedLikes: '567',
          expectedComments: '89',
          expectedShares: '123',
          expectedReach: '23K'
        },
        status: 'scheduled'
      }
    ]
  };

  const handlePostClick = (postId: number) => {
    setSelectedPost(selectedPost === postId ? null : postId);
  };

  const handleSaveChanges = () => {
    onSave({ socialCampaign });
    setIsEditing(false);
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = socialCampaign.platforms.find(p => p.id === platform);
    return platformData ? platformData.icon : Share2;
  };

  const getPlatformColor = (platform: string) => {
    const platformData = socialCampaign.platforms.find(p => p.id === platform);
    return platformData ? platformData.color : 'bg-gray-500';
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
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Social Media Activation</h1>
              <p className="text-sm text-gray-600">Creative Suite Configuration</p>
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
              {isEditing ? 'Cancel Edit' : 'Edit Campaign'}
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
          {/* Platform Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              {socialCampaign.platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.id} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${platform.color} text-white rounded-lg mb-3`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{platform.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-600">Audience: <span className="font-semibold text-gray-900">{platform.audience}</span></div>
                      <div className="text-gray-600">Expected Reach: <span className="font-semibold text-gray-900">{platform.expectedReach}</span></div>
                      <div className="text-gray-600">Engagement: <span className="font-semibold text-gray-900">{platform.engagementRate}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campaign Timeline */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Content Calendar</h2>
              <p className="text-sm text-gray-600 mt-1">AI-optimized posting schedule across all platforms</p>
            </div>

            <div className="p-6 space-y-4">
              {socialCampaign.posts.map((post, index) => {
                const PlatformIcon = getPlatformIcon(post.platform);
                const platformColor = getPlatformColor(post.platform);

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${platformColor} rounded-lg flex items-center justify-center text-white`}>
                            <PlatformIcon size={20} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            <p className="text-sm text-gray-600 capitalize">{post.type.replace('_', ' ')} • {post.platform}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {post.scheduled}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {post.metrics.expectedReach} reach
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                            {post.status}
                          </span>
                          <div className="text-gray-400">
                            {selectedPost === post.id ? '▼' : '▶'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Post Details */}
                    {selectedPost === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Content Preview */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Image size={16} />
                                Content Preview
                              </h4>
                              <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-6 h-6 ${platformColor} rounded flex items-center justify-center text-white`}>
                                        <PlatformIcon size={14} />
                                      </div>
                                      <span className="font-medium text-gray-900 capitalize">{post.platform}</span>
                                      <span className="text-xs text-gray-500">• {post.type.replace('_', ' ')}</span>
                                    </div>

                                    <div className="text-sm text-gray-800">
                                      {post.content.caption}
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                      {post.content.hashtags.map((tag, i) => (
                                        <span key={i} className="text-xs text-slate-600">{tag}</span>
                                      ))}
                                    </div>

                                    {post.type === 'video' && (
                                      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <div className="text-sm text-gray-600">Video: {post.content.video}</div>
                                      </div>
                                    )}

                                    {post.content.images && (
                                      <div className="grid grid-cols-2 gap-2">
                                        {post.content.images.slice(0, 4).map((img, i) => (
                                          <div key={i} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <div className="text-xs text-gray-600">{img}</div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {isEditing && (
                                  <div className="space-y-2">
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                      <Sparkles size={14} />
                                      Regenerate Content
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                      <Image size={14} />
                                      Change Visuals
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                      <Clock size={14} />
                                      Reschedule Post
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Performance Metrics */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp size={16} />
                                Expected Performance
                              </h4>
                              <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <h5 className="font-medium text-gray-800 mb-3">Engagement Forecast</h5>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <Heart size={14} className="text-gray-500" />
                                        Likes
                                      </span>
                                      <span className="font-semibold text-gray-900">{post.metrics.expectedLikes}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <MessageCircle size={14} className="text-gray-500" />
                                        Comments
                                      </span>
                                      <span className="font-semibold text-gray-900">{post.metrics.expectedComments}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <Share2 size={14} className="text-gray-500" />
                                        Shares
                                      </span>
                                      <span className="font-semibold text-gray-900">{post.metrics.expectedShares}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600 flex items-center gap-2">
                                        <Eye size={14} className="text-gray-500" />
                                        Reach
                                      </span>
                                      <span className="font-semibold text-gray-900">{post.metrics.expectedReach}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-white rounded-lg border border-gray-200">
                                  <h5 className="font-medium text-gray-800 mb-3">Optimization Insights</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                      <span className="text-gray-600">Optimal posting time</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                      <span className="text-gray-600">High engagement hashtags</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                      <span className="text-gray-600">Brand voice aligned</span>
                                    </div>
                                  </div>
                                </div>

                                {isEditing && (
                                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors border border-slate-200">
                                    <Target size={14} />
                                    Advanced Targeting
                                  </button>
                                )}
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
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4</div>
                <div className="text-sm text-gray-600">Scheduled Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">298K</div>
                <div className="text-sm text-gray-600">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5.2K</div>
                <div className="text-sm text-gray-600">Expected Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">602</div>
                <div className="text-sm text-gray-600">Expected Shares</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}