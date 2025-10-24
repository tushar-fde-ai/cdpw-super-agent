'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Search, Zap, FileText, Bot, Users, Target, Calendar } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  agents: string[];
  timestamp: Date;
  budget: string;
  targetAudience: string;
  description: string;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onActionClick: (taskId: number, action: string) => void;
  isApproved?: boolean;
}

export default function TaskDetailModal({ isOpen, onClose, task, onActionClick, isApproved = false }: TaskDetailModalProps) {
  if (!task) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-[90vw] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-2xl font-semibold text-black">{task.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Status and Timestamp */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Created {formatTimeAgo(task.timestamp)}
                  </span>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-slate-700" />
                    <div>
                      <p className="text-xs text-gray-600">Target Audience</p>
                      <p className="text-sm font-medium text-black">{task.targetAudience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-slate-700" />
                    <div>
                      <p className="text-xs text-gray-600">Budget</p>
                      <p className="text-sm font-medium text-black">{task.budget}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agents Used */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-black mb-3">Agents Used</h3>
                <div className="flex flex-wrap gap-2">
                  {task.agents.map((agent, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-black border border-gray-300"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Recommended Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onActionClick(task.id, 'view-chat')}
                    className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 hover:border-slate-400 text-black rounded-lg border border-gray-300 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-slate-100">
                      <MessageCircle className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">View Chat History</p>
                      <p className="text-xs text-gray-600">Review conversation</p>
                    </div>
                  </button>

                  <button
                    onClick={() => onActionClick(task.id, 'competitive-intelligence')}
                    className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 hover:border-slate-400 text-black rounded-lg border border-gray-300 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-slate-100">
                      <Search className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Competitive Intelligence</p>
                      <p className="text-xs text-gray-600">Research competitors</p>
                    </div>
                  </button>

                  <button
                    onClick={() => isApproved && onActionClick(task.id, 'build-campaign')}
                    disabled={!isApproved}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 group ${
                      isApproved
                        ? 'bg-white hover:bg-slate-50 hover:border-slate-400 text-black border-gray-300 cursor-pointer'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title={!isApproved ? 'Campaign must be approved before execution' : ''}
                  >
                    <div className={`p-2 rounded-lg ${
                      isApproved ? 'bg-gray-100 group-hover:bg-slate-100' : 'bg-gray-200'
                    }`}>
                      <Zap className={`w-5 h-5 ${isApproved ? 'text-slate-700' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">Build Campaign</p>
                      <p className="text-xs text-gray-600">
                        {isApproved ? 'Execute strategy' : 'Requires approval'}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => onActionClick(task.id, 'view-brief')}
                    className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50 hover:border-slate-400 text-black rounded-lg border border-gray-300 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-slate-100">
                      <FileText className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">View Campaign Brief</p>
                      <p className="text-xs text-gray-600">Review details</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
