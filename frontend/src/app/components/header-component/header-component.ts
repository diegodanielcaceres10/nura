import { Component, HostListener, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-component',
  imports: [TranslatePipe],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  isSticky = signal(false);
  isMenuOpen = signal(false);
  currentLang = signal<string>('en');

  langs = [
    { code: 'es', flag: 'ES' },
    { code: 'en', flag: 'EN' },
    { code: 'pt', flag: 'PT' },
  ];

  constructor(private translate: TranslateService) {
    this.currentLang.set(this.translate.getCurrentLang() ?? 'en');
  }

  changeLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
  }

  toogleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isSticky.set(window.scrollY > 50);
  }
}
