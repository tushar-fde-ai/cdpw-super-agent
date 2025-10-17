'use client';

import { motion } from 'framer-motion';
import { Target, Users, BarChart3, Route, Palette, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const agents = [
  {
    name: 'Campaign Strategy',
    color: '#7c3aed',
    icon: Target,
    position: { x: 20, y: 20 },
  },
  {
    name: 'Audience & Persona',
    color: '#2563eb',
    icon: Users,
    position: { x: 80, y: 30 },
  },
  {
    name: 'Data Analytics',
    color: '#14b8a6',
    icon: BarChart3,
    position: { x: 15, y: 70 },
  },
  {
    name: 'Journey Orchestration',
    color: '#f97316',
    icon: Route,
    position: { x: 85, y: 75 },
  },
  {
    name: 'Creative Generation',
    color: '#ec4899',
    icon: Palette,
    position: { x: 50, y: 15 },
  },
  {
    name: 'Activation & Integration',
    color: '#10b981',
    icon: Rocket,
    position: { x: 50, y: 85 },
  },
];

const connections = [
  { from: 0, to: 4 }, // Strategy to Creative
  { from: 1, to: 0 }, // Audience to Strategy
  { from: 2, to: 1 }, // Analytics to Audience
  { from: 3, to: 5 }, // Journey to Activation
  { from: 4, to: 3 }, // Creative to Journey
  { from: 5, to: 2 }, // Activation to Analytics
];


export default function Hero() {

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-600 to-blue-600 dark:from-white dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
            >
              Your AI Marketing Team
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              From campaign strategy to execution in minutes, not weeks
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <Link href="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Agent Network Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-96 lg:h-[500px]"
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connection lines */}
              {connections.map((connection, index) => {
                const fromAgent = agents[connection.from];
                const toAgent = agents[connection.to];
                return (
                  <motion.line
                    key={index}
                    x1={fromAgent.position.x}
                    y1={fromAgent.position.y}
                    x2={toAgent.position.x}
                    y2={toAgent.position.y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="0.5"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 + index * 0.2 }}
                  />
                );
              })}

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Agent nodes */}
            {agents.map((agent, index) => {
              const IconComponent = agent.icon;
              return (
                <motion.div
                  key={agent.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${agent.position.x}%`,
                    top: `${agent.position.y}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="relative"
                    animate={{
                      boxShadow: [
                        `0 0 10px ${agent.color}40`,
                        `0 0 20px ${agent.color}60`,
                        `0 0 10px ${agent.color}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white dark:border-gray-700 transition-all duration-300"
                      style={{ backgroundColor: agent.color }}
                    >
                      <IconComponent size={24} className="lg:w-8 lg:h-8" />
                    </div>
                  </motion.div>

                  {/* Agent name tooltip */}
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {agent.name}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black dark:border-b-white"></div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}