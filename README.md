# Diego Daniel Cáceres

Frontend Developer | Angular & TypeScript Specialist

## About This Portfolio

Welcome to my portfolio. Here you will find projects built with modern frontend and mobile technologies. This space showcases my experience with Angular, TypeScript, Flutter, and Node.js, focusing on scalable, maintainable, and user-friendly applications.

## Why “Nura”?

The name “Nura” originates from the Arabic word “Nur” (نور), meaning light, brightness, illumination, and clarity. In a deeper sense, it is also associated with knowledge, guidance, inspiration, and revelation — concepts connected to discovery and making visible what was previously unseen.

As a brand, Nura represents the idea of bringing projects into the light: showcasing, communicating, and sharing creations with the world. Light serves as a metaphor for talent, creativity, and technology applied to build digital solutions. It is not only about visibility, but also about providing clarity, value, and direction through the work being created.

Nura is conceived as a modern, minimalist, and technology-oriented identity, capable of evolving and scaling across multiple projects while maintaining a coherent conceptual foundation. The brand conveys innovation, professionalism, simplicity, and elegance, supported by clean and contemporary visual principles.

Conceptually, Nura is associated with:

- Illumination of knowledge
- Creativity made visible
- Technology as a tool for transformation
- Connection between ideas and execution
- Clarity in design and development

This meaning serves as a strategic foundation for future projects under the same identity, enabling long-term narrative and visual consistency.

## Why Angular?

I chose Angular as my primary frontend framework because it provides:

- Strong typing and maintainable architecture with TypeScript
- Scalability suitable for enterprise-level applications
- Powerful reactive programming with RxJS
- Seamless integration with REST APIs and modern tooling

---

## Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Angular 21                  |
| Language  | TypeScript                  |
| Styling   | SCSS                        |
| Rendering | CSR (Client Side Rendering) |
| i18n      | @ngx-translate (EN, ES, PT) |
| Testing   | Vitest                      |
| CI/CD     | GitHub Actions              |
| Hosting   | GitHub Pages                |

---

## CI/CD

![Deploy](https://github.com/diegodanielcaceres10/nura/actions/workflows/deploy.yml/badge.svg)

This project uses **GitHub Actions** for continuous integration and deployment:

- **On every push to `main`**: dependencies are installed, tests run with Vitest, and the app is built with SSG
- **Test results** are published directly in the GitHub Actions summary via `dorny/test-reporter`
- **Automatic deployment** to GitHub Pages using `actions/deploy-pages`
- **Concurrency control** cancels previous runs when a new push is detected

---

## 🎨 Design System: Color Palette

This project uses a custom color scale based on **Deep Purple** and **Turquoise** to ensure visual hierarchy and accessibility.

### Primary Palette (Purple Base: `#521F57`)

| Shade      | Token                    | Hex       | Preview                                           | Use Case             |
| :--------- | :----------------------- | :-------- | :------------------------------------------------ | :------------------- |
| **Light**  | `--color-primary-light`  | `#F3EBF4` | ![](https://via.placeholder.com/15/F3EBF4?text=+) | Backgrounds / Alerts |
| **Medium** | `--color-primary-medium` | `#9B86BD` | ![](https://via.placeholder.com/15/9B86BD?text=+) | Borders / Icons      |
| **Main**   | `--color-primary-main`   | `#521F57` | ![](https://via.placeholder.com/15/521F57?text=+) | **Brand Identity**   |
| **Dark**   | `--color-primary-dark`   | `#3A163E` | ![](https://via.placeholder.com/15/3A163E?text=+) | High-contrast Text   |

### Secondary Palette (Accent: `#2CABB3`)

| Shade     | Token                     | Hex       | Preview                                           | Use Case                   |
| :-------- | :------------------------ | :-------- | :------------------------------------------------ | :------------------------- |
| **Main**  | `--color-secondary-main`  | `#2CABB3` | ![](https://via.placeholder.com/15/2CABB3?text=+) | **Primary CTAs / Buttons** |
| **Hover** | `--color-secondary-hover` | `#248C92` | ![](https://via.placeholder.com/15/248C92?text=+) | Interaction States         |

---

### 🚀 Implementation (SCSS)

Colors are managed via CSS Custom Properties for runtime flexibility and SCSS variables for compilation logic.

```scss
// Main Action Color usage
.button--primary {
  background-color: var(--color-secondary-main);
  &:hover {
    background-color: var(--color-secondary-hover);
  }
}
```

## How to Run

```bash
docker-compose up
```
