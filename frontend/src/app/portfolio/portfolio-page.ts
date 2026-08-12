import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header-component/header-component';
import { HomeComponent } from '../sections/home-component/home.component';
import { ExperiencesComponent } from '../sections/experiences-component/experiences.component';
import { RecommendationsComponent } from '../sections/recommendations-component/recommendations.component';
import { AboutComponent } from '../sections/about-component/about.component';
import { LocaleService } from '../services/locale/locale.service';
import { ScrollService } from '../services/scroll/scroll.service';

@Component({
  selector: 'app-portfolio-page',
  imports: [RouterLink, HeaderComponent, HomeComponent, ExperiencesComponent, RecommendationsComponent, AboutComponent],
  templateUrl: './portfolio-page.html',
  styleUrl: './portfolio-page.scss',
})
export class PortfolioPage {
  private readonly scrollService = inject(ScrollService);
  private readonly localeService = inject(LocaleService);
  isSticky = this.scrollService.isSticky;
  currentLang = this.localeService.getCurrentLocale();
}
