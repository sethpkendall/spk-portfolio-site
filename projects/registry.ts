import { Project, ProjectMetadata, CodeFile } from '@/types/project';
import fs from 'fs';
import path from 'path';

// Helper function to read code files
function readCodeFile(projectId: string, filename: string): string {
  try {
    const filePath = path.join(process.cwd(), 'projects', projectId, filename);
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read file: ${filename}`, error);
    return `// Error loading file: ${filename}`;
  }
}

// Helper function to get all code files for a project
function getProjectCodeFiles(projectId: string, files: string[]): CodeFile[] {
  return files.map(filename => ({
    filename,
    code: readCodeFile(projectId, filename),
  }));
}

// Dynamically import projects to enable code splitting
const projects: Record<string, () => Promise<Project>> = {
  'goal-keeper': async () => {
    const module = await import('./goal-keeper');
    
    // Define all code files for this project
    const codeFiles = getProjectCodeFiles('goal-keeper', [
      'index.tsx',
      'components/SessionPicker.tsx',
      'components/SessionViewer.tsx',
      'components/AddGoalModal.tsx',
      'components/AddSessionModal.tsx',
      'components/GoalCard.tsx',
      'components/GoalPicker.tsx',
      'components/LogEntryForm.tsx',
      'components/SessionDetails.tsx',
      'components/SessionTimeline.tsx',
      'components/ProgressChart.tsx',
      'components/SessionProgressChart.tsx',
      'components/PastWeekChart.tsx',
    ]);
    
    return {
      metadata: (await import('./goal-keeper/metadata.json')).default,
      Component: module.default,
      codeFiles,
    };
  },
  'meal-planner': async () => {
    const module = await import('./meal-planner');
    
    // Define all code files for this project
    const codeFiles = getProjectCodeFiles('meal-planner', [
      'index.tsx',
      'components/MealPlannerTool.tsx',
      'components/AddMealModal.tsx',
      'components/EditMealModal.tsx',
      'components/WeekPager.tsx',
      'components/MealGrid.tsx',
      'components/MealGridPanel.tsx',
      'components/MealCarousel.tsx',
      'components/MealCombobox.tsx',
      'components/Drawer.tsx',
    ]);
    
    return {
      metadata: (await import('./meal-planner/metadata.json')).default,
      Component: module.default,
      codeFiles,
    };
  },
  // Add new projects here following the same pattern
};

export async function getProject(id: string): Promise<Project | null> {
  const loader = projects[id];
  if (!loader) return null;
  return await loader();
}

export async function getAllProjects(): Promise<Project[]> {
  const projectList = await Promise.all(
    Object.keys(projects).map(async (id) => {
      const loader = projects[id];
      return await loader();
    })
  );
  return projectList;
}

export async function getProjectMetadata(id: string): Promise<ProjectMetadata | null> {
  try {
    const metadata = await import(`./${id}/metadata.json`);
    return metadata.default;
  } catch {
    return null;
  }
}

export async function getAllProjectMetadata(): Promise<ProjectMetadata[]> {
  const metadataList = await Promise.all(
    Object.keys(projects).map(async (id) => {
      const metadata = await getProjectMetadata(id);
      return metadata;
    })
  );
  return metadataList.filter(Boolean) as ProjectMetadata[];
}