import { Metadata } from 'next';
import JourneyBuilderLayout from '@/components/journey-builder/JourneyBuilderLayout';

export const metadata: Metadata = {
  title: 'Journey Builder - Marketing Super Agent',
  description: 'Build and visualize multi-step marketing campaigns with AI assistance',
};

export default function JourneyBuilderPage() {
  return <JourneyBuilderLayout />;
}