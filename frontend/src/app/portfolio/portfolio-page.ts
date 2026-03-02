import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header-component/header-component';
import { FooterComponent } from '../components/footer-component/footer-component';
import { AboutComponent } from '../sections/about-component/about-component';
import { ExperiencesComponent } from '../sections/experiences-component/experiences-component';
import { ProjectsComponent } from '../sections/projects-component/projects-component';
import { HomeComponent } from '../sections/home-component/home-component';
import { ScrollService } from '../services/scroll/scroll.service';

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterLink, HeaderComponent, FooterComponent, HomeComponent, AboutComponent, ExperiencesComponent, ProjectsComponent],
  templateUrl: './portfolio-page.html',
  styleUrl: './portfolio-page.scss',
})
export class PortfolioPage {
  private readonly scrollService = inject(ScrollService);
  isSticky = this.scrollService.isSticky;
}
