import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { TranslateKeyPipe } from '../../i18n/translate-key.pipe';

@Component({
  selector: 'app-header-component',
  imports: [TranslateKeyPipe, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  private readonly localeService = inject(LocaleService);

  isSticky = signal(false);
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

  @HostListener('window:scroll')
  onScroll(): void {
    const shouldStick = window.scrollY > 50;
    this.isSticky.set(shouldStick);
  }
}
