# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 landing page for an AI agent platform called "Kai Flow". The project uses modern React patterns with TypeScript, Tailwind CSS, and Framer Motion for animations.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### App Structure (Next.js App Router)
- `/src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with header and footer
  - `page.tsx` - Home page with dynamic imports for performance
  - `globals.css` - Global styles and Tailwind configuration

### Component Organization
- `/src/components/` - All React components
  - `/ui/` - Reusable UI components (buttons, avatars, animations)
  - `/logos/` - Brand logo components with index.ts barrel export
  - Page-specific components: `hero-section.tsx`, `features-6.tsx`, `integrations-6.tsx`, etc.

### Key Technical Patterns

1. **Dynamic Imports**: Main page uses `dynamic()` imports for code splitting and performance
2. **shadcn/ui Integration**: Uses components.json config with "new-york" style and Lucide icons
3. **Tailwind Utilities**: Uses `cn()` utility from `/lib/utils.ts` combining clsx and tailwind-merge
4. **Animation**: Framer Motion with custom components like `TextEffect`, `ContainerScroll`, `WavyBackground`

### Styling System
- Tailwind CSS v4 with PostCSS
- Custom CSS variables and design tokens
- Responsive design patterns
- Animation utilities from `tw-animate-css`

### Import Aliases
- `@/components` - Components directory
- `@/lib` - Library utilities
- `@/hooks` - Custom hooks (if added)

## Project Metadata
The site is branded as "Kai Flow - Visual Workflow Automation Platform" and includes comprehensive SEO metadata in layout.tsx.