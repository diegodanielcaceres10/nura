import { Component } from '@angular/core';
import { HeaderComponent } from './components/header-component/header-component';
import { FooterComponent } from './components/footer-component/footer-component';
import { AboutComponent } from './sections/about-component/about-component';
import { ExperiencesComponent } from './sections/experiences-component/experiences-component';
import { ProjectsComponent } from './sections/projects-component/projects-component';
import { HomeComponent } from './sections/home-component/home-component';

@Component({
  selector: 'app-portfolio-page',
  imports: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ExperiencesComponent,
    ProjectsComponent,
  ],
  template: `
    <app-header-component />
    <main>
      <app-home-component />
      <app-about-component id="about" />
      <app-experiences-component id="experiences" />
      <app-projects-component id="projects" />
    </main>
    <app-footer-component id="contact" />
  `,
})
export class PortfolioPage {}
