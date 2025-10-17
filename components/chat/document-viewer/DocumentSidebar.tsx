'use client';

import { motion } from 'framer-motion';
import { Share2, Printer, Settings, FileText, Calendar, Clock, User } from 'lucide-react';
import { DocumentSidebarProps } from './types';

export default function DocumentSidebar({ document, onAction, hasApprovalWorkflow = false }: DocumentSidebarProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending-approval':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const quickActions = [
    {
      id: 'share',
      label: 'Share Link',
      icon: Share2,
      description: 'Copy shareable link',
      action: () => onAction('share-link')
    },
    {
      id: 'print',
      label: 'Print',
      icon: Printer,
      description: 'Print document',
      action: () => onAction('print')
    }
  ];

  return (
    <motion.div
      className="h-full bg-gray-50 border-l border-gray-200 flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quick Actions Section */}
      <motion.section
        className="p-6 border-b border-gray-200 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                className="w-full flex items-center space-x-3 p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <IconComponent size={16} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{action.label}</h4>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Approval Workflow Section */}
      <motion.section
        className="p-6 border-b border-gray-200 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Settings size={18} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
        </div>

        {/* Workflow Status */}
        {document.status === 'draft' && !hasApprovalWorkflow ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                Send this document for review and approval by your team members.
              </p>
              <motion.button
                onClick={() => onAction('setup-approval')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings size={16} />
                <span>Set Up Approval</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(document.status)}`}>
                {document.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            {/* Mock approval workflow info */}
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <User size={14} className="text-gray-500" />
                <span className="text-gray-600">Pending approval from:</span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-xs text-gray-700">• Sarah Chen (CMO)</p>
                <p className="text-xs text-gray-700">• Mike Johnson (Marketing Lead)</p>
              </div>
            </div>

            <motion.button
              onClick={() => onAction('edit-workflow')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings size={16} />
              <span>Edit Workflow</span>
            </motion.button>
          </div>
        )}
      </motion.section>

      {/* Document Info Section */}
      <motion.section
        className="flex-1 p-6 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <FileText size={18} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Document Info</h3>
        </div>

        <div className="space-y-4">
          {/* Created Date */}
          <div className="flex items-start space-x-3">
            <Calendar size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Created</p>
              <p className="text-xs text-gray-500">{formatDate(document.createdAt)}</p>
            </div>
          </div>

          {/* Last Modified */}
          <div className="flex items-start space-x-3">
            <Clock size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Last modified</p>
              <p className="text-xs text-gray-500">{formatDate(document.createdAt)}</p>
            </div>
          </div>

          {/* File Type */}
          <div className="flex items-start space-x-3">
            <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">File type</p>
              <p className="text-xs text-gray-500 capitalize">{document.type.replace('-', ' ')}</p>
            </div>
          </div>

          {/* Generated By */}
          <div className="flex items-start space-x-3">
            <User size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Generated by</p>
              <div className="text-xs text-gray-500 space-y-0.5">
                <p>• Campaign Strategy Agent</p>
                <p>• Audience & Persona Agent</p>
                <p>• Data Analytics Agent</p>
              </div>
            </div>
          </div>

          {/* Document ID */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">Document ID</p>
            <p className="text-xs font-mono text-gray-500 break-all">{document.id}</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="p-4 border-t border-gray-200 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-center text-gray-400">
          Marketing Super Agent
        </p>
      </motion.footer>
    </motion.div>
  );
}