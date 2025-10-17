'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Mail,
  Users,
  Rocket,
  BarChart3,
  Palette,
  ShoppingCart,
  TrendingUp,
  Target,
  Instagram,
  UserCheck,
  Repeat,
  MousePointer,
  Globe,
  TestTube,
} from 'lucide-react';

const actionCards = [
  {
    id: 1,
    text: 'Create a campaign brief for holiday season',
    icon: Calendar,
    color: 'from-red-500 to-pink-500',
    action: 'demo-campaign-brief',
  },
  {
    id: 2,
    text: 'Build an email nurture journey',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
    action: 'demo-campaign-execution',
  },
  {
    id: 3,
    text: 'Generate audience personas for Gen Z',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    action: 'chat-with-prompt',
    prompt: 'Generate audience personas for Gen Z',
  },
  {
    id: 4,
    text: 'Launch a product launch campaign',
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    action: 'chat-with-prompt',
    prompt: 'Launch a product launch campaign',
  },
  {
    id: 5,
    text: 'Analyze Q3 campaign performance',
    icon: BarChart3,
    color: 'from-teal-500 to-green-500',
    action: 'chat-with-prompt',
    prompt: 'Analyze Q3 campaign performance',
  },
  {
    id: 6,
    text: 'Design multi-channel creative assets',
    icon: Palette,
    color: 'from-pink-500 to-purple-500',
    action: 'chat-with-prompt',
    prompt: 'Design multi-channel creative assets',
  },
  {
    id: 7,
    text: 'Set up cart abandonment journey',
    icon: ShoppingCart,
    color: 'from-yellow-500 to-orange-500',
    action: 'chat-with-prompt',
    prompt: 'Set up cart abandonment journey',
  },
  {
    id: 8,
    text: 'Optimize email campaign performance',
    icon: TrendingUp,
    color: 'from-green-500 to-teal-500',
    action: 'chat-with-prompt',
    prompt: 'Optimize email campaign performance',
  },
  {
    id: 9,
    text: 'Build lead scoring model for B2B',
    icon: Target,
    color: 'from-indigo-500 to-blue-500',
    action: 'chat-with-prompt',
    prompt: 'Build lead scoring model for B2B',
  },
  {
    id: 10,
    text: 'Create social media content calendar',
    icon: Instagram,
    color: 'from-pink-500 to-rose-500',
    action: 'chat-with-prompt',
    prompt: 'Create social media content calendar',
  },
  {
    id: 11,
    text: 'Develop customer personas from analytics',
    icon: UserCheck,
    color: 'from-cyan-500 to-blue-500',
    action: 'chat-with-prompt',
    prompt: 'Develop customer personas from analytics',
  },
  {
    id: 12,
    text: 'Set up retargeting campaigns',
    icon: Repeat,
    color: 'from-violet-500 to-purple-500',
    action: 'chat-with-prompt',
    prompt: 'Set up retargeting campaigns',
  },
  {
    id: 13,
    text: 'Design customer onboarding flow',
    icon: MousePointer,
    color: 'from-emerald-500 to-teal-500',
    action: 'chat-with-prompt',
    prompt: 'Design customer onboarding flow',
  },
  {
    id: 14,
    text: 'Build audience segments by behavior',
    icon: Globe,
    color: 'from-blue-500 to-indigo-500',
    action: 'chat-with-prompt',
    prompt: 'Build audience segments by behavior',
  },
  {
    id: 15,
    text: 'Create A/B test plan for landing pages',
    icon: TestTube,
    color: 'from-orange-500 to-yellow-500',
    action: 'chat-with-prompt',
    prompt: 'Create A/B test plan for landing pages',
  },
];

// Split cards into two rows
const topRowCards = actionCards.slice(0, Math.ceil(actionCards.length / 2));
const bottomRowCards = actionCards.slice(Math.ceil(actionCards.length / 2));

interface ActionCardProps {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  action?: string;
  prompt?: string;
  onClick: () => void;
}

function ActionCard({
  text,
  icon: Icon,
  color,
  onClick
}: ActionCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-80 mx-3"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`
          relative p-6 rounded-2xl cursor-pointer
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          border border-white/20 dark:border-gray-700/50
          shadow-lg hover:shadow-xl
          transition-all duration-300
          group overflow-hidden
        `}
        onClick={onClick}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />

        {/* Content */}
        <div className="relative z-10 flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}>
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
              {text}
            </p>
          </div>
        </div>

        {/* Subtle animation line */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} w-0 group-hover:w-full transition-all duration-500`} />
      </div>
    </motion.div>
  );
}

function ScrollingRow({
  cards,
  direction = 'left',
  speed = 30,
  onCardClick
}: {
  cards: typeof actionCards;
  direction?: 'left' | 'right';
  speed?: number;
  onCardClick: (card: typeof actionCards[0]) => void;
}) {
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  // Duplicate cards for seamless loop
  const duplicatedCards = [...cards, ...cards];

  return (
    <div className="relative overflow-hidden">
      <div className={`flex ${animationClass}`} style={{ animationDuration: `${speed}s` }}>
        {duplicatedCards.map((card, index) => (
          <ActionCard
            key={`${card.id}-${index}`}
            text={card.text}
            icon={card.icon}
            color={card.color}
            action={card.action}
            prompt={card.prompt}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}

export default function QuickActionCards() {
  const router = useRouter();

  const handleCardClick = (card: typeof actionCards[0]) => {
    switch (card.action) {
      case 'demo-campaign-brief':
        router.push('/chat?demo=campaign-brief');
        break;
      case 'demo-campaign-execution':
        router.push('/chat?demo=campaign-execution');
        break;
      case 'chat-with-prompt':
        router.push(`/chat?prompt=${encodeURIComponent(card.prompt || card.text)}`);
        break;
      default:
        router.push('/chat');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            What can your AI team do?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Click any action below to see your AI marketing team in action
          </p>
        </motion.div>
      </div>

      {/* Scrolling rows */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ScrollingRow cards={topRowCards} direction="left" speed={40} onCardClick={handleCardClick} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ScrollingRow cards={bottomRowCards} direction="right" speed={35} onCardClick={handleCardClick} />
        </motion.div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
    </section>
  );
}