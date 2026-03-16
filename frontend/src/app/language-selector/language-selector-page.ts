import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface LanguageCard {
  code: 'es' | 'en' | 'pt';
  title: string;
  badge: string;
  cta: string;
}

@Component({
  selector: 'app-language-selector-page',
  imports: [RouterLink, UpperCasePipe],
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
}
