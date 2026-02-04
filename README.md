# Seth P. Kendall - Portfolio Site

A Next.js portfolio site featuring a blog powered by Contentful and an AI-powered project showcase for demonstrating development work.

## 🚀 Live Site

[View Portfolio](https://your-domain.vercel.app)

## ✨ Features

- **Blog**: Articles fetched from Contentful CMS with draft mode support
- **Project Showcase**: Interactive gallery of mini-applications with:
  - Live demos embedded on page
  - Syntax-highlighted source code viewer (multi-file support)
  - Markdown documentation for each project
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Offline-Capable Apps**: Projects use IndexedDB for local data persistence

## 📁 Project Structure

```
spk-portfolio-site/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with blog posts
│   ├── showcase/          # Project showcase
│   │   ├── page.tsx       # Gallery of all projects
│   │   └── [slug]/        # Individual project pages
│   └── posts/             # Blog post pages
├── components/
│   ├── showcase/          # Showcase-specific components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectLayout.tsx
│   │   └── CodeViewer.tsx
│   └── ui/                # Shared UI components
├── projects/              # 🎯 Showcase mini-applications
│   ├── registry.ts        # Project registration
│   ├── goal-keeper/       # Goal tracking app
│   └── meal-planner/      # Meal planning app
├── lib/                   # Utilities and API functions
├── models/                # Database models (Dexie.js)
└── types/                 # TypeScript type definitions
```

## 🛠️ Adding a New Showcase Project

### Step 1: Create Project Folder

```bash
mkdir -p projects/my-new-project/components
```

### Step 2: Create Main Component

Create `projects/my-new-project/index.tsx`:

```tsx
"use client"
import { useState } from 'react';

export default function MyNewProject() {
  // Keep all state internal to the component
  const [state, setState] = useState({});

  return (
    <div className="w-full min-h-[400px]">
      {/* Your application UI */}
    </div>
  );
}
```

### Step 3: Create Metadata

Create `projects/my-new-project/metadata.json`:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "description": "A brief description of what this project does.",
  "tags": ["react", "typescript"],
  "createdAt": "2026-02-01",
  "updatedAt": "2026-02-01",
  "featured": false,
  "aiTools": ["Claude", "GitHub Copilot"],
  "techStack": ["React", "TypeScript", "Tailwind CSS"],
  "category": "app",
  "documentation": "# My New Project\n\n## Overview\nDetailed documentation here..."
}
```

### Step 4: Register the Project

Add to `projects/registry.ts`:

```typescript
'my-new-project': async () => {
  const module = await import('./my-new-project');
  
  const codeFiles = getProjectCodeFiles('my-new-project', [
    'index.tsx',
    // Add other component files here
  ]);
  
  return {
    metadata: (await import('./my-new-project/metadata.json')).default,
    Component: module.default,
    codeFiles,
  };
},
```

### Step 5: Test

```bash
npm run dev
# Visit http://localhost:3000/showcase/my-new-project
```

## 🧑‍💻 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Contentful credentials

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run setup` | Initialize Contentful content |

## 🔧 Environment Variables

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Contentful
- **Database**: Dexie.js (IndexedDB wrapper)
- **UI Components**: Radix UI primitives
- **Code Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

## 📄 License

MIT

---

Built with ❤️ and AI assistance
