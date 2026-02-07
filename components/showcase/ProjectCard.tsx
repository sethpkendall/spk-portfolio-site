import React from 'react';
import Link from 'next/link';
import { ProjectMetadata } from '@/types/project';
import { Calendar, Code2, Cpu, Tag } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectMetadata;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/showcase/${project.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800 min-h-[320px] md:min-h-[340px] flex flex-col">
        {project.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </div>
        )}
        
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {project.description}
          </p>
        </div>

        <div className="space-y-3 mt-auto">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                +{project.techStack.length - 4} more
              </span>
            )}
          </div>

          {/* AI Tools Used */}
          {project.aiTools && project.aiTools.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Cpu className="w-4 h-4" />
              <span>Built with: {project.aiTools.join(', ')}</span>
            </div>
          )}

          {/* Category & Date */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className="capitalize">{project.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Link>
  );
}