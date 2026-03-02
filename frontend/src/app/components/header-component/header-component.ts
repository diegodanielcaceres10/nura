import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { ScrollService } from '../../services/scroll/scroll.service';

@Component({
  selector: 'app-header-component',
  imports: [TranslateKeyPipe, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  private readonly localeService = inject(LocaleService);
  private readonly scrollService = inject(ScrollService);
  isSticky = this.scrollService.isSticky;

  isMenuOpen = signal(false);
  currentLang = signal<string>('en');

  langs = [
    { code: 'es', flag: 'ES' },
    { code: 'en', flag: 'EN' },
    { code: 'pt', flag: 'PT' },
  ];

  constructor() {
    this.currentLang.set(this.localeService.getCurrentLocale());
  }

  changeLang(lang: string): void {
    this.localeService.changeLocale(lang);
  }

  toogleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
}
