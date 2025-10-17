export interface Document {
  id: string;
  title: string;
  type: 'campaign-brief' | 'strategy-doc' | 'analysis-report';
  content: DocumentSection[];
  createdAt: Date;
  status: 'draft' | 'pending-approval' | 'approved';
}

export interface DocumentSection {
  id: string;
  heading: string;
  content: string;
  subsections?: DocumentSection[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  role?: 'reviewer' | 'approver';
  avatar?: string;
}

export interface ApprovalWorkflow {
  id: string;
  documentId: string;
  reviewers: TeamMember[];
  approvers: TeamMember[];
  notifications: {
    email: boolean;
    slack: boolean;
    inApp: boolean;
  };
  dueDate?: Date;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes-requested';
}

export interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onActionClick?: (action: string) => void;
}

export interface DocumentContentProps {
  document: Document;
}

export interface DocumentSidebarProps {
  document: Document;
  onAction: (action: string) => void;
  hasApprovalWorkflow?: boolean;
}

export interface ApprovalWorkflowPanelProps {
  onSubmit: (workflow: ApprovalWorkflow) => void;
  onCancel: () => void;
  documentId: string;
}

export interface TeamMemberSelectorProps {
  onSelect: (member: TeamMember, role: 'reviewer' | 'approver') => void;
  selectedMembers: TeamMember[];
}