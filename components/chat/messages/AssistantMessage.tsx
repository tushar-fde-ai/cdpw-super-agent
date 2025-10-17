'use client';

import MessageBubble from './MessageBubble';
import DocumentPreviewCard from './DocumentPreviewCard';
import ActionButtons from './ActionButtons';
import { AssistantMessageProps } from './types';

export default function AssistantMessage({ message, onActionClick }: AssistantMessageProps) {
  // Format text content with markdown-style formatting
  const formatContent = (content: string) => {
    // Convert **bold** to <strong> tags
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points to proper list items
    const listFormatted = boldFormatted.replace(/^- (.+)$/gm, '• $1');

    return listFormatted;
  };

  // Split content into lines and render with proper formatting
  const renderFormattedContent = (content: string) => {
    const formatted = formatContent(content);
    const lines = formatted.split('\n');

    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;

      return (
        <div
          key={index}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    });
  };

  return (
    <MessageBubble
      content=""
      sender={message.sender}
      timestamp={message.timestamp}
    >
      {/* Render formatted content */}
      <div className="text-sm">
        {renderFormattedContent(message.content)}
      </div>

      {/* Document Preview Card */}
      {message.metadata?.documentData && (
        <div className="mt-3">
          <DocumentPreviewCard
            title={message.metadata.documentData.title}
            description={message.metadata.documentData.description}
            fileType={message.metadata.documentData.fileType}
            onView={() => onActionClick?.('View PDF') || console.log('Review document')}
          />
        </div>
      )}

      {/* Action Buttons */}
      {message.metadata?.actions && message.metadata.actions.length > 0 && (
        <div className="mt-3">
          <ActionButtons
            actions={message.metadata.actions.map(action => ({
              label: action.label,
              variant: action.variant,
              onClick: () => onActionClick?.(action.action || action.label) || console.log(`Action: ${action.action || action.label}`)
            }))}
          />
        </div>
      )}
    </MessageBubble>
  );
}