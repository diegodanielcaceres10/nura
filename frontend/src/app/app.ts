import { Component } from '@angular/core';
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
  constructor(private translate: TranslateService) {
    const supportedLangs = ['es', 'en', 'pt'];
    const browserLang =
      navigator.languages.map((l) => l.split('-')[0]).find((l) => supportedLangs.includes(l)) ??
      'en';

    this.translate.use(browserLang);
  }
}
