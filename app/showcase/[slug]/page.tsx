import React from 'react';
import { notFound } from 'next/navigation';
import { getProject, getAllProjectMetadata } from '@/projects/registry';
import { ProjectLayout } from '@/components/showcase/ProjectLayout';

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await getAllProjectMetadata();
  return projects.map((project) => ({
    slug: project.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.metadata.title} | Seth P. Kendall`,
    description: project.metadata.description,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }

  const { metadata, Component, code, codeFiles } = project;

  return (
    <ProjectLayout metadata={metadata} code={code} codeFiles={codeFiles}>
      <Component />
    </ProjectLayout>
  );
}
