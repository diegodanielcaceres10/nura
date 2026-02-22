import { Component } from '@angular/core';
import { HeaderComponent } from './components/header-component/header-component';
import { FooterComponent } from './components/footer-component/footer-component';
import { AboutComponent } from './sections/about-component/about-component';
import { ExperiencesComponent } from './sections/experiences-component/experiences-component';
import { ProjectsComponent } from './sections/projects-component/projects-component';

@Component({
  selector: 'app-root',
  imports: [
    AboutComponent,
    ExperiencesComponent,
    ProjectsComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
})
export class App {}
