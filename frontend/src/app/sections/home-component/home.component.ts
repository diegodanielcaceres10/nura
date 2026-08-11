import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

export type TechBadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface TechBadge {
  icon: string;
  name: string;
  detail: string;
  position: TechBadgePosition;
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

  protected readonly fullName = input<string>('Diego Daniel Caceres');
  protected readonly roles = input<string>('Senior Full Stack & Mobile Engineer · Angular Developer');
  protected readonly secondaryCtaLabel = input<string>('Get In Touch');
  protected readonly profileImage = input<string>('assets/diegodanielcaceres/photo.png');
  protected readonly profileImageAlt = input<string>('Diego Daniel Caceres');
  protected readonly techBadges = input<TechBadge[]>([
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

  protected currentLang = this.localeService.getCurrentLocale();
}
