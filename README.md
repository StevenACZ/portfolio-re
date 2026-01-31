<div align="center">

# Steven Coaila Zaa | Portfolio

### Full Stack Developer

[![Live Demo](https://img.shields.io/badge/Live%20Demo-stevenacz.com-00D4FF?style=for-the-badge&logo=vercel&logoColor=white)](https://stevenacz.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, interactive portfolio featuring 3D graphics, smooth animations, and a responsive design built with cutting-edge web technologies.

<br />

[View Demo](https://stevenacz.com) · [Report Bug](https://github.com/StevenACZ/portfolio/issues) · [Request Feature](https://github.com/StevenACZ/portfolio/issues)

</div>

<br />

## ✨ Features

| Feature                    | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| 🎮 **3D Interactive Hero** | WebGL particle system with 150+ animated spheres and mouse interaction |
| ⚡ **Smooth Animations**   | GSAP-powered animations with ScrollTrigger integration                 |
| 📱 **Fully Responsive**    | Mobile-first design with touch interactions                            |
| 🎯 **Apple-Style Scroll**  | Magnetic scroll zones for project presentation                         |
| ♿ **Accessible**          | WCAG 2.1 AA compliant with reduced motion support                      |
| 🔍 **SEO Optimized**       | JSON-LD structured data, meta tags, and Open Graph                     |
| ⚡ **Blazing Fast**        | ~115kb gzipped initial load with lazy loading                          |

<br />

## 🛠️ Tech Stack

<div align="center">

### Core

![Vue](https://img.shields.io/badge/Vue-3.5.26-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### 3D & Animation

![Three.js](https://img.shields.io/badge/Three.js-0.179-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Typed.js](https://img.shields.io/badge/Typed.js-2.1.0-FF6B6B?style=for-the-badge)

### UI & Performance

![Lucide](https://img.shields.io/badge/Lucide-Vue-F56565?style=for-the-badge)
![Intersection Observer](https://img.shields.io/badge/Lazy%20Loading-Optimized-4CAF50?style=for-the-badge)

</div>

<br />

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/StevenACZ/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `bun run dev`     | Start development server |
| `bun run build`   | Create production build  |
| `bun run preview` | Preview production build |
| `bun run format`  | Format with Prettier     |
| `bun run lint`    | Run ESLint checks        |

<br />

## 📁 Project Structure

```
src/
├── App.vue                 # Root app layout
├── main.js                 # Vue entry point
├── 📂 components/          # Vue components
│   ├── 📂 icons/           # SVG tech icons
│   ├── HeroSection.vue     # 3D hero with particle system
│   ├── Navbar.vue          # Desktop navigation
│   ├── MobileNav.vue       # Mobile hamburger menu
│   ├── SkillsSection.vue   # Tech stack with filters
│   ├── ProjectsSection.vue # Project showcase
│   └── ...                 # Other UI components
├── 📂 config/              # Configuration files
│   └── threeScene.js       # 3D particle system config
├── 📂 data/                # Content data
│   ├── projects.js         # Portfolio projects
│   ├── skills.js           # Tech skills & categories
│   └── experiences.js      # Work experience
├── 📂 lib/                 # Shared libraries (GSAP setup)
└── 📂 styles/              # CSS stylesheets
    ├── globals.css         # CSS variables & base
    └── animations.css      # Animation classes
```

<br />

## 🎨 Featured Projects

<table>
<tr>
<td width="33%" align="center">

### PesoTracker

**macOS Weight Tracking App**

![Swift](https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white)
![SwiftUI](https://img.shields.io/badge/SwiftUI-0D96F6?style=flat-square&logo=swift&logoColor=white)

</td>
<td width="33%" align="center">

### BuenMouse

**macOS Productivity Tool**

![Swift](https://img.shields.io/badge/Swift-FA7343?style=flat-square&logo=swift&logoColor=white)
![macOS](https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white)

</td>
<td width="33%" align="center">

### WW2 MAP Films

**Interactive Historical Map**

![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=flat-square&logo=nuxtdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

</td>
</tr>
</table>

<br />

## 🌐 Deployment

### GitHub Actions (SSH Deploy)

On every push to `main`, GitHub Actions will:

1. Install dependencies with Bun
2. Run `format:check`, `lint`, `test:run`
3. Build the app (`dist/`)
4. Deploy via SSH + rsync to your server

Required GitHub Secrets:

- `HOST`
- `USERNAME`
- `SSH_KEY`
- `SSH_PORT` (optional, defaults to `22`)

Workflow: `.github/workflows/deploy.yml`

### Manual build (any static host)

```bash
# Create production build
bun run build

# Preview before deploying
bun run preview
```

The `dist/` folder is ready for deployment to any static hosting provider.

<br />

## 🤝 Connect

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-stevenacz.com-00D4FF?style=for-the-badge&logo=safari&logoColor=white)](https://stevenacz.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Steven%20Coaila-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/stevenacz)
[![GitHub](https://img.shields.io/badge/GitHub-StevenACZ-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/StevenACZ)

</div>

<br />

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by **Steven Coaila Zaa**

</div>
