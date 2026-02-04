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
                AI-Powered Project Showcase
              </h1>
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore applications built with the help of AI coding assistants. 
              Each project showcases the collaboration between human creativity and artificial intelligence.
            </p>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              className="fill-gray-50 dark:fill-gray-900"/>
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
