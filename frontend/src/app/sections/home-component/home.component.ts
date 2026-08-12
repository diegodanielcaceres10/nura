import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { CaseStudyComponent } from '../case-study-component/case-study.component';

export type TechBadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface TechBadge {
  icon: string;
  name: string;
  detail: string;
  position: TechBadgePosition;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface TechIcon {
  icon: string;
  name: string;
}

export interface TechCategory {
  headerIcon: string;
  label: string;
  technologies: TechIcon[];
  caption: string;
}

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, TranslateKeyPipe, CaseStudyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly localeService = inject(LocaleService);

  protected readonly fullName = signal<string>('Diego Daniel Caceres');
  protected readonly roles = signal<string>('Senior Full Stack & Mobile Engineer · Angular Developer');
  protected readonly secondaryCtaLabel = signal<string>('Get In Touch');
  protected readonly profileImage = signal<string>('assets/diegodanielcaceres/photo.png');
  protected readonly profileImageAlt = signal<string>('Diego Daniel Caceres');
  protected readonly techBadges = signal<TechBadge[]>([
    { icon: 'assets/logos/angular.png', name: 'Angular', detail: 'v21', position: 'top-left' },
    { icon: 'assets/logos/ionic.png', name: 'Ionic', detail: 'Capacitor', position: 'top-right' },
    { icon: 'assets/logos/node.png', name: 'Node.js', detail: 'Express', position: 'bottom-left' },
    {
      icon: 'assets/logos/cloud.png',
      name: 'Cloud & DevOps',
      detail: 'Docker · Azure',
      position: 'bottom-right',
    },
  ]);

  protected readonly stats = signal<StatItem[]>([
    { icon: 'fa-solid fa-user-tie', value: '40+', label: 'HOME_STATS_CLIENTS_LABEL', description: 'HOME_STATS_CLIENTS_DESCRIPTION' },
    { icon: 'fa-solid fa-users', value: '+1000', label: 'HOME_STATS_USERS_LABEL', description: 'HOME_STATS_USERS_DESCRIPTION' },
    {
      icon: 'fa-solid fa-shield-halved',
      value: '>95%',
      label: 'HOME_STATS_AVAILAVILITY_LABEL',
      description: 'HOME_STATS_AVAILAVILITY_DESCRIPTION',
    },
    { icon: 'fa-solid fa-rocket', value: '5 min', label: 'HOME_STATS_DEPLOY_LABEL', description: 'HOME_STATS_DEPLOY_DESCRIPTION' },
    { icon: 'fa-solid fa-chart-line', value: '50%', label: 'HOME_STATS_COST_LABEL', description: 'HOME_STATS_COST_DESCRIPTION' },
  ]);

  protected readonly categories = signal<TechCategory[]>([
    {
      headerIcon: 'fa-solid fa-desktop',
      label: 'Frontend',
      technologies: [
        { icon: 'assets/logos/angular.png', name: 'Angular' },
        { icon: 'assets/logos/react.png', name: 'React' },
      ],
      caption: 'Angular (AngularJS · v21) · React · TypeScript · JavaScript · HTML5 · CSS3',
    },
    {
      headerIcon: 'fa-solid fa-mobile-screen',
      label: 'Mobile',
      technologies: [
        { icon: 'assets/logos/ionic.png', name: 'Ionic' },
        { icon: 'assets/logos/capacitor.png', name: 'Capacitor' },
        { icon: 'assets/logos/cordova.png', name: 'Cordova' },
      ],
      caption: 'Ionic · Capacitor · Cordova',
    },
    {
      headerIcon: 'fa-solid fa-server',
      label: 'Backend',
      technologies: [
        { icon: 'assets/logos/node.png', name: 'Node.js' },
        { icon: 'assets/logos/php.png', name: 'PHP' },
        { icon: 'assets/logos/mysql.png', name: 'MySQL' },
      ],
      caption: 'Node.js · PHP · MySQL · REST APIs',
    },
    {
      headerIcon: 'fa-solid fa-cloud',
      label: 'Cloud & DevOps',
      technologies: [
        { icon: 'assets/logos/docker.png', name: 'Docker' },
        { icon: 'assets/logos/azure.png', name: 'Azure' },
        { icon: 'assets/logos/aws.png', name: 'AWS' },
      ],
      caption: 'Docker · Azure · AWS · CI/CD · Cloudflare R2 · Firebase',
    },
  ]);

  protected currentLang = this.localeService.getCurrentLocale();
}
