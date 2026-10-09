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

export interface HomeMetric {
  value: string;
  label: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface TechCategory {
  id: string;
  labelKey: string;
  skills: readonly string[];
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

  protected readonly metrics: HomeMetric[] = [
    { value: '60 min → 5 min', label: 'HOME_METRIC_01_LABEL' },
    { value: '-50%', label: 'HOME_METRIC_02_LABEL' },
    { value: '-50%', label: 'HOME_METRIC_03_LABEL' },
    { value: '-60%', label: 'HOME_METRIC_04_LABEL' },
  ];

  protected readonly skillCategories: readonly TechCategory[] = [
    {
      id: 'frontend',
      labelKey: 'HOME_SKILLS_FRONTEND',
      skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Signals', 'HTML', 'CSS/SCSS', 'Tailwind CSS', 'Bootstrap', 'Angular Material', 'React'],
    },
    {
      id: 'mobile',
      labelKey: 'HOME_SKILLS_MOBILE',
      skills: ['Ionic', 'Capacitor', 'Cordova', 'Flutter'],
    },
    {
      id: 'testing',
      labelKey: 'HOME_SKILLS_TESTING',
      skills: ['Vitest', 'Jasmine', 'Karma', 'Cypress', 'ESLint', 'Storybook', 'Lighthouse CI'],
    },
    {
      id: 'architecture',
      labelKey: 'HOME_SKILLS_ARCHITECTURE',
      skills: ['Microfrontends'],
    },
    {
      id: 'backend',
      labelKey: 'HOME_SKILLS_BACKEND',
      skills: ['Node.js', 'Express', 'APIs REST', 'Swagger', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'Azure', 'Cloudflare R2'],
    },
    {
      id: 'tools',
      labelKey: 'HOME_SKILLS_TOOLS',
      skills: ['Git', 'Azure DevOps', 'CI/CD', 'Docker', 'Jira'],
    },
    {
      id: 'ai',
      labelKey: 'HOME_SKILLS_AI',
      skills: ['Claude Code', 'Copilot', 'Codex', 'Antigravity', 'Gemini'],
    },
    {
      id: 'methodologies',
      labelKey: 'HOME_SKILLS_METHODOLOGIES',
      skills: ['Scrum', 'Kanban'],
    },
  ];

  protected currentLang = this.localeService.getCurrentLocale();
}
