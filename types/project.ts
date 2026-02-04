export interface ProjectMetadata {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  aiTools?: string[]; // Claude, GPT-4, Copilot, etc.
  techStack: string[];
  category: 'app' | 'game' | 'visualization' | 'tool' | 'experiment';
  thumbnail?: string;
  documentation?: string; // Markdown content explaining the project
}

export interface CodeFile {
  filename: string;
  code: string;
  language?: string;
}

export interface Project {
  metadata: ProjectMetadata;
  Component: React.ComponentType;
  code?: string; // Single file code (legacy)
  codeFiles?: CodeFile[]; // Multiple code files
}