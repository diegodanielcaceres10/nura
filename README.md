# Diego Daniel Cáceres

Senior Frontend Engineer | Angular & TypeScript Specialist

## About This Portfolio

Welcome to my portfolio. Here you will find projects built with modern frontend and mobile technologies. This space showcases my experience with Angular, TypeScript, Flutter, and Node.js, focusing on scalable, maintainable, and user-friendly applications.

## Why “Nura”?

The name “Nura” originates from the Arabic word “Nur” (نور), meaning light, brightness, illumination, and clarity. In a deeper sense, it is also associated with knowledge, guidance, inspiration, and revelation — concepts connected to discovery and making visible what was previously unseen.

As a brand, Nura represents the idea of bringing projects into the light: showcasing, communicating, and sharing creations with the world. Light serves as a metaphor for talent, creativity, and technology applied to build digital solutions. It is not only about visibility, but also about providing clarity, value, and direction through the work being created.

Nura is conceived as a modern, minimalist, and technology-oriented identity, capable of evolving and scaling across multiple projects while maintaining a coherent conceptual foundation. The brand conveys innovation, professionalism, simplicity, and elegance, supported by clean and contemporary visual principles.

This meaning serves as a strategic foundation for future projects under the same identity, enabling long-term narrative and visual consistency.

## Why Angular?

I chose Angular as my primary frontend framework because it provides:

- Strong typing and maintainable architecture with TypeScript
- Scalability suitable for enterprise-level applications
- Powerful reactive programming with RxJS
- Seamless integration with REST APIs and modern tooling

---

## Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Framework | Angular 21                     |
| Language  | TypeScript                     |
| Styling   | SCSS                           |
| Rendering | SSR (Local) & SSG (Production) |
| i18n      | @ngx-translate (EN, ES, PT)    |
| Testing   | Vitest & Cypress               |
| CI/CD     | GitHub Actions                 |
| Hosting   | GitHub Pages                   |

---

## CI/CD

![Deploy](https://github.com/diegodanielcaceres10/nura/actions/workflows/deploy.yml/badge.svg)

This project uses **GitHub Actions** for continuous integration and deployment:

- **On every push to `main`**: dependencies are installed, tests run with Vitest, and the app is built with SSG
- **Test results** are published directly in the GitHub Actions summary via `dorny/test-reporter`
- **Automatic deployment** to GitHub Pages using `actions/deploy-pages`
- **Concurrency control** cancels previous runs when a new push is detected

---

## How to Run

```bash
docker-compose up
```
