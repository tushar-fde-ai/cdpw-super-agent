import { Suspense } from 'react';
import ChatLayout from '@/components/chat/ChatLayout';

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatLayout />
    </Suspense>
  );
}