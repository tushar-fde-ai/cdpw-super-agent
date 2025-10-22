'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  FileText,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { DocumentViewerModal } from '@/components/chat/document-viewer';
import { sampleCampaignBrief } from '@/components/chat/document-viewer/sampleData';

interface ApprovalRequest {
  id: string;
  documentId: string;
  documentTitle: string;
  campaignBudget: string;
  requestedBy: string;
  requestedAt: Date;
  dueDate?: Date;
  approvers: Array<{
    id: string;
    name: string;
    email: string;
    title: string;
    status: 'pending' | 'approved' | 'rejected';
    respondedAt?: Date;
    comments?: string;
  }>;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const approvalId = params.id as string;

  const [approval, setApproval] = useState<ApprovalRequest | null>(null);
  const [currentUser] = useState({ id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com' });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  useEffect(() => {
    // Load approval data from localStorage
    const loadApproval = () => {
      try {
        const stored = localStorage.getItem(`approval-${approvalId}`);
        if (stored) {
          const data = JSON.parse(stored);
          // Convert date strings back to Date objects
          data.requestedAt = new Date(data.requestedAt);
          if (data.dueDate) data.dueDate = new Date(data.dueDate);
          setApproval(data);

          // Check if current user has already responded
          const approver = data.approvers.find((a: any) => a.id === currentUser.id);
          if (approver && approver.status !== 'pending') {
            setHasResponded(true);
            setComments(approver.comments || '');
          }
        }
      } catch (error) {
        console.error('Error loading approval:', error);
      }
    };

    loadApproval();
  }, [approvalId, currentUser.id]);

  // Helper function to parse budget string to numeric value
  const parseBudgetToNumber = (budgetString: string): number => {
    if (budgetString.includes('Under')) return 10000;
    else if (budgetString.includes('$10K - $50K')) return 30000;
    else if (budgetString.includes('$50K - $100K')) return 75000;
    else if (budgetString.includes('$100K+')) return 150000;
    return 50000;
  };

  // Helper function to generate dynamic campaign brief document
  const generateCampaignBrief = (budgetString: string) => {
    const totalBudget = parseBudgetToNumber(budgetString);
    const emailBudget = (totalBudget * 0.6).toFixed(0);
    const socialBudget = (totalBudget * 0.4).toFixed(0);
    const revenueTarget = (totalBudget * 3).toFixed(0);

    return {
      ...sampleCampaignBrief,
      content: [
        {
          id: 'exec-summary',
          heading: 'Executive Summary',
          content: `This Halloween 2025 campaign targets millennials aged 25-40 with spooky-themed promotions designed to drive online sales during the peak Halloween shopping season. With a strategic $${Number(totalBudget).toLocaleString()} budget allocated across email marketing and social media channels, we aim to achieve a 15% increase in October revenue compared to last year. Our data-driven approach focuses on high-engagement customer segments who have shown strong seasonal purchasing behavior, leveraging personalized messaging and exclusive Halloween offers to maximize conversion rates.`
        },
        {
          id: 'objectives',
          heading: 'Campaign Objectives',
          content: 'Primary Goal: Drive online sales and increase October revenue by 15% year-over-year\n\nSecondary Goals:\n• Increase email list engagement by 25%\n• Grow social media following by 2,000 new followers\n• Build brand awareness among target demographic\n• Test new creative formats for future seasonal campaigns\n• Achieve customer acquisition cost under $25\n• Maintain brand consistency across all touchpoints'
        },
        ...sampleCampaignBrief.content.slice(2, 6), // Keep audience, strategy, tactics, and metrics sections
        {
          id: 'budget-dynamic',
          heading: 'Budget Allocation',
          content: `Total Campaign Budget: $${Number(totalBudget).toLocaleString()}\n\nEmail Marketing: $${Number(emailBudget).toLocaleString()} (60%)\n• Platform costs: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n• Creative development: $${(Number(emailBudget) * 0.27).toFixed(0).toLocaleString()}\n• Automation setup: $${(Number(emailBudget) * 0.23).toFixed(0).toLocaleString()}\n• A/B testing: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n• Analytics & reporting: $${(Number(emailBudget) * 0.17).toFixed(0).toLocaleString()}\n\nSocial Media: $${Number(socialBudget).toLocaleString()} (40%)\n• Paid advertising: $${(Number(socialBudget) * 0.6).toFixed(0).toLocaleString()}\n• Content creation: $${(Number(socialBudget) * 0.25).toFixed(0).toLocaleString()}\n• Influencer partnerships: $${(Number(socialBudget) * 0.1).toFixed(0).toLocaleString()}\n• Community management: $${(Number(socialBudget) * 0.05).toFixed(0).toLocaleString()}`
        },
        ...sampleCampaignBrief.content.slice(7) // Keep timeline section
      ]
    };
  };

