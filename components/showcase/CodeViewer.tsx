'use client';

import React, { useState } from 'react';
import { Copy, Check, Code2, Maximize2, Minimize2, FileCode, ChevronDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeFile } from '@/types/project';

interface CodeViewerProps {
  code?: string;
  codeFiles?: CodeFile[];
  language?: string;
  title?: string;
}

export function CodeViewer({ code, codeFiles, language = 'typescript', title = 'Source Code' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [showFileList, setShowFileList] = useState(false);

  // Determine current code to display
  const hasMultipleFiles = codeFiles && codeFiles.length > 0;
  const currentCode = hasMultipleFiles ? codeFiles[selectedFileIndex].code : (code || '');
  const currentFilename = hasMultipleFiles ? codeFiles[selectedFileIndex].filename : title;
  const currentLanguage = hasMultipleFiles 
    ? (codeFiles[selectedFileIndex].language || getLanguageFromFilename(codeFiles[selectedFileIndex].filename))
    : language;

  function getLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'typescript';
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'relative'} flex flex-col rounded-lg overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-300">
          <Code2 className="w-4 h-4" />
          
          {/* File selector dropdown */}
          {hasMultipleFiles ? (
            <div className="relative">
              <button
                onClick={() => setShowFileList(!showFileList)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                <FileCode className="w-4 h-4" />
                <span className="text-sm font-medium">{currentFilename}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFileList ? 'rotate-180' : ''}`} />
              </button>
              
              {showFileList && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[250px] max-h-[300px] overflow-y-auto">
                  {codeFiles.map((file, index) => (
                    <button
                      key={file.filename}
                      onClick={() => {
                        setSelectedFileIndex(index);
                        setShowFileList(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                        index === selectedFileIndex ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                      }`}
                    >
                      <FileCode className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{file.filename}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium">{title}</span>
          )}
          
          {hasMultipleFiles && (
            <span className="text-xs text-gray-500 ml-2">
              ({codeFiles.length} files)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Code display */}
      <div className={`${isFullscreen ? 'flex-1 overflow-auto' : 'max-h-[600px] overflow-auto'}`}>
        <SyntaxHighlighter
          language={currentLanguage}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#1e1e1e',
            fontSize: isFullscreen ? '14px' : '12px',
          }}
          showLineNumbers
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}