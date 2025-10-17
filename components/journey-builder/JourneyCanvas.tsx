'use client';

import { motion } from 'framer-motion';
import { JourneyCanvasProps } from './types';
import JourneyNode from './JourneyNode';
import ConnectionPath from './ConnectionPath';

export default function JourneyCanvas({
  nodes,
  selectedNodeId,
  onNodeClick,
  onCanvasClick
}: JourneyCanvasProps) {
  // Find connections between nodes
  const getConnections = () => {
    const connections: Array<{
      id: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      isActive: boolean;
    }> = [];

    nodes.forEach(node => {
      node.nextNodes.forEach(nextNodeId => {
        const targetNode = nodes.find(n => n.id === nextNodeId);
        if (targetNode) {
          connections.push({
            id: `${node.id}-${nextNodeId}`,
            from: node.position,
            to: targetNode.position,
            isActive: selectedNodeId === node.id || selectedNodeId === nextNodeId
          });
        }
      });
    });

    return connections;
  };

  const connections = getConnections();

  // Calculate canvas bounds for proper scrolling
  const getCanvasBounds = () => {
    if (nodes.length === 0) return { width: 1000, height: 600 };

    // Optimized margin for vertical layout - less horizontal, more vertical space
    const horizontalMargin = 150;
    const verticalMargin = 100;

    const maxX = Math.max(...nodes.map(n => n.position.x)) + horizontalMargin;
    const maxY = Math.max(...nodes.map(n => n.position.y)) + verticalMargin;
    const minX = Math.min(...nodes.map(n => n.position.x)) - horizontalMargin;
    const minY = Math.min(...nodes.map(n => n.position.y)) - verticalMargin;

    return {
      width: Math.max(maxX - minX, 800),
      height: Math.max(maxY - minY, 1000),
      offsetX: Math.max(0, -minX),
      offsetY: Math.max(0, -minY)
    };
  };

  const bounds = getCanvasBounds();

  return (
    <div
      className="relative w-full h-full bg-gray-50 overflow-auto"
      onClick={onCanvasClick}
    >
      <motion.div
        className="relative"
        style={{
          width: bounds.width,
          height: bounds.height,
          minWidth: '100%',
          minHeight: '100%'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* SVG for Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {connections.map(connection => (
            <ConnectionPath
              key={connection.id}
              from={connection.from}
              to={connection.to}
              isActive={connection.isActive}
            />
          ))}
        </svg>

        {/* Journey Nodes */}
        <div className="relative" style={{ zIndex: 2 }}>
          {nodes.map(node => (
            <JourneyNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={() => onNodeClick(node.id)}
            />
          ))}
        </div>

        {/* Canvas Instructions (when no nodes selected) */}
        {!selectedNodeId && nodes.length > 0 && (
          <motion.div
            className="absolute top-4 left-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4 max-w-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            style={{ zIndex: 3 }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Journey Canvas
            </h3>
            <p className="text-xs text-gray-600">
              Click on any step to view its configuration details and make edits.
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {nodes.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Journey Created Yet
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Start building your customer journey by asking the assistant to create a campaign or workflow.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}