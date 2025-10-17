'use client';

import { motion } from 'framer-motion';
import { Target, Users, BarChart3, Route, Palette, Rocket } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const agents = [
  {
    id: 1,
    name: 'Campaign Strategy Agent',
    description: 'Designs comprehensive marketing strategies',
    color: '#7c3aed',
    icon: Target,
    capabilities: [
      'Market analysis and competitive research',
      'Campaign objective setting and KPI definition',
      'Budget allocation and resource planning',
      'Multi-channel strategy development'
    ]
  },
  {
    id: 2,
    name: 'Audience & Persona Agent',
    description: 'Creates detailed customer personas',
    color: '#2563eb',
    icon: Users,
    capabilities: [
      'Customer segmentation and profiling',
      'Behavioral pattern analysis',
      'Demographic and psychographic research',
      'Persona development and validation'
    ]
  },
  {
    id: 3,
    name: 'Data Analytics Agent',
    description: 'Analyzes campaign performance and metrics',
    color: '#14b8a6',
    icon: BarChart3,
    capabilities: [
      'Real-time performance monitoring',
      'Attribution modeling and analysis',
      'ROI calculation and optimization',
      'Predictive analytics and forecasting'
    ]
  },
  {
    id: 4,
    name: 'Journey Orchestration Agent',
    description: 'Maps and optimizes customer journeys',
    color: '#f97316',
    icon: Route,
    capabilities: [
      'Customer journey mapping',
      'Touchpoint optimization',
      'Automation workflow design',
      'Cross-channel coordination'
    ]
  },
  {
    id: 5,
    name: 'Creative Generation Agent',
    description: 'Produces compelling marketing content',
    color: '#ec4899',
    icon: Palette,
    capabilities: [
      'Copy and content generation',
      'Visual asset recommendations',
      'Brand voice consistency',
      'A/B test creative variations'
    ]
  },
  {
    id: 6,
    name: 'Activation & Integration Agent',
    description: 'Executes campaigns across all channels',
    color: '#10b981',
    icon: Rocket,
    capabilities: [
      'Campaign launch and deployment',
      'Platform integration management',
      'Real-time campaign monitoring',
      'Performance optimization and scaling'
    ]
  }
];

function AgentCard({ agent }: { agent: typeof agents[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = agent.icon;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        animate={{
          borderColor: isHovered ? agent.color : 'rgb(229 231 235)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(135deg, ${agent.color}10, ${agent.color}05)`
          }}
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10 p-8">
          {/* Agent Icon */}
          <motion.div
            className="flex items-center justify-center w-16 h-16 mb-6 rounded-xl text-white mx-auto"
            style={{ backgroundColor: agent.color }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              boxShadow: isHovered
                ? `0 8px 32px ${agent.color}40`
                : `0 4px 16px ${agent.color}20`
            }}
            transition={{ duration: 0.3 }}
          >
            <IconComponent size={32} />
          </motion.div>

          {/* Agent Name */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            {agent.name}
          </h3>

          {/* Agent Description */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {agent.description}
          </p>

          {/* Capabilities - shown on hover */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Key Capabilities:
              </h4>
              <ul className="space-y-2">
                {agent.capabilities.map((capability, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : -10
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0"
                      style={{ backgroundColor: agent.color }}
                    />
                    {capability}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Subtle border highlight */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 w-0"
            style={{ backgroundColor: agent.color }}
            animate={{
              width: isHovered ? '100%' : '0%'
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AgentShowcase() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Meet Your AI Marketing Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Six specialized AI agents working together to transform your marketing strategy and execution
          </p>
        </motion.div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AgentCard agent={agent} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Ready to see them in action?
          </p>
          <Link href="/chat">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}