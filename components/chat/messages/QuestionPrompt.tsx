'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, HelpCircle } from 'lucide-react';
import { QuestionPromptProps } from './types';

export default function QuestionPrompt({ questions, onSubmit, timestamp, questionOptions }: QuestionPromptProps) {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSuggestionClick = (questionIndex: number, suggestion: string) => {
    handleAnswerChange(questionIndex, suggestion);
  };

  const getOptionsForQuestion = (question: string) => {
    return questionOptions?.find(q => q.question === question)?.options || [];
  };

  const handleSubmit = () => {
    const validAnswers = answers.filter(answer => answer.trim() !== '');
    if (validAnswers.length === questions.length) {
      onSubmit(answers);
    }
  };

  const isComplete = answers.every(answer => answer.trim() !== '');

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-end space-x-2 max-w-[80%]">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-1 flex-shrink-0">
          <HelpCircle size={16} className="text-white" />
        </div>

        {/* Question Card */}
        <motion.div
          className="relative px-5 py-4 rounded-2xl rounded-bl-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              I need a few more details:
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Please answer the following questions to continue
            </p>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Question */}
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  <span className="inline-flex items-center space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span>{question}</span>
                  </span>
                </label>

                {/* Suggestion Buttons */}
                {getOptionsForQuestion(question).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getOptionsForQuestion(question).map((option, optionIndex) => (
                      <motion.button
                        key={optionIndex}
                        onClick={() => handleSuggestionClick(index, option)}
                        className={`
                          px-3 py-1.5 text-sm rounded-lg border transition-all duration-200
                          ${answers[index] === option
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index * 0.1) + (optionIndex * 0.05) }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Answer Input */}
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-end mt-4 pt-3 border-t border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isComplete
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
              whileHover={isComplete ? { scale: 1.02 } : {}}
              whileTap={isComplete ? { scale: 0.98 } : {}}
            >
              <Send size={14} />
              <span>Continue</span>
            </motion.button>
          </motion.div>

        </motion.div>

        {/* Spacer for alignment */}
        <div className="w-8" />
      </div>
    </motion.div>
  );
}