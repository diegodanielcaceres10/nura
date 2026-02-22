import { Component, signal, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { AboutComponent } from './sections/about-component/about-component';
import { ExperiencesComponent } from './sections/experiences-component/experiences-component';
import { ProjectsComponent } from './sections/projects-component/projects-component';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe, AboutComponent, ExperiencesComponent, ProjectsComponent],
  templateUrl: './app.html',
})
export class App {
  isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 10);
  }
  constructor(private translate: TranslateService) {
    this.translate.use('es');
  }
}
