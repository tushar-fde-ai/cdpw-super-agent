'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Users, DollarSign, TrendingUp, Globe, Package, MessageSquare,
  BarChart3, GitBranch, CheckCircle, AlertTriangle, Info, ChevronRight,
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
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [sectionData, setSectionData] = useState<Record<number, any>>({});
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
      title: 'Metrics and KPIs',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Set success metrics and benchmarks'
    },
    {
      id: 8,
      title: 'Pipeline and Funnel',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Model pipeline and conversion funnel'
    },
    {
      id: 9,
      title: 'Competitive Analysis',
      icon: <Award className="w-5 h-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Analyze competitive landscape'
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

  const handleSectionClick = (sectionId: number) => {
    setCurrentSection(sectionId);
  };

  const handleNextSection = () => {
    if (currentSection < sections.length) {
      setCompletedSections(prev => [...prev, currentSection]);
      setCurrentSection(currentSection + 1);
    }
  };

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

        {/* Section Header */}
        {currentSection > 0 && currentSection <= sections.length && (
          <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${sections[currentSection - 1].bgColor}`}>
                {sections[currentSection - 1].icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {sections[currentSection - 1].title}
                </h3>
                <p className="text-xs text-gray-600">
                  Section {currentSection} of {sections.length}
                </p>
              </div>
            </div>
          </div>
        )}

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
            isLoading={isLoading}
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
            {propDocumentSections.length > 0 && (
              <div className="text-right">
                <div className="text-xs text-slate-300">Sections Complete</div>
                <div className="text-2xl font-bold text-white">
                  {propDocumentSections.length} / {sections.length}
                </div>
              </div>
            )}
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
                      <div className={`p-2 rounded-lg ${sections[docSection.id - 1].bgColor}`}>
                        {sections[docSection.id - 1].icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {index + 1}. {docSection.title}
                        </h3>
                      </div>
                    </div>
                    <div className="pl-14">
                      <div className="max-w-none">
                        {docSection.content.split('\n\n').map((paragraph, pIndex) => {
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
                                  {paragraph}
                                </div>
                              </div>
                            );
                          }

                          if (isHeading) {
                            return (
                              <div key={pIndex} className="mt-6 mb-3 first:mt-0">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                  {paragraph}
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
                                          {line.substring(1).trim()}
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
                                {paragraph}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
