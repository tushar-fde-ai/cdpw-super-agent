'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Users, DollarSign, TrendingUp, Package, MessageSquare,
  CheckCircle, AlertTriangle, Info,
  Building2, Clock, Award, ShieldCheck, Briefcase, FileText
} from 'lucide-react';
import { Message } from './messages/types';
import AssistantMessage from './messages/AssistantMessage';
import UserMessage from './messages/UserMessage';
import QuestionPrompt from './messages/QuestionPrompt';
import MessageInput from './MessageInput';

interface TRGTMInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string, attachment?: File) => void;
  onActionClick: (actionLabel: string) => void;
  documentSections?: Array<{id: number, title: string, content: string}>;
  vocInsights?: Record<number, string[]>;
  conflictAlerts?: Record<number, string[]>;
  uploadedDocument?: { name: string; size: number };
}

// Helper function to parse markdown-style formatting
const parseMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }
    // Add the bold part
    parts.push(<strong key={match.index} className="font-semibold text-slate-900">{match[1]}</strong>);
    currentIndex = boldRegex.lastIndex;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : [text];
};

// Helper component to render dashboard metric tiles
const MetricTile = ({ label, value, subtitle, icon: Icon }: {
  label: string;
  value: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>
}) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-2">
      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</span>
      {Icon && <Icon className="w-4 h-4 text-slate-500" />}
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    {subtitle && <div className="text-xs text-slate-600 mt-1">{subtitle}</div>}
  </div>
);

