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
        
        {/* Network web poly decoration - hidden on mobile */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute right-0 top-0 h-full w-full" viewBox="0 0 600 400" preserveAspectRatio="xMaxYMid slice">
            <defs>
              <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.6 }} />
                <stop offset="50%" style={{ stopColor: '#764ba2', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#f093fb', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
            {/* Large triangular polygons */}
            <polygon points="450,50 580,120 520,180" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <polygon points="520,180 580,120 600,200" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
            <polygon points="380,100 450,50 480,140" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <polygon points="480,140 520,180 450,230" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <polygon points="450,230 520,180 550,280" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
            <polygon points="380,200 450,230 420,300" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <polygon points="550,280 600,200 600,350" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <polygon points="420,300 550,280 500,380" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" strokeWidth="2"/>
            {/* Connection lines */}
            <line x1="450" y1="50" x2="580" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <line x1="580" y1="120" x2="520" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <line x1="520" y1="180" x2="450" y2="230" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <line x1="450" y1="230" x2="380" y2="200" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <line x1="380" y1="200" x2="420" y2="300" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <line x1="450" y1="50" x2="380" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <line x1="380" y1="100" x2="480" y2="140" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <line x1="480" y1="140" x2="520" y2="180" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
            <line x1="550" y1="280" x2="600" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            <line x1="550" y1="280" x2="420" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            {/* Large node circles with gradient */}
            <circle cx="450" cy="50" r="8" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            <circle cx="580" cy="120" r="8" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            <circle cx="520" cy="180" r="8" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            <circle cx="450" cy="230" r="8" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            <circle cx="380" cy="200" r="7" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <circle cx="380" cy="100" r="7" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <circle cx="480" cy="140" r="7" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <circle cx="550" cy="280" r="8" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
            <circle cx="420" cy="300" r="7" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
            <circle cx="600" cy="200" r="6" fill="url(#nodeGradient)" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
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
