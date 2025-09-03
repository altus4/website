# Altus 4 Marketing Website

A modern, responsive marketing website for Altus 4 - an AI-enhanced MySQL full-text search engine. Built with Vue.js 3, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive**: Mobile-first design that works on all devices
- **Performance Optimized**: Fast loading with optimized assets and smooth scrolling
- **SEO Friendly**: Comprehensive meta tags and semantic HTML structure
- **Accessible**: Built with accessibility best practices
- **Documentation**: Integrated VitePress documentation with automatic sync to separate repository

## Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom UI components inspired by Shadcn-Vue
- **Icons**: Lucide Vue Next
- **Build Tool**: Vite
- **Documentation**: VitePress

## Sections

1. **Hero Section**: Value proposition with clear CTA buttons
1. **Features Section**: Showcase of key capabilities (AI, Performance, Security)
1. **Technical Specifications**: Architecture overview and tech stack details
1. **Project Status**: Current metrics, completion status, and roadmap
1. **Call to Action**: Community engagement and quick start links
1. **Footer**: Contact information, resources, and tech stack

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd altus4-website
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Colors

The website uses a custom color palette defined in `tailwind.config.js`. Main colors:

- **Primary**: Blue (#3b82f6) for buttons and accents
- **Secondary**: Gray scale for text and backgrounds

### Components

All UI components are located in `src/components/ui/` and can be easily customized:

- `Button.vue`: Customizable button component with variants
- `Card.vue`: Container component for content sections
- `CardHeader.vue` & `CardContent.vue`: Card sub-components

### Content

To update the content:

1. **Hero Section**: Edit `src/components/HeroSection.vue`
2. **Features**: Modify `src/components/FeaturesSection.vue`
3. **Tech Specs**: Update `src/components/TechSpecsSection.vue`
4. **Project Status**: Change metrics in `src/components/ProjectStatusSection.vue`
5. **CTA**: Customize links in `src/components/CallToActionSection.vue`
6. **Footer**: Update contact info in `src/components/FooterSection.vue`

## Documentation

This project includes comprehensive VitePress documentation that automatically syncs to a separate repository.

### 📚 Documentation Site

Live Documentation: [https://altus4.github.io/docs](https://altus4.github.io/docs)

### 🔄 Documentation Sync

The `docs/` directory is automatically synchronized to the [`altus4/docs`](https://github.com/altus4/docs) repository:

- **Automatic**: Triggered on push to `main` or `develop` branches
- **Manual**: Use `npm run docs:sync` for manual synchronization
- **GitHub Pages**: Auto-deployment to documentation site

### 📝 Working with Documentation

```bash
# Start documentation development server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built documentation
npm run docs:preview

# Sync documentation to separate repository
npm run docs:sync

# Force sync with custom message
npm run docs:sync:force
```

### 🛠️ Documentation Setup

For initial setup of the documentation sync system, see [`DOCS_SYNC_SETUP.md`](./DOCS_SYNC_SETUP.md).

## Configuration

### Vite Configuration

The project uses Vite with Vue plugin and path aliases configured in `vite.config.ts`.

### TypeScript

TypeScript configuration is split into:

- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: App-specific settings with path mappings
- `tsconfig.node.json`: Node.js environment settings

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with:

- Custom color palette
- Inter font family
- Typography plugin
- Custom utility classes

## Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: Optimized with Vite's tree shaking
- **Loading Speed**: Lazy loading and optimized images

## Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Configure custom domain: `altus4.thavarshan.com`

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it as a Vue.js project
3. Configure domain settings

### GitHub Pages

1. Add deployment workflow in `.github/workflows/deploy.yml`
2. Configure GitHub Pages to use the workflow
3. Update base URL in `vite.config.ts` if needed

## License

This project is licensed under the MIT License.

## Author

Thavarshan

- Website: [thavarshan.com](https://thavarshan.com)
- GitHub: [@thavarshan](https://github.com/thavarshan)

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Made with care for the Altus 4 project
