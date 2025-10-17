// TypeScript interfaces for chat components
import { Message } from './messages/types';

export interface ConversationAreaProps {
  messages: Message[];
  isLoading?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}