'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivationBar from './ActivationBar';
import JourneySidebar from './JourneySidebar';
import JourneyCanvas from './JourneyCanvas';
import StepDetailsDrawer from './StepDetailsDrawer';
import ActivationModal from './ActivationModal';
import { sampleCampaign, halloweenJourney, sampleMessages } from './sampleData';
import { JourneyNode } from './types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function JourneyBuilderLayout() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [journeyNodes] = useState<JourneyNode[]>(halloweenJourney);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);

  const selectedNode = selectedNodeId
    ? journeyNodes.find(node => node.id === selectedNodeId) || null
    : null;

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: "I understand your request. Let me help you modify the journey accordingly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
    setSelectedNodeId(nodeId);
    setIsDrawerOpen(true);
  };

  const handleCanvasClick = () => {
    console.log('Canvas clicked');
    setSelectedNodeId(null);
    setIsDrawerOpen(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedNodeId(null);
  };

  const handleEditStep = () => {
    // Handle step editing logic
    console.log('Edit step:', selectedNodeId);
  };

  const handlePreview = () => {
    console.log('Preview journey');
  };

  const handleSave = () => {
    console.log('Save as draft');
  };

  const handleActivate = () => {
    setShowActivationModal(true);
  };

  const handleActivationConfirm = () => {
    setShowActivationModal(false);
    // Here you would integrate with your backend to actually activate the campaign
    console.log('Campaign activated successfully!');

    // Notify main chat about activation
    const activationData = {
      type: 'campaign-activated',
      campaign: sampleCampaign,
      timestamp: new Date(),
      message: `🎉 Great news! Your ${sampleCampaign.name} has been successfully activated and is now live! The campaign is reaching ${sampleCampaign.audienceSize.toLocaleString()} contacts across ${sampleCampaign.channels.join(' and ')}.`
    };

    localStorage.setItem('campaign-activation', JSON.stringify(activationData));

    // Trigger storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'campaign-activation',
      newValue: JSON.stringify(activationData),
      storageArea: localStorage
    }));
  };

  const handleActivationSchedule = (date: Date) => {
    setShowActivationModal(false);
    console.log('Campaign scheduled for:', date);

    // Notify main chat about scheduling
    const scheduleData = {
      type: 'campaign-scheduled',
      campaign: sampleCampaign,
      scheduledDate: date,
      timestamp: new Date(),
      message: `📅 Perfect! Your ${sampleCampaign.name} has been scheduled to launch on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}. I'll send you a reminder before it goes live.`
    };

    localStorage.setItem('campaign-activation', JSON.stringify(scheduleData));

    // Trigger storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'campaign-activation',
      newValue: JSON.stringify(scheduleData),
      storageArea: localStorage
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Activation Bar - Fixed at top */}
      <ActivationBar
        campaign={sampleCampaign}
        onPreview={handlePreview}
        onSave={handleSave}
        onActivate={handleActivate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden" style={{ paddingTop: '64px' }}>
        {/* Left Sidebar - 30% width */}
        <motion.div
          className="w-[30%] min-w-[320px] max-w-[480px]"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <JourneySidebar
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </motion.div>

        {/* Right Canvas Area - 70% width */}
        <motion.div
          className="flex-1 relative overflow-hidden"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <JourneyCanvas
            nodes={journeyNodes}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
            onCanvasClick={handleCanvasClick}
          />
        </motion.div>
      </div>

      {/* Step Details Drawer - Slides up from bottom */}
      <StepDetailsDrawer
        node={selectedNode}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onEdit={handleEditStep}
      />

      {/* Activation Modal */}
      <ActivationModal
        isOpen={showActivationModal}
        onClose={() => setShowActivationModal(false)}
        onConfirm={handleActivationConfirm}
        onSchedule={handleActivationSchedule}
        campaign={sampleCampaign}
        journey={journeyNodes}
      />
    </div>
  );
}