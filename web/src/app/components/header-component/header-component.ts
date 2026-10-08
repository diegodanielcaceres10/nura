import { Component, ElementRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { ScrollService } from '../../services/scroll/scroll.service';

@Component({
  selector: 'app-header-component',
  imports: [TranslateKeyPipe, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class HeaderComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly localeService = inject(LocaleService);
  private readonly scrollService = inject(ScrollService);

  isSticky = this.scrollService.isSticky;

  isMenuOpen = signal(false);
  isLangOpen = signal(false);
  currentLang = signal<string>('en');

  // Names are written in their own language on purpose.
  langs = [
    { code: 'es', flag: 'ES', name: 'Español' },
    { code: 'en', flag: 'EN', name: 'English' },
    { code: 'pt', flag: 'PT', name: 'Português' },
  ];

  currentLangOption = computed(() => this.langs.find((lang) => lang.code === this.currentLang()) ?? this.langs[0]);

  constructor() {
    this.currentLang.set(this.localeService.getCurrentLocale());
  }

  changeLang(lang: string): void {
    this.localeService.changeLocale(lang);
  }

  selectLang(code: string): void {
    this.isLangOpen.set(false);
    if (code !== this.currentLang()) {
      this.changeLang(code);
    }
  }

  toggleLang(): void {
    this.isLangOpen.update((open) => !open);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    event.preventDefault();
    this.isLangOpen.set(true);
    // Wait for the listbox to render before moving focus into it.
    afterNextRender(() => this.focusOption(this.langs.findIndex((lang) => lang.code === this.currentLang())), { injector: this.injector });
  }

  onOptionKeydown(event: KeyboardEvent, index: number): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    this.focusOption((index + step + this.langs.length) % this.langs.length);
  }

  onDocumentClick(event: Event): void {
    if (this.isLangOpen() && !this.host.nativeElement.querySelector('.header__langs')?.contains(event.target as Node)) {
      this.isLangOpen.set(false);
    }
  }

  onEscape(): void {
    if (!this.isLangOpen()) return;

    this.isLangOpen.set(false);
    this.host.nativeElement.querySelector<HTMLElement>('.header__langs-trigger')?.focus();
  }

  toogleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  private focusOption(index: number): void {
    this.host.nativeElement.querySelectorAll<HTMLElement>('.header__lang')[index]?.focus();
  }
}
