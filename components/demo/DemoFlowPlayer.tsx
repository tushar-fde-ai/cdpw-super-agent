'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  X,
  Volume2,
  Gauge
} from 'lucide-react';
import { DemoFlow, DemoFlowPlayer } from '@/lib/demo-flows';

interface DemoFlowPlayerProps {
  flow: DemoFlow;
  autoPlay?: boolean;
  onStateChange?: (state: any) => void;
  onExit?: () => void;
}

export default function DemoFlowPlayerComponent({
  flow,
  autoPlay = false,
  onStateChange,
  onExit
}: DemoFlowPlayerProps) {
  const [player] = useState(() => new DemoFlowPlayer(onStateChange));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Update player state
  const updatePlayerState = useCallback(() => {
    const state = player.getState();
    setIsPlaying(state.isPlaying);
    setProgress(state.progress);
    setCurrentStepIndex(state.currentStepIndex);
  }, [player]);

  // Initialize player with flow
  useEffect(() => {
    if (flow) {
      player.loadFlow(flow.id as any);
      if (autoPlay) {
        player.play();
      }
    }
  }, [flow, autoPlay, player]);

  // Set up state monitoring
  useEffect(() => {
    const interval = setInterval(updatePlayerState, 100);
    return () => clearInterval(interval);
  }, [updatePlayerState]);

  const handlePlay = () => {
    player.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    player.pause();
    setIsPlaying(false);
  };

  const handleReset = () => {
    player.reset();
    setIsPlaying(false);
    setProgress(0);
    setCurrentStepIndex(0);
  };

  const handleSkipToEnd = () => {
    player.skipToEnd();
    updatePlayerState();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    player.setSpeed(newSpeed);
  };

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' }
  ];

  return (
    <>
      {/* Demo Mode Badge */}
      <motion.div
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm font-medium">Demo Mode</span>
        </div>
      </motion.div>

      {/* Demo Controls */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center space-x-6">
          {/* Flow Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Volume2 size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-900">{flow.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              Step {currentStepIndex + 1} of {flow.steps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 min-w-[200px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            {/* Reset */}
            <motion.button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Reset"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              onClick={isPlaying ? handlePause : handlePlay}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </motion.button>

            {/* Skip to End */}
            <motion.button
              onClick={handleSkipToEnd}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Skip to End"
            >
              <SkipForward size={16} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <Gauge size={16} className="text-gray-600" />
            <select
              value={speed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {speedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Exit Demo */}
          <motion.button
            onClick={onExit}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Exit Demo"
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Current Step Description */}
        <AnimatePresence>
          {flow.steps[currentStepIndex] && (
            <motion.div
              className="mt-3 pt-3 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xs text-gray-600">
                <span className="font-medium">Current Step:</span>{' '}
                {flow.steps[currentStepIndex].action.replace('-', ' ')}
                {flow.steps[currentStepIndex].content && (
                  <span className="ml-2 italic">
                    "{flow.steps[currentStepIndex].content?.substring(0, 50)}..."
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/**
 * Demo Flow Player Hook
 *
 * This hook provides a simple interface for managing demo flow state
 * across components without prop drilling.
 */
export function useDemoFlowPlayer() {
  const [demoFlow, setDemoFlow] = useState<DemoFlow | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const startDemo = (flow: DemoFlow) => {
    setDemoFlow(flow);
    setIsDemoMode(true);
  };

  const stopDemo = () => {
    setDemoFlow(null);
    setIsDemoMode(false);
  };

  return {
    demoFlow,
    isDemoMode,
    startDemo,
    stopDemo
  };
}