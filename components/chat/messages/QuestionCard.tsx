'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Send } from 'lucide-react';
import { Question } from './types';

interface QuestionCardProps {
  questions: Question[];
  onAnswer?: (questionId: string, answer: string) => void;
  onContinue?: (answers: Record<string, string>) => void;
}

export default function QuestionCard({
  questions,
  onAnswer,
  onContinue
}: QuestionCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleQuickReply = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    onAnswer?.(questionId, answer);
  };

  const handleTextAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    onAnswer?.(questionId, answer);
  };

  const handleContinue = () => {
    if (currentAnswer.trim()) {
      const firstQuestion = questions[0];
      const newAnswers = { ...answers, [firstQuestion.id]: currentAnswer.trim() };
      setAnswers(newAnswers);
      onContinue?.(newAnswers);
    } else {
      onContinue?.(answers);
    }
  };

  const allQuestionsAnswered = questions.every(q =>
    !q.required || answers[q.id] || (!q.required && q.type === 'quick-reply')
  );

  return (
    <motion.div
      className="mt-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <motion.div
          className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <HelpCircle size={16} className="text-white" />
        </motion.div>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          I need a few more details:
        </h4>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">
                {index + 1}.
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </p>
                {question.context && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {question.context}
                  </p>
                )}
              </div>
            </div>

            {/* Quick reply options */}
            {question.type === 'quick-reply' && question.options && (
              <div className="flex flex-wrap gap-2 ml-6">
                {question.options.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => handleQuickReply(question.id, option)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                      ${answers[question.id] === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Multiple choice */}
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2 ml-6">
                {question.options.map((option) => (
                  <motion.label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      onChange={() => handleQuickReply(question.id, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option}
                    </span>
                  </motion.label>
                ))}
              </div>
            )}

            {/* Show current answer */}
            {answers[question.id] && question.type !== 'open-ended' && (
              <motion.div
                className="ml-6 text-xs text-blue-600 dark:text-blue-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ {answers[question.id]}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Open-ended input (for single question or general input) */}
      {questions.some(q => q.type === 'open-ended') && (
        <motion.div
          className="mt-4 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your detailed response here..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </motion.div>
      )}

      {/* Continue button */}
      <motion.div
        className="flex justify-end mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={handleContinue}
          disabled={!allQuestionsAnswered && !currentAnswer.trim()}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${(allQuestionsAnswered || currentAnswer.trim())
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={(allQuestionsAnswered || currentAnswer.trim()) ? { scale: 1.02 } : {}}
          whileTap={(allQuestionsAnswered || currentAnswer.trim()) ? { scale: 0.98 } : {}}
        >
          <Send size={16} />
          <span>Continue</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}