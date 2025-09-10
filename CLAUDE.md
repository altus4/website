# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server (Vite) on <http://localhost:5173>
- `npm run build` - Build production website (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on Vue, JS, TS files (excludes docs)
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier and fix markdown linting

### Documentation Commands

- `npm run docs:dev` - Start VitePress docs server on port 5174
- `npm run docs:build` - Build documentation site
- `npm run docs:sync` - Sync docs to separate altus4/docs repository
- `npm run build:all` - Build website + docs + copy docs to dist/docs

### Quality Assurance

After making changes, always run:

1. `npm run lint` - Check for code style issues
2. `vue-tsc -b` - Type check (included in build command)
3. `npm run build` - Ensure production build works

## Architecture Overview

### Project Structure

This is a Vue 3 + TypeScript marketing website with integrated VitePress documentation:

- **Website**: Single-page application with section-based navigation
- **Documentation**: VitePress site that syncs to separate repository
- **Deployment**: Website and docs built together, docs copied to /docs route

### Key Directories

- `src/pages/` - Page components (HomePage, auth pages, etc.)
- `src/components/` - Reusable Vue components organized by sections
- `src/components/ui/` - Reusable UI components (buttons, cards, logo)
- `src/components/layout/` - Layout components (navigation, scroll)
- `src/composables/` - Vue 3 composables for shared logic
- `docs/` - VitePress documentation (syncs to altus4/docs repo)
- `dist/` - Build output (website + docs combined)

### Tech Stack

- **Framework**: Vue 3 with Composition API and `<script setup>`
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components inspired by Shadcn-Vue
- **Build**: Vite with Vue plugin
- **Documentation**: VitePress (separate build process)

## Component Architecture

### Main Application Structure

- `App.vue` - Root component with navigation, routing, and scroll handling
- Section components follow naming pattern: `{Section}Section.vue`
- Simple client-side routing without external router library

### UI Component System

- `src/components/ui/button/` - Button component with variants
- `src/components/ui/card/` - Card system with header, content, footer
- `src/components/ui/AltusLogo.vue` - Animated logo component
- `src/lib/utils.ts` - Utility functions for class merging

### Page Sections

1. `HeroSection.vue` - Landing hero with CTAs
2. `FeaturesSection.vue` - Product benefits showcase
3. `TechSpecsSection.vue` - Architecture and technical details
4. `ProjectStatusSection.vue` - Development metrics and roadmap
5. `CallToActionSection.vue` - Community engagement
6. `FooterSection.vue` - Links and contact information

## Development Patterns

### TypeScript Configuration

- Uses project references: `tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`
- Path alias: `@/*` maps to `./src/*`
- Strict type checking enabled

### Styling Approach

- Tailwind CSS with custom color palette and design tokens
- CSS variables for theme colors (supports future dark mode)
- Inter font family as primary typeface
- Responsive-first design with mobile breakpoints

### State Management

- Uses Vue 3 Composition API with `ref()` and `computed()`
- No external state management (Vuex/Pinia) - simple component state
- Route state managed manually with `window.location.pathname`

## Documentation System

### VitePress Integration

- Documentation lives in `docs/` directory
- Separate build process from main website
- Auto-syncs to `altus4/docs` repository via scripts
- Combined deployment: website + docs served from same domain

### Documentation Structure

- API documentation in `docs/api/`
- Architecture guides in `docs/architecture/`
- Development guides in `docs/development/`
- Deployment guides in `docs/deployment/`

## Important Notes

### Build Process

- Website build includes TypeScript compilation check
- Documentation builds separately via VitePress
- Combined build copies docs to `dist/docs/` for unified deployment

### Linting and Formatting

- ESLint configured for Vue 3 + TypeScript
- Prettier for code formatting
- Markdownlint for documentation quality
- Excludes `docs/**/*.md` from main linting (VitePress handles this)

### Navigation and Routing

- Single-page application with section-based navigation
- Smooth scrolling to sections with offset for fixed navigation
- Manual routing implementation for static pages (/privacy, /terms) and auth pages (/login, /register, /forgot-password, /dashboard)
- Hash-based navigation for sections (/#features, /#architecture, etc.)

## Authentication System

### JWT Authentication

- JWT-based authentication with Express.js backend
- Token stored in localStorage with expiration tracking
- Automatic token refresh functionality
- API client with automatic Authorization header injection

### Authentication Components

- `src/composables/useAuth.ts` - Authentication composable with reactive state
- `src/lib/api.ts` - API client for HTTP requests with JWT handling
- `src/components/auth/LoginPage.vue` - Login form with validation
- `src/components/auth/RegisterPage.vue` - Registration form with password confirmation
- `src/components/auth/ForgotPasswordPage.vue` - Password reset request form

### API Configuration

- Environment variable: `VITE_API_BASE_URL` (defaults to <http://localhost:3000/api>)
- Copy `.env.example` to `.env.local` and configure API base URL
- All API requests include CORS headers and JSON content type

### Authentication Flow

1. User submits login/register form
2. API request sent to Express.js backend
3. JWT token received and stored in localStorage
4. User state updated reactively across application
5. Navigation state shows authenticated user menu
6. Protected routes check authentication status

### Form Components

- `src/components/ui/input/Input.vue` - Reusable input with validation display
- `src/components/ui/alert/Alert.vue` - Alert component for success/error messages
- Form validation with field-level error display
- Loading states and disabled form submission during API calls