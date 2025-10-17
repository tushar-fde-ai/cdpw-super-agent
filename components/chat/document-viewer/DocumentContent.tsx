'use client';

import { motion } from 'framer-motion';
import { DocumentContentProps, DocumentSection } from './types';

export default function DocumentContent({ document }: DocumentContentProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Split by newlines and format as paragraphs or lists
    const lines = content.split('\n').filter(line => line.trim());

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Check if it's a bullet point
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return (
          <li key={index} className="ml-4 mb-2 text-gray-900">
            {trimmedLine.substring(1).trim()}
          </li>
        );
      }

      // Check if it's a definition/key-value pair
      if (trimmedLine.includes(':') && !trimmedLine.endsWith(':')) {
        const [key, value] = trimmedLine.split(':');
        return (
          <p key={index} className="mb-3">
            <span className="font-semibold text-gray-900">{key.trim()}:</span>
            <span className="text-gray-900 ml-1">{value.trim()}</span>
          </p>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-gray-900 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  const renderSection = (section: DocumentSection, level: number = 1) => {
    const HeadingTag = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
    const headingClasses = {
      1: 'text-2xl font-bold text-gray-900 mb-4 mt-8 first:mt-0',
      2: 'text-xl font-semibold text-gray-800 mb-3 mt-6',
      3: 'text-lg font-medium text-gray-800 mb-2 mt-4'
    };

    return (
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="section"
      >
        <HeadingTag className={headingClasses[level as keyof typeof headingClasses] || headingClasses[3]}>
          {section.heading}
        </HeadingTag>

        <div className="content">
          {section.content.includes('•') || section.content.includes('-') ? (
            <ul className="list-none space-y-2 mb-6">
              {formatContent(section.content)}
            </ul>
          ) : (
            <div className="mb-6">
              {formatContent(section.content)}
            </div>
          )}
        </div>

        {/* Render subsections */}
        {section.subsections && section.subsections.length > 0 && (
          <div className="subsections ml-4 border-l-2 border-gray-200 pl-6">
            {section.subsections.map(subsection => renderSection(subsection, level + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="h-full overflow-y-auto bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto p-10">
        {/* Document Header */}
        <motion.header
          className="mb-8 pb-6 border-b border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {document.title}
          </h1>

          <div className="flex items-center space-x-6 text-sm text-gray-800">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Created:</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Type:</span>
              <span className="capitalize">{document.type.replace('-', ' ')}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Status:</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium capitalize
                ${document.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${document.status === 'pending-approval' ? 'bg-blue-100 text-blue-800' : ''}
                ${document.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
              `}>
                {document.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Document Content */}
        <motion.main
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {document.content.map(section => renderSection(section))}
        </motion.main>

        {/* Document Footer */}
        <motion.footer
          className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <p>Generated by Marketing Super Agent</p>
          <p className="mt-1">Document ID: {document.id}</p>
        </motion.footer>
      </div>
    </motion.div>
  );
}