import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

export type TechBadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface TechBadge {
  icon: string;
  name: string;
  position: TechBadgePosition;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface TechCategory {
  label: string;
  technologies: string[];
}

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, TranslateKeyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly localeService = inject(LocaleService);

  protected readonly techBadges: TechBadge[] = [
    { icon: 'assets/logos/angular.png', name: 'Angular', position: 'top-left' },
    { icon: 'assets/logos/ionic.png', name: 'Ionic', position: 'top-right' },
    { icon: 'assets/logos/typescript.png', name: 'Typescript', position: 'bottom-left' },
    {
      icon: 'assets/logos/cloud.png',
      name: 'Cloud',
      position: 'bottom-right',
    },
  ];

  protected readonly categories: TechCategory[] = [
    {
      label: 'Frontend',
      technologies: ['Angular (v11 a v21)', 'AngularJS', 'TypeScript', 'JavaScript', 'RxJS', 'Signals', 'React', 'HTML5', 'CSS3/SCSS', 'Angular Material', 'Vitest', 'Cypress', 'Storybook'],
    },
    {
      label: 'Mobile',
      technologies: ['Ionic', 'Capacitor', 'Cordova', 'Flutter'],
    },
    {
      label: 'Backend',
      technologies: ['Node.js', 'Express', 'PHP', 'MySQL', 'REST APIs'],
    },
    {
      label: 'Cloud & DevOps',
      technologies: ['Azure', 'Azure DevOps', 'Docker', 'CI/CD', 'Cloudflare R2', 'Firebase'],
    },
  ];

  protected currentLang = this.localeService.getCurrentLocale();
}