  const handleApprove = async () => {
    if (!approval) return;

    setIsSubmitting(true);
    try {
      // Update approval status
      const updatedApproval = {
        ...approval,
        approvers: approval.approvers.map(approver =>
          approver.id === currentUser.id
            ? {
                ...approver,
                status: 'approved' as const,
                respondedAt: new Date(),
                comments: comments.trim() || undefined
              }
            : approver
        )
      };

      // Check if all approvers have responded
      const allResponded = updatedApproval.approvers.every(a => a.status !== 'pending');
      const allApproved = updatedApproval.approvers.every(a => a.status === 'approved');

      if (allResponded) {
        updatedApproval.status = allApproved ? 'approved' : 'rejected';
      }

      // Save updated approval
      localStorage.setItem(`approval-${approvalId}`, JSON.stringify(updatedApproval));
      setApproval(updatedApproval);
      setHasResponded(true);

      // If all approvers have approved, mark campaign as approved in global state
      if (allResponded && allApproved) {
        localStorage.setItem('campaign-approval-status', JSON.stringify({
          status: 'approved',
          approvalId: approvalId,
          approvedAt: new Date().toISOString(),
          approvedBy: currentUser.name,
          documentId: approval.documentId,
          campaignBudget: approval.campaignBudget
        }));
      }

      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to submit approval. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!approval) return;
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update approval status
      const updatedApproval = {
        ...approval,
        approvers: approval.approvers.map(approver =>
          approver.id === currentUser.id
            ? {
                ...approver,
                status: 'rejected' as const,
                respondedAt: new Date(),
                comments: comments.trim()
              }
            : approver
        ),
        status: 'rejected' as const // Any rejection means the whole approval is rejected
      };

      // Save updated approval
      localStorage.setItem(`approval-${approvalId}`, JSON.stringify(updatedApproval));
      setApproval(updatedApproval);
      setHasResponded(true);

      // In a real app, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to submit rejection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!approval) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading approval request...</p>
        </div>
      </div>
    );
  }

  const currentApprover = approval.approvers.find(a => a.id === currentUser.id);
  const isOverdue = approval.dueDate && new Date() > approval.dueDate;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Campaign Approval Request
              </h1>
              <p className="text-slate-300">{approval.documentTitle}</p>
            </div>

            <div className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
              approval.status === 'approved'
                ? 'bg-green-600 text-white'
                : approval.status === 'rejected'
                ? 'bg-red-600 text-white'
                : isOverdue
                ? 'bg-orange-600 text-white'
                : 'bg-slate-600 text-white'
            }`}>
              {approval.status === 'approved' && '✓ Approved'}
              {approval.status === 'rejected' && '✗ Rejected'}
              {approval.status === 'pending' && (isOverdue ? 'Overdue' : 'Pending Review')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Document Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Details */}
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-slate-600" />
                Campaign Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p className="text-lg font-semibold text-gray-900">{approval.campaignBudget}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Campaign Name</p>
                  <p className="text-gray-900">Halloween 2025 Campaign</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Requested By</p>
                  <p className="text-gray-900">{approval.requestedBy}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Requested On</p>
                  <p className="text-gray-900">
                    {approval.requestedAt.toLocaleDateString()} at {approval.requestedAt.toLocaleTimeString()}
                  </p>
                </div>

                {approval.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {approval.dueDate.toLocaleDateString()}
                      {isOverdue && ' (Overdue)'}
                    </p>
                  </div>
                )}

                {approval.comments && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Request Notes</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm">{approval.comments}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* View Full Campaign Brief Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsDocumentViewerOpen(true)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md"
                >
                  View Full Campaign Brief
                </button>
              </div>
            </motion.div>

            {/* Your Response */}
            {!hasResponded && approval.status === 'pending' && (
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-slate-600" />
                  Your Response
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (Optional for approval, required for rejection)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add your feedback or comments..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Approve</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={20} />
                          <span>Reject</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Response Confirmation */}
            {hasResponded && currentApprover && (
              <motion.div
                className={`rounded-lg shadow-sm border p-6 ${
                  currentApprover.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-start gap-3">
                  {currentApprover.status === 'approved' ? (
                    <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className={`font-semibold mb-2 ${
                      currentApprover.status === 'approved' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      You {currentApprover.status === 'approved' ? 'approved' : 'rejected'} this campaign
                    </h3>
                    {currentApprover.respondedAt && (
                      <p className={`text-sm mb-2 ${
                        currentApprover.status === 'approved' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {currentApprover.respondedAt.toLocaleDateString()} at{' '}
                        {currentApprover.respondedAt.toLocaleTimeString()}
                      </p>
                    )}
                    {currentApprover.comments && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        currentApprover.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-sm font-medium mb-1">Your comments:</p>
                        <p className="text-sm">{currentApprover.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Approvers Status */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-slate-600" />
                Approvers ({approval.approvers.filter(a => a.status !== 'pending').length}/{approval.approvers.length})
              </h2>

              <div className="space-y-3">
                {approval.approvers.map((approver) => (
                  <div
                    key={approver.id}
                    className={`p-4 rounded-lg border ${
                      approver.status === 'approved'
                        ? 'bg-green-50 border-green-200'
                        : approver.status === 'rejected'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{approver.name}</p>
                        <p className="text-xs text-gray-500">{approver.title}</p>
                      </div>
                      {approver.status === 'approved' && (
                        <CheckCircle size={20} className="text-green-600" />
                      )}
                      {approver.status === 'rejected' && (
                        <XCircle size={20} className="text-red-600" />
                      )}
                      {approver.status === 'pending' && (
                        <Clock size={20} className="text-gray-400" />
                      )}
                    </div>

                    <div className={`text-xs font-medium ${
                      approver.status === 'approved'
                        ? 'text-green-700'
                        : approver.status === 'rejected'
                        ? 'text-red-700'
                        : 'text-gray-500'
                    }`}>
                      {approver.status === 'approved' && 'Approved'}
                      {approver.status === 'rejected' && 'Rejected'}
                      {approver.status === 'pending' && 'Pending'}
                    </div>

                    {approver.respondedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {approver.respondedAt.toLocaleDateString()}
                      </p>
                    )}

                    {approver.comments && (
                      <div className="mt-2 p-2 bg-white rounded text-xs text-gray-700">
                        {approver.comments}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {approval && (
        <DocumentViewerModal
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          document={generateCampaignBrief(approval.campaignBudget)}
          onActionClick={() => {}}
        />
      )}
    </div>
  );
}
