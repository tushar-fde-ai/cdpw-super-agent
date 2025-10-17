'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Send, X, Mail, MessageCircle, Bell } from 'lucide-react';
import { ApprovalWorkflowPanelProps, TeamMember, ApprovalWorkflow } from './types';
import TeamMemberSelector from './TeamMemberSelector';

export default function ApprovalWorkflowPanel({ onSubmit, onCancel, documentId }: ApprovalWorkflowPanelProps) {
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    inApp: true
  });
  const [dueDate, setDueDate] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default due date (3 days from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

  // Initialize due date if not set
  if (!dueDate) {
    setDueDate(getDefaultDueDate());
  }

  const handleMemberSelect = (member: TeamMember, role: 'reviewer' | 'approver') => {
    // Check if member is already selected
    if (selectedMembers.some(m => m.id === member.id)) {
      return;
    }

    setSelectedMembers(prev => [...prev, { ...member, role }]);
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = async () => {
    // Validation
    const approvers = selectedMembers.filter(m => m.role === 'approver');
    if (approvers.length === 0) {
      alert('At least one approver is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const workflow: ApprovalWorkflow = {
        id: `workflow-${Date.now()}`,
        documentId,
        reviewers: selectedMembers.filter(m => m.role === 'reviewer'),
        approvers: selectedMembers.filter(m => m.role === 'approver'),
        notifications,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        comments: comments.trim() || undefined,
        status: 'pending'
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSubmit(workflow);
    } catch (error) {
      console.error('Error submitting workflow:', error);
      alert('Failed to submit approval workflow. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const approvers = selectedMembers.filter(m => m.role === 'approver');
  const reviewers = selectedMembers.filter(m => m.role === 'reviewer');

  return (
    <motion.div
      className="h-full bg-white flex flex-col"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </motion.button>
          <h2 className="text-xl font-semibold text-gray-900">Set Up Approval Workflow</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Team Members Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviewers & Approvers</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add team members to review and approve this document. At least one approver is required.
          </p>

          <TeamMemberSelector
            onSelect={handleMemberSelect}
            selectedMembers={selectedMembers}
          />

          {/* Selected Members List */}
          {selectedMembers.length > 0 && (
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-sm font-medium text-gray-900">Selected Team Members</h4>

              {/* Approvers */}
              {approvers.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-green-700 uppercase tracking-wide mb-2">
                    Approvers ({approvers.length})
                  </h5>
                  <div className="space-y-2">
                    {approvers.map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
                            {member.avatar || getInitials(member.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Approver
                          </span>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 hover:bg-green-100 rounded transition-colors"
                          >
                            <X size={14} className="text-green-600" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviewers */}
              {reviewers.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">
                    Reviewers ({reviewers.length})
                  </h5>
                  <div className="space-y-2">
                    {reviewers.map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            {member.avatar || getInitials(member.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Reviewer
                          </span>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                          >
                            <X size={14} className="text-blue-600" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.section>

        {/* Notification Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose how team members will be notified about this approval request.
          </p>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Email notification</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.slack}
                onChange={() => handleNotificationChange('slack')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-900">Slack notification</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.inApp}
                onChange={() => handleNotificationChange('inApp')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <Bell size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-900">In-app notification only</span>
              </div>
            </label>
          </div>
        </motion.section>

        {/* Due Date */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Due Date</h3>
          <p className="text-sm text-gray-600 mb-4">
            Set a deadline for the approval process (optional).
          </p>

          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </motion.section>

        {/* Comments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments & Context</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add any additional notes or context for the reviewers (optional).
          </p>

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any notes or context for reviewers..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          />
        </motion.section>
      </div>

      {/* Footer Actions */}
      <motion.div
        className="p-6 border-t border-gray-200 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-3">
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || approvers.length === 0}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all
              ${isSubmitting || approvers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }
            `}
            whileHover={!isSubmitting && approvers.length > 0 ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && approvers.length > 0 ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Send for Review</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            Cancel
          </motion.button>
        </div>

        {approvers.length === 0 && (
          <p className="text-xs text-red-600 mt-2 text-center">
            At least one approver is required to send for review
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}