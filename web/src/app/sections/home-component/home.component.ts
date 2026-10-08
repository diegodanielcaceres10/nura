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

  protected currentLang = this.localeService.getCurrentLocale();
}
