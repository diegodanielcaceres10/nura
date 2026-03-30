import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LocaleService } from '../services/locale/locale.service';

interface LanguageCard {
  code: 'es' | 'en' | 'pt';
  title: string;
  badge: string;
  cta: string;
}

@Component({
  selector: 'app-language-selector-page',
  imports: [UpperCasePipe],
  templateUrl: './language-selector-page.html',
  styleUrl: './language-selector-page.scss',
})
export class LanguageSelectorPage {
  readonly languages: LanguageCard[] = [
    {
      code: 'es',
      title: 'Espanol',
      badge: 'LATAM + España',
      cta: 'Entrar',
    },
    {
      code: 'en',
      title: 'English',
      badge: 'Global',
      cta: 'Enter',
    },
    {
      code: 'pt',
      title: 'Portugues',
      badge: 'Brasil',
      cta: 'Acessar',
    },
  ];
  private readonly localeService = inject(LocaleService);

  selectLanguage(lang: string): void {
    this.localeService.changeLocale(lang);
  }
}
