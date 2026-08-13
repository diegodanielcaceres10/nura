import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from '../services/locale/locale.service';
import { LanguageSelectorPage } from './language-selector.page';

describe('LanguageSelectorPage', () => {
  let component: LanguageSelectorPage;
  let fixture: ComponentFixture<LanguageSelectorPage>;
  let localeService: { changeLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localeService = {
      changeLocale: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorPage],
      providers: [{ provide: LocaleService, useValue: localeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render uppercase language codes and CTAs', () => {
    const root = fixture.nativeElement as HTMLElement;
    const text = root.textContent ?? '';

    expect(text).toContain('ES');
    expect(text).toContain('EN');
    expect(text).toContain('PT');
    expect(text).toContain('Entrar');
    expect(text).toContain('Enter');
    expect(text).toContain('Acessar');
  });

  it('should render language cards as keyboard reachable buttons', () => {
    const cards = fixture.nativeElement.querySelectorAll('.lang-card') as NodeListOf<HTMLAnchorElement>;

    Array.from(cards).forEach((card) => {
      expect(card.getAttribute('role')).toBe('button');
      expect(card.getAttribute('tabindex')).toBe('0');
    });
  });

  it('should change locale when clicking each language card', () => {
    const cards = fixture.nativeElement.querySelectorAll('.lang-card') as NodeListOf<HTMLAnchorElement>;

    Array.from(cards).forEach((card) => card.click());

    expect(localeService.changeLocale).toHaveBeenNthCalledWith(1, 'es');
    expect(localeService.changeLocale).toHaveBeenNthCalledWith(2, 'en');
    expect(localeService.changeLocale).toHaveBeenNthCalledWith(3, 'pt');
  });

  it('should change locale when pressing Enter on a language card', () => {
    const cards = fixture.nativeElement.querySelectorAll('.lang-card') as NodeListOf<HTMLAnchorElement>;

    cards[1].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

    expect(localeService.changeLocale).toHaveBeenCalledWith('en');
  });
});
