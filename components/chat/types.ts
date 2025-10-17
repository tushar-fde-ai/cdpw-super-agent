// TypeScript interfaces for chat components

export interface ConversationAreaProps {
  messages: any[];
  isLoading?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}