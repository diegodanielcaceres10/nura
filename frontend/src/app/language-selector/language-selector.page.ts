import { Component, OnInit, inject, signal } from '@angular/core';
import { LocaleService } from '../services/locale/locale.service';

const REDIRECT_DELAY_MS = 1500;

export interface LanguageOption {
  code: string;
  locale: string;
  name: string;
  description: string;
}

export interface QuickLink {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: 'app-language-selector-page',
  standalone: true,
  imports: [],
  templateUrl: './language-selector.page.html',
  styleUrl: './language-selector.page.scss',
})
export class LanguageSelectorPage implements OnInit {
  private readonly localeService = inject(LocaleService);

  protected readonly redirecting = signal(true);

  ngOnInit(): void {
    const detected = LocaleService.resolveStartupLocale();
    if (detected) {
      setTimeout(() => this.localeService.changeLocale(detected), REDIRECT_DELAY_MS);
    } else {
      this.redirecting.set(false);
    }
  }

  protected readonly languages: LanguageOption[] = [
    { code: 'ES', locale: 'es', name: 'Español', description: 'Ver portfolio en español' },
    { code: 'EN', locale: 'en', name: 'English', description: 'View portfolio in English' },
    {
      code: 'PT',
      locale: 'pt',
      name: 'Português',
      description: 'Ver portfólio em português',
    },
  ];

  protected readonly channels: QuickLink[] = [
    { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-daniel-caceres-1328991aa' },
    { icon: 'fa-brands fa-github', label: 'GitHub', url: 'https://github.com/diegodanielcaceres10' },
    { icon: 'fa-brands fa-npm', label: 'npm', url: 'https://www.npmjs.com/~diegodanielcaceres10' },
  ];

  selectLanguage(lang: string): void {
    this.localeService.changeLocale(lang);
  }
}
