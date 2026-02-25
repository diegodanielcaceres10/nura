import { Component } from '@angular/core';
import { HeaderComponent } from './components/header-component/header-component';
import { FooterComponent } from './components/footer-component/footer-component';
import { AboutComponent } from './sections/about-component/about-component';
import { ExperiencesComponent } from './sections/experiences-component/experiences-component';
import { ProjectsComponent } from './sections/projects-component/projects-component';
import { HomeComponent } from './sections/home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ExperiencesComponent,
    ProjectsComponent,
  ],
  templateUrl: './app.html',
})
export class App {}
