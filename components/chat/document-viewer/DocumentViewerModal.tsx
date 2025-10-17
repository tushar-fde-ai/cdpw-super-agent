'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { DocumentViewerModalProps, ApprovalWorkflow } from './types';
import DocumentContent from './DocumentContent';
import DocumentSidebar from './DocumentSidebar';
import ApprovalWorkflowPanel from './ApprovalWorkflowPanel';

export default function DocumentViewerModal({ isOpen, onClose, document: campaignDocument, onActionClick }: DocumentViewerModalProps) {
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasApprovalWorkflow, setHasApprovalWorkflow] = useState(campaignDocument.status !== 'draft');

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !showApprovalPanel) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showApprovalPanel]);

  const handleClose = () => {
    if (showApprovalPanel) {
      setShowApprovalPanel(false);
      return;
    }

    setIsClosing(true);
    // Allow animation to complete before actually closing
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShowApprovalPanel(false);
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !showApprovalPanel) {
      handleClose();
    }
  };

  const handleSidebarAction = (action: string) => {
    switch (action) {
      case 'share-link':
        // Copy share link to clipboard
        const shareUrl = `${window.location.origin}/documents/${campaignDocument.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          console.log('Share link copied to clipboard');
          if (onActionClick) onActionClick('share-link');
        });
        break;

      case 'print':
        // Open print dialog
        window.print();
        if (onActionClick) onActionClick('print');
        break;

      case 'setup-approval':
        setShowApprovalPanel(true);
        break;

      case 'edit-workflow':
        setShowApprovalPanel(true);
        break;

      default:
        console.log('Unhandled action:', action);
    }
  };

  const handleApprovalSubmit = (workflow: ApprovalWorkflow) => {
    console.log('Approval workflow submitted:', workflow);

    // Set that we now have an approval workflow
    setHasApprovalWorkflow(true);

    // Close the approval panel
    setShowApprovalPanel(false);

    // Notify parent component
    if (onActionClick) {
      onActionClick('approval-submitted');
    }

    // Show success message (could be a toast notification)
    alert(`Approval workflow sent to ${workflow.approvers.map(a => a.name).join(', ')}`);
  };

  const handleApprovalCancel = () => {
    setShowApprovalPanel(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
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
          className="relative w-[95vw] h-[95vh] max-w-[1400px] max-h-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: isClosing ? 0.9 : 1, opacity: isClosing ? 0 : 1, y: isClosing ? 20 : 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Header */}
          <motion.header
            className="flex items-center justify-between p-6 border-b border-gray-200 bg-white relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{campaignDocument.title}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full capitalize
                    ${campaignDocument.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${campaignDocument.status === 'pending-approval' ? 'bg-blue-100 text-blue-800' : ''}
                    ${campaignDocument.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {campaignDocument.status.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {campaignDocument.type.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} className="text-gray-600" />
            </motion.button>
          </motion.header>

          {/* Main Content */}
          <div className="flex h-[calc(100%-88px)]">
            {/* Document Content - Left Side (70%) */}
            <div className="flex-1 min-w-0">
              <DocumentContent document={campaignDocument} />
            </div>

            {/* Sidebar - Right Side (30%) */}
            <div className="w-96 flex-shrink-0 relative">
              <AnimatePresence mode="wait">
                {showApprovalPanel ? (
                  <ApprovalWorkflowPanel
                    key="approval-panel"
                    documentId={campaignDocument.id}
                    onSubmit={handleApprovalSubmit}
                    onCancel={handleApprovalCancel}
                  />
                ) : (
                  <DocumentSidebar
                    key="document-sidebar"
                    document={campaignDocument}
                    onAction={handleSidebarAction}
                    hasApprovalWorkflow={hasApprovalWorkflow}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}