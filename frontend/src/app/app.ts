import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    const supportedLangs = ['es', 'en', 'pt'];
    const browserLang = TranslateService.getBrowserLang() ?? 'en';
    const lang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    this.translate.use(lang);
  }
}
