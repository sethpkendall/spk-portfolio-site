import React from 'react';
import { getAllProjectMetadata } from '@/projects/registry';
import { ProjectCard } from '@/components/showcase/ProjectCard';
import { Sparkles } from 'lucide-react';

export default async function ShowcasePage() {
  const projects = await getAllProjectMetadata();
  
  // Sort projects: featured first, then by date
  const sortedProjects = projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categories = Array.from(new Set(projects.map(p => p.category)));
  const allTechStack = Array.from(new Set(projects.flatMap(p => p.techStack)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Project Showcase
              </h1>
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore applications that I've built along with their code and some documentation of their intent and execution.
            </p>
          </div>
        </div>
        
        {/* Network web poly decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="polyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: '#764ba2', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#f093fb', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            {/* Polygon mesh pattern */}
            <polygon points="0,128 240,160 480,96 720,192 960,128 1200,160 1440,64 1440,320 0,320" fill="url(#polyGradient)" opacity="0.5"/>
            <polygon points="0,192 320,128 640,224 960,160 1280,192 1440,128 1440,320 0,320" fill="url(#polyGradient)" opacity="0.4"/>
            <polygon points="0,256 360,192 720,256 1080,192 1440,224 1440,320 0,320" fill="url(#polyGradient)" opacity="0.6"/>
            {/* Connection lines */}
            <line x1="240" y1="160" x2="480" y2="96" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="480" y1="96" x2="720" y2="192" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="720" y1="192" x2="960" y2="128" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="960" y1="128" x2="1200" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <line x1="320" y1="128" x2="640" y2="224" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <line x1="640" y1="224" x2="960" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <line x1="960" y1="160" x2="1280" y2="192" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            {/* Node circles */}
            <circle cx="240" cy="160" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="480" cy="96" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="720" cy="192" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="960" cy="128" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="1200" cy="160" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="320" cy="128" r="3" fill="rgba(255,255,255,0.5)"/>
            <circle cx="640" cy="224" r="3" fill="rgba(255,255,255,0.5)"/>
            <circle cx="1280" cy="192" r="3" fill="rgba(255,255,255,0.5)"/>
            {/* Solid base */}
            <rect x="0" y="260" width="1440" height="60" className="fill-gray-50 dark:fill-gray-900"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {projects.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {allTechStack.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty state */}
        {sortedProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
