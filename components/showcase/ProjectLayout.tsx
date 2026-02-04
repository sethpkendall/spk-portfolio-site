'use client';

import React, { useState } from 'react';
import { ProjectMetadata, CodeFile } from '@/types/project';
import { CodeViewer } from './CodeViewer';
import { ArrowLeft, ExternalLink, Github, Play, Code, FileText, Cpu } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface ProjectLayoutProps {
  metadata: ProjectMetadata;
  children: React.ReactNode;
  code?: string;
  codeFiles?: CodeFile[];
}

export function ProjectLayout({ metadata, children, code, codeFiles }: ProjectLayoutProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'docs'>('demo');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/showcase" 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Showcase
            </Link>
            <div className="flex items-center gap-3">
              {metadata.githubUrl && (
                <a
                  href={metadata.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="text-sm">View on GitHub</span>
                </a>
              )}
              {metadata.liveUrl && (
                <a
                  href={metadata.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Live Demo</span>
                </a>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {metadata.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {metadata.description}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">
                {metadata.category}
              </span>
            </div>
            {metadata.aiTools && metadata.aiTools.length > 0 && (
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">AI-Assisted:</span>
                {metadata.aiTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'demo'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              Live Demo
            </button>
            {(code || codeFiles) && (
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-4 h-4" />
                Source Code
              </button>
            )}
            {metadata.documentation && (
              <button
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'docs'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                Documentation
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'demo' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            {children}
          </div>
        )}
        
        {activeTab === 'code' && (code || codeFiles) && (
          <CodeViewer code={code} codeFiles={codeFiles} title={`${metadata.title} - Source Code`} />
        )}
        
        {activeTab === 'docs' && metadata.documentation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown>{metadata.documentation}</ReactMarkdown>
          </div>
        )}
      </main>
    </div>
  );
}