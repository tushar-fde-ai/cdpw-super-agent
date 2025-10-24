# Marketing Super Agent

AI-powered marketing platform with specialized agents for campaign strategy, audience analysis, and journey orchestration.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure

### `/app` - Next.js App Router Pages

Main application routes using Next.js 15 App Router.

- **`/app/page.tsx`** - Landing page with hero section and feature showcase
- **`/app/start/page.tsx`** - Dashboard homepage with campaign input, quick start options, and task manager table
- **`/app/chat/page.tsx`** - Main chat interface for campaign generation and execution
- **`/app/approvals/[id]/page.tsx`** - Approval workflow page for reviewing and approving campaign briefs
- **`/app/journey-builder/page.tsx`** - Visual journey builder for campaign automation

---

### `/components` - Reusable React Components

#### `/components/chat` - Chat Interface Components

Core chat functionality and specialized interfaces.

- **`ChatLayout.tsx`** - Main chat container managing conversation state, messages, and routing between different chat modes
- **`ChatHeader.tsx`** - Header with TD logo, app title, and navigation to dashboard
- **`ConversationArea.tsx`** - Message display area with auto-scrolling and message rendering
- **`MessageInput.tsx`** - Text input with PDF attachment support for campaign briefs
- **`ChatInput.tsx`** - Legacy input component (being replaced by MessageInput)
- **`CampaignExecutionInterface.tsx`** - Specialized UI for campaign execution with agent selection, workflow building, and journey activation
- **`CompetitiveResearchInterface.tsx`** - Split-screen interface for competitive intelligence analysis

**`/components/chat/messages`** - Message Components
- **`MessageBubble.tsx`** - Individual message display with sender styling
- **`BudgetInputMessage.tsx`** - Interactive budget selection interface
- **`QuickActionsMessage.tsx`** - Action buttons for campaign operations (download, approve, execute)
- **`types.ts`** - TypeScript types for message objects

**`/components/chat/document-viewer`** - Document Viewer Modal
- **`DocumentViewerModal.tsx`** - Full-screen modal for viewing campaign briefs with PDF download
- **`DocumentContent.tsx`** - Displays formatted campaign brief content
- **`DocumentSidebar.tsx`** - Quick actions (share, download) and approval workflow controls
- **`ApprovalWorkflowPanel.tsx`** - Interface for setting up approval workflows
- **`types.ts`** - TypeScript types for document viewer
- **`sampleData.ts`** - Mock campaign brief data

**`/components/chat/orchestration`** - Agent Orchestration Panel
- **`OrchestrationPanel.tsx`** - Real-time agent collaboration tracking
- **`WorkflowProgress.tsx`** - Visual progress indicator for multi-agent workflows
- **`types.ts`** - TypeScript types for orchestration

#### `/components/campaign-execution` - Campaign Execution Modules

Detailed configuration interfaces for campaign execution.

- **`EmailSeriesConfig.tsx`** - Email campaign configuration and preview
- **`SocialMediaConfig.tsx`** - Social media campaign settings
- **`CampaignAnalyticsConfig.tsx`** - Analytics and tracking setup
- **`AudienceTargetingDetail.tsx`** - Hyper-personalized audience segment configuration

#### `/components/start` - Start Page Components

- **`TaskDetailModal.tsx`** - Modal displaying campaign details and recommended actions (view chat, competitive research, build campaign, view brief)

#### `/components/journey-builder` - Journey Builder Components

- **`JourneyBuilderLayout.tsx`** - Main layout for visual campaign journey design
- **`CanvasArea.tsx`** - Drag-and-drop canvas for journey steps
- **`Sidebar.tsx`** - Journey builder tools and step library
- **`StepNode.tsx`** - Individual journey step component
- **`types.ts`** - TypeScript types for journey builder

#### `/components/landing` - Landing Page Components

- **`HeroSection.tsx`** - Landing page hero with CTA
- **`FeaturesGrid.tsx`** - Feature showcase section
- **`CTASection.tsx`** - Call-to-action section

#### `/components/demo` - Demo Flow Components

- **`DemoFlowPlayer.tsx`** - Automated demo playback for product demonstrations

#### `/components/ui` - Shared UI Components

Reusable UI components and primitives.

---

### `/lib` - Utility Libraries

- **`demo-flows.ts`** - Demo flow configurations and utilities
- **`utils.ts`** - General utility functions

---

### `/public` - Static Assets

- **`/public/logos/td-icon.png`** - Treasure Data logo for branding

---

## Key Features

### 1. Campaign Generation
- Interactive chat interface with AI agents
- Budget selection and audience targeting
- Multi-agent collaboration (Strategy, Audience, Analytics, Journey, Content)
- Real-time workflow progress tracking

### 2. Campaign Execution
- Agent-based campaign building from approved briefs
- PDF campaign brief upload support
- Application integration (Engage Suite, Creative Suite, Journey Builder)
- Journey step configuration with detailed settings

### 3. Approval Workflows
- Multi-approver support with individual status tracking
- Email notifications to approvers
- Comments and feedback collection
- Document viewer integration

### 4. Task Management
- Table-based task manager with status tracking
- Approval-based execution blocking
- Campaign status monitoring (Planning, Approval, Execution)
- Quick actions modal for each campaign

### 5. Document Management
- Campaign brief viewer with formatted content
- Direct PDF download with jsPDF
- Share link generation
- Approval workflow setup from document viewer

---

## Technology Stack

- **Next.js 15.5.5** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **jsPDF** - Client-side PDF generation

---

## Key Workflows

### Campaign Creation Flow
1. User enters campaign goals on `/start` page
2. AI agents collaborate to create comprehensive brief
3. Budget selection and audience analysis
4. Campaign brief generated with download option
5. Approval workflow can be initiated

### Campaign Execution Flow
1. User clicks "Build Campaign" from approved brief
2. Campaign execution interface loads
3. User uploads PDF brief (optional)
4. Agents automatically select and configure
5. Journey steps built and connected to applications
6. "Activate Campaign Now" opens Journey Builder in new tab

### Approval Flow
1. User sets up approval workflow from document viewer
2. Approvers receive email with approval link
3. Approvers review brief and approve/reject
4. Status updates in real-time via localStorage polling
5. Campaign execution unlocks after approval

---

## Development Notes

- Campaign state persists in localStorage (key: `msa_has_campaigns`)
- Approval status polling interval: 2 seconds
- PDF attachments limited to `application/pdf` type
- Journey Builder opens in new tab on activation
- Task manager updates dynamically based on approval status