export default function TRGTMInterface({
  messages,
  isLoading,
  onSendMessage,
  onActionClick,
  documentSections: propDocumentSections = [],
  vocInsights: propVocInsights = {},
  conflictAlerts: propConflictAlerts = {},
  uploadedDocument
}: TRGTMInterfaceProps) {
  const [selectedInsightSection, setSelectedInsightSection] = useState<number>(1);

  // TR GTM Strategy Sections
  const sections = [
    {
      id: 1,
      title: 'Strategic Definition',
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Define business objectives and strategic goals'
    },
    {
      id: 2,
      title: 'Financial Targets',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Set pipeline and revenue targets'
    },
    {
      id: 3,
      title: 'GTM Strategy & Approach',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Define marketing strategy and channels'
    },
    {
      id: 4,
      title: 'Products and Market',
      icon: <Package className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Select products and analyze market'
    },
    {
      id: 5,
      title: 'Audience and Personas',
      icon: <Users className="w-5 h-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Define target audiences and personas'
    },
    {
      id: 6,
      title: 'Key Messaging',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Develop messaging framework'
    },
    {
      id: 7,
      title: 'Pipeline & Funnel',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Model pipeline and conversion funnel'
    },
    {
      id: 8,
      title: 'Competitive Analysis',
      icon: <Award className="w-5 h-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Analyze competitive landscape'
    },
    {
      id: 9,
      title: 'Budget Allocation',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Marketing budget and channel investment'
    },
    {
      id: 10,
      title: 'Approvals & Stakeholders',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      description: 'Setup approval workflow'
    }
  ];


  const handleQuestionSubmit = (answers: string[]) => {
    // If multiple answers, send them as a combined message
    if (answers.length > 1) {
      // For revenue questions, send as: "Current: $X, Target: $Y"
      onSendMessage(answers.join(' | '));
    } else if (answers.length > 0) {
      // Single answer
      onSendMessage(answers[0]);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Left Panel - Chat Interface (35%) */}
      <div className="w-[35%] flex flex-col bg-white border-r border-gray-200 h-full">
        {/* Header - Always visible for debugging */}
        <div className="p-4 border-b border-gray-200 bg-slate-700">
          <h2 className="text-sm font-bold text-white">
            TR GTM Strategy Chat
          </h2>
          <p className="text-xs text-slate-200">
            Messages: {messages.length}
          </p>
        </div>


        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 text-sm">No messages yet</p>
                <p className="text-gray-300 text-xs mt-1">Waiting for conversation to start...</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              // Render user messages
              if (message.sender === 'user') {
                return (
                  <UserMessage
                    key={message.id || index}
                    message={message}
                  />
                );
              }

              // Render question prompts
              if (message.type === 'question') {
                return (
                  <QuestionPrompt
                    key={message.id || index}
                    questions={message.metadata?.questions || []}
                    onSubmit={handleQuestionSubmit}
                    timestamp={message.timestamp}
                    questionOptions={message.metadata?.questionOptions}
                  />
                );
              }

              // Render assistant messages
              return (
                <AssistantMessage
                  key={message.id || index}
                  message={message}
                  onActionClick={onActionClick}
                />
              );
            })
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
              <span className="text-sm">AI agents analyzing...</span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          {uploadedDocument && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{uploadedDocument.name}</p>
                  <p className="text-xs text-blue-700">
                    {(uploadedDocument.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          )}
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={isLoading}
            placeholder="Type your response or click a suggested answer..."
            allowAttachments={!uploadedDocument}
          />
        </div>
      </div>

      {/* Right Panel - Live GTM Strategy Document (65%) */}
      <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-700 to-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Thomson Reuters GTM Strategy
              </h2>
              <p className="text-sm text-slate-200 mt-1">
                Enterprise Go-to-Market Planning Document
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-gray-200 bg-white">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-slate-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(propDocumentSections.length / sections.length) * 100}%` }}
            />
          </div>
        </div>


        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {propDocumentSections.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  GTM Strategy Document
                </h3>
                <p className="text-sm text-gray-500">
                  Your comprehensive GTM strategy will appear here as you complete each section in the conversation.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Document Title */}
              <div className="mb-8 pb-6 border-b-2 border-slate-700">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Thomson Reuters
                </h1>
                <h2 className="text-2xl font-semibold text-slate-700">
                  Go-to-Market Strategy Document
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Generated on {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Document Sections */}
              <div className="space-y-8">
                {propDocumentSections.map((docSection, index) => (
                  <motion.div
                    key={docSection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pb-6 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {/* Use section config if available, otherwise use default FileText icon */}
                      {(() => {
                        const sectionConfig = sections.find(s => s.id === docSection.id);
                        return sectionConfig ? (
                          <div className={`p-2 rounded-lg ${sectionConfig.bgColor}`}>
                            {sectionConfig.icon}
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-slate-50">
                            <FileText className="w-5 h-5 text-slate-600" />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {index + 1}. {docSection.title}
                        </h3>
                      </div>
                    </div>
                    <div className="pl-14">
                      <div className="max-w-none">
                        {/* Check if this is a special content marker */}
                        {docSection.content === 'METRICS_DASHBOARD' ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <MetricTile label="Pipeline Target" value="$24.8M" subtitle="Q2 2025" icon={TrendingUp} />
                            <MetricTile label="Marketing CWD" value="$39M" subtitle="25% of annual" icon={DollarSign} />
                            <MetricTile label="Marketing Budget" value="$2.9M" subtitle="Q2 allocation" icon={Briefcase} />
                            <MetricTile label="MQL Target" value="8,200" subtitle="Marketing qualified leads" icon={Users} />
                            <MetricTile label="SQL Target" value="3,444" subtitle="42% conversion" icon={Target} />
                            <MetricTile label="Win Rate" value="30%" subtitle="Industry: 22%" icon={Award} />
                          </div>
                        ) : docSection.content === 'TARGET_PERSONAS' ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Large Law Firms (1K+ attorneys)</h4>
                                <div className="text-sm text-blue-800 space-y-1">
                                  <p><strong>Decision Makers:</strong> GCs, Legal Ops Directors</p>
                                  <p><strong>Pain Points:</strong> Complex research, time constraints</p>
                                  <p><strong>Value Drivers:</strong> Accuracy, efficiency, comprehensive coverage</p>
                                </div>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-2">Mid-Size Law Firms (100-1K attorneys)</h4>
                                <div className="text-sm text-green-800 space-y-1">
                                  <p><strong>Decision Makers:</strong> Managing Partners, Practice Heads</p>
                                  <p><strong>Pain Points:</strong> Cost management, resource optimization</p>
                                  <p><strong>Value Drivers:</strong> ROI, competitive advantage</p>
                                </div>
                              </div>
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h4 className="font-semibold text-purple-900 mb-2">Corporate Legal Departments</h4>
                                <div className="text-sm text-purple-800 space-y-1">
                                  <p><strong>Decision Makers:</strong> Chief Legal Officers, Legal Ops</p>
                                  <p><strong>Pain Points:</strong> Regulatory compliance, risk management</p>
                                  <p><strong>Value Drivers:</strong> Risk mitigation, cost control</p>
                                </div>
                              </div>
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <h4 className="font-semibold text-orange-900 mb-2">Solo & Small Firms (&lt;100 attorneys)</h4>
                                <div className="text-sm text-orange-800 space-y-1">
                                  <p><strong>Decision Makers:</strong> Solo practitioners, Partners</p>
                                  <p><strong>Pain Points:</strong> Limited resources, time management</p>
                                  <p><strong>Value Drivers:</strong> Ease of use, affordability</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : docSection.content === 'PIPELINE_FUNNEL' ? (
                          <div className="space-y-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                              <h4 className="font-semibold text-slate-900 mb-4">Sales Funnel Model</h4>
                              <div className="space-y-4">
                                {[
                                  { stage: 'Total Addressable Market', value: '$5.1B', conversion: '100%', color: 'bg-blue-500' },
                                  { stage: 'Marketing Qualified Leads', value: '8,200', conversion: '42%', color: 'bg-green-500' },
                                  { stage: 'Sales Qualified Leads', value: '3,444', conversion: '65%', color: 'bg-yellow-500' },
                                  { stage: 'Opportunities Created', value: '2,238', conversion: '30%', color: 'bg-orange-500' },
                                  { stage: 'Closed Won', value: '671', conversion: '100%', color: 'bg-purple-500' }
                                ].map((stage, idx) => (
                                  <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded ${stage.color}`}></div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-900">{stage.stage}</span>
                                        <span className="text-slate-700">{stage.value}</span>
                                      </div>
                                      <div className="text-xs text-slate-600">Conversion: {stage.conversion}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : docSection.content === 'BUDGET_ALLOCATION' ? (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                <h4 className="font-semibold text-slate-900 mb-4">Marketing Budget Breakdown</h4>
                                <div className="space-y-3">
                                  {[
                                    { category: 'Digital Advertising', amount: '$1.2M', percentage: '41%', color: 'bg-blue-500' },
                                    { category: 'Content & Creative', amount: '$580K', percentage: '20%', color: 'bg-green-500' },
                                    { category: 'Events & Conferences', amount: '$435K', percentage: '15%', color: 'bg-purple-500' },
                                    { category: 'Sales Enablement', amount: '$290K', percentage: '10%', color: 'bg-orange-500' },
                                    { category: 'Marketing Technology', amount: '$260K', percentage: '9%', color: 'bg-yellow-500' },
                                    { category: 'Research & Analytics', amount: '$145K', percentage: '5%', color: 'bg-pink-500' }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                                        <span className="text-sm font-medium text-slate-900">{item.category}</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-slate-900">{item.amount}</div>
                                        <div className="text-xs text-slate-600">{item.percentage}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                                <h4 className="font-semibold text-slate-900 mb-4">Channel Investment</h4>
                                <div className="space-y-3">
                                  {[
                                    { channel: 'Search (SEM/SEO)', investment: '$650K', roi: '4.2x', color: 'bg-emerald-500' },
                                    { channel: 'LinkedIn Advertising', investment: '$380K', roi: '3.8x', color: 'bg-blue-600' },
                                    { channel: 'Industry Publications', investment: '$220K', roi: '2.9x', color: 'bg-indigo-500' },
                                    { channel: 'Webinars & Virtual Events', investment: '$180K', roi: '3.5x', color: 'bg-purple-600' },
                                    { channel: 'Email Marketing', investment: '$85K', roi: '5.1x', color: 'bg-teal-500' },
                                    { channel: 'Account-Based Marketing', investment: '$395K', roi: '6.2x', color: 'bg-red-500' }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded ${item.color}`}></div>
                                        <span className="text-sm font-medium text-slate-900">{item.channel}</span>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold text-slate-900">{item.investment}</div>
                                        <div className="text-xs text-green-600">ROI: {item.roi}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : docSection.content === 'MARKET_OPPORTUNITY' ? (
                          <div className="space-y-3">
                            {[
                              { segment: 'Solo & Small Law Firms (SLF)', tam: '$1.2B TAM', target: '$4.5M pipeline', firms: '45,000 firms' },
                              { segment: 'Mid-Size Law Firms (MLF)', tam: '$1.8B TAM', target: '$8.2M pipeline', firms: '8,000 firms' },
                              { segment: 'Global & Large Law Firms (GLLF)', tam: '$1.1B TAM', target: '$6.8M pipeline', firms: '500 firms' },
                              { segment: 'Legal Professional Corps (LPC)', tam: '$600M TAM', target: '$3.1M pipeline', firms: 'Boutique practices' },
                              { segment: 'Legal Professional Enterprises (LPE)', tam: '$300M TAM', target: '$2.2M pipeline', firms: 'Corporate legal depts' }
                            ].map((seg, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 mb-1">{seg.segment}</h4>
                                    <div className="text-sm text-slate-600">{seg.firms}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-slate-900">{seg.target}</div>
                                    <div className="text-xs text-slate-600">{seg.tam}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : docSection.content.split('\n\n').map((paragraph, pIndex) => {
                          // Check if this is a segment identifier (first line like "Tax & Accounting Professionals")
                          const isSegmentId = pIndex === 0 &&
                            (paragraph.includes('Tax & Accounting Professionals') ||
                             paragraph.includes('Legal Professionals') ||
                             paragraph.includes('Corporate (Tax, Legal, Risk & Fraud)') ||
                             paragraph.includes('Reuters News') ||
                             paragraph.includes('Government'));

                          // Check if this is a heading
                          const isHeading = paragraph.length < 60 &&
                            (paragraph.startsWith('Objective') ||
                             paragraph.startsWith('Strategic Definition') ||
                             paragraph.startsWith('Target Customer Profile') ||
                             paragraph.startsWith('Unique Value Proposition') ||
                             paragraph.startsWith('Strategic Rationale') ||
                             paragraph.startsWith('Key Success Factors') ||
                             paragraph.startsWith('Market Context'));

                          // Check if this is a value proposition (quoted text)
                          const isValueProp = paragraph.startsWith('"') && paragraph.endsWith('"');

                          // Check if this is a bullet list section
                          const isBulletSection = paragraph.includes('\n•');

                          if (isSegmentId) {
                            return (
                              <div key={pIndex} className="mb-6 pb-3 border-b border-slate-300">
                                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                  Target Segment
                                </div>
                                <div className="text-base font-bold text-slate-900">
                                  {parseMarkdown(paragraph)}
                                </div>
                              </div>
                            );
                          }

                          if (isHeading) {
                            return (
                              <div key={pIndex} className="mt-6 mb-3 first:mt-0">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                  {parseMarkdown(paragraph)}
                                </h4>
                              </div>
                            );
                          }

                          if (isValueProp) {
                            return (
                              <div key={pIndex} className="my-6 p-5 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                                <p className="text-base font-medium text-blue-900 italic leading-relaxed">
                                  {paragraph}
                                </p>
                              </div>
                            );
                          }

                          if (isBulletSection) {
                            const lines = paragraph.split('\n');
                            return (
                              <div key={pIndex} className="my-4">
                                {lines.map((line, lIndex) => {
                                  if (line.startsWith('•')) {
                                    return (
                                      <div key={lIndex} className="flex items-start gap-3 mb-3">
                                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-600 mt-2"></div>
                                        <p className="flex-1 text-gray-700 leading-relaxed">
                                          {parseMarkdown(line.substring(1).trim())}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            );
                          }

                          return (
                            <div key={pIndex} className="my-4">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {parseMarkdown(paragraph)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Funnel Performance Benchmarks */}
              {propDocumentSections.length > 0 && (
                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Funnel Performance Benchmarks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricTile
                      label="Lead Conversion"
                      value="18.5%"
                      subtitle="Industry: 14.2%"
                      icon={TrendingUp}
                    />
                    <MetricTile
                      label="MQL to SQL"
                      value="42%"
                      subtitle="Target: 40%"
                      icon={Target}
                    />
                    <MetricTile
                      label="SQL to Opportunity"
                      value="65%"
                      subtitle="Benchmark: 58%"
                      icon={Award}
                    />
                    <MetricTile
                      label="Opportunity to Win"
                      value="30%"
                      subtitle="Industry: 22%"
                      icon={CheckCircle}
                    />
                    <MetricTile
                      label="Average Deal Size"
                      value="$125K"
                      subtitle="vs $98K avg"
                      icon={DollarSign}
                    />
                    <MetricTile
                      label="Sales Cycle"
                      value="127 days"
                      subtitle="Target: 120 days"
                      icon={Clock}
                    />
                    <MetricTile
                      label="Customer LTV"
                      value="$485K"
                      subtitle="3-year avg"
                      icon={Users}
                    />
                    <MetricTile
                      label="CAC Payback"
                      value="8.2 months"
                      subtitle="Target: 12mo"
                      icon={TrendingUp}
                    />
                  </div>
                </div>
              )}

              {/* Insights and Alerts */}
              {(Object.keys(propVocInsights).length > 0 || Object.keys(propConflictAlerts).length > 0) && (
                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Strategic Insights & Alerts
                  </h3>

                  {/* Section Tabs */}
                  {propDocumentSections.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {propDocumentSections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => setSelectedInsightSection(section.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedInsightSection === section.id
                              ? 'bg-slate-700 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {section.id}. {section.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Display insights for selected section */}
                  {propConflictAlerts[selectedInsightSection] && propConflictAlerts[selectedInsightSection].length > 0 && (
                    <div className="mb-4 space-y-2">
                      {propConflictAlerts[selectedInsightSection].map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-orange-900">{alert}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {propVocInsights[selectedInsightSection] && propVocInsights[selectedInsightSection].length > 0 && (
                    <div className="space-y-2">
                      {propVocInsights[selectedInsightSection].map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-900">{insight}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No insights message */}
                  {(!propVocInsights[selectedInsightSection] || propVocInsights[selectedInsightSection].length === 0) &&
                   (!propConflictAlerts[selectedInsightSection] || propConflictAlerts[selectedInsightSection].length === 0) && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No insights available for this section yet.
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {propDocumentSections && propDocumentSections.length > 0 && (
                <div className="mt-6 p-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => onActionClick('download-tr-gtm-report')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Download GTM Strategy Report
                    </button>
                    <button
                      onClick={() => onActionClick('setup-tr-gtm-approval')}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Set Up Approval Workflow
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
