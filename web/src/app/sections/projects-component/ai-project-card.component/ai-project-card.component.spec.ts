import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router } from '@angular/router';
import { AiProjectCardComponent } from './ai-project-card.component';
import { ProjectItem } from '../projects.component';
import { MESSAGES } from '../../../i18n/messages';
import { LocaleService } from '../../../services/locale/locale.service';

describe('AiProjectCardComponent', () => {
  let component: AiProjectCardComponent;
  let fixture: ComponentFixture<AiProjectCardComponent>;
  let mockProduct: ProjectItem;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    mockProduct = {
      id: 'test-app',
      title: 'Test App',
      type: 'Fullstack',
      shortDescription: 'PROJECTS_CARD_LUMA_SHORT_DESC',
      techStackMain: ['Flutter', 'Angular'],
      techStackExtended: ['Flutter', 'Supabase', 'Angular 21', 'Google Gemini API'],
      status: 'COMPLETED',
      isAiAssisted: true,
      year: 2026,
      fullDescription: 'PROJECTS_CARD_LUMA_FULL_DESC',
      keyFeatures: ['Feature 1'],
      favicon: 'assets/projects/luma/logo.png',
      links: {
        demo: 'https://example.com/demo',
        repo: 'https://github.com/example/repo',
      },
    };

    await TestBed.configureTestingModule({
      imports: [AiProjectCardComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: LocaleService, useValue: { getCurrentLocale: () => 'es' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should receive product input', () => {
    expect(component.product()).toBe(mockProduct);
  });

  it('should render the product title, type, short description and status', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.ai-project-card__title')?.textContent?.trim()).toBe('Test App');
    expect(native.querySelector('.ai-project-card__category')?.textContent?.trim()).toBe('Fullstack');
    expect(native.querySelector('.ai-project-card__description')?.textContent?.trim()).toBe(MESSAGES['PROJECTS_CARD_LUMA_SHORT_DESC']);
    expect(native.querySelector('.ai-project-card__status')?.textContent?.trim()).toContain(MESSAGES['PROJECTS_STATUS_COMPLETED']);
  });

  it('should render AI-assisted badge when isAiAssisted is true', () => {
    const native = fixture.nativeElement as HTMLElement;
    const badge = native.querySelector('.ai-project-card__ai-badge');

    expect(badge).not.toBeNull();
    expect(badge?.textContent?.trim()).toContain(MESSAGES['AI_ASSISTED_BADGE']);
  });

  it('should not render AI-assisted badge when isAiAssisted is false or undefined', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, isAiAssisted: false });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    expect(native.querySelector('.ai-project-card__ai-badge')).toBeNull();
  });

  it('should render extended technologies when provided', () => {
    const native = fixture.nativeElement as HTMLElement;
    const techs = Array.from(native.querySelectorAll('.ai-project-card__tech')).map((t) => t.textContent?.trim());

    expect(techs).toEqual(['Flutter', 'Supabase', 'Angular 21', 'Google Gemini API']);
  });

  it('should fall back to main stack when extended is not provided', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, techStackExtended: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const techs = Array.from(native.querySelectorAll('.ai-project-card__tech')).map((t) => t.textContent?.trim());

    expect(techs).toEqual(['Flutter', 'Angular']);
  });

  it('should render favicon/logo image', () => {
    const native = fixture.nativeElement as HTMLElement;
    const img = native.querySelector<HTMLImageElement>('.ai-project-card__logo img');

    expect(img).not.toBeNull();
    expect(img?.src).toContain('assets/projects/luma/logo.png');
    expect(img?.alt).toBe('Test App');
  });

  it('should render logo when favicon is not set', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, favicon: undefined, logo: 'assets/projects/luma/logo.png' });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const img = native.querySelector<HTMLImageElement>('.ai-project-card__logo img');

    expect(img).not.toBeNull();
    expect(img?.src).toContain('assets/projects/luma/logo.png');
  });

  it('should render icon when neither favicon nor logo is set', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, favicon: undefined, logo: undefined, icon: 'fa-solid fa-robot' });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const icon = native.querySelector<HTMLElement>('.ai-project-card__logo i');

    expect(icon).not.toBeNull();
    expect(icon?.classList.contains('fa-robot')).toBe(true);
  });

  it('should render primary explore action when demo link is present', () => {
    const native = fixture.nativeElement as HTMLElement;
    const exploreBtn = native.querySelector<HTMLAnchorElement>('.ai-project-card__action--primary');

    expect(exploreBtn).not.toBeNull();
    expect(exploreBtn?.href).toBe('https://example.com/demo');
    expect(exploreBtn?.target).toBe('_blank');
    expect(exploreBtn?.rel).toBe('noopener');
    expect(exploreBtn?.textContent?.trim()).toContain(MESSAGES['AI_ASSISTED_ACTION_EXPLORE']);
  });

  it('should render secondary code action when repo link is present', () => {
    const native = fixture.nativeElement as HTMLElement;
    const codeBtn = native.querySelector<HTMLAnchorElement>('.ai-project-card__action--secondary');

    expect(codeBtn).not.toBeNull();
    expect(codeBtn?.href).toBe('https://github.com/example/repo');
    expect(codeBtn?.target).toBe('_blank');
    expect(codeBtn?.rel).toBe('noopener');
    expect(codeBtn?.textContent?.trim()).toContain(MESSAGES['AI_ASSISTED_ACTION_CODE']);
  });

  it('should render view more action and navigate to work page on click', () => {
    const router = TestBed.inject(Router);
    const native = fixture.nativeElement as HTMLElement;
    const moreBtn = native.querySelector<HTMLButtonElement>('.ai-project-card__action--more');

    expect(moreBtn).not.toBeNull();
    expect(moreBtn?.textContent?.trim()).toContain(MESSAGES['AI_ASSISTED_ACTION_VIEW_MORE']);

    moreBtn?.click();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);
  });

  it('should trigger navigation on Enter and Space keydown events', () => {
    const router = TestBed.inject(Router);
    const native = fixture.nativeElement as HTMLElement;
    const moreBtn = native.querySelector<HTMLButtonElement>('.ai-project-card__action--more');

    moreBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);

    moreBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);
  });

  it('should still render footer and view more button when product links are undefined', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, links: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    expect(native.querySelector('.ai-project-card__footer')).not.toBeNull();
    expect(native.querySelector('.ai-project-card__action--primary')).toBeNull();
    expect(native.querySelector('.ai-project-card__action--secondary')).toBeNull();
    expect(native.querySelector('.ai-project-card__action--more')).not.toBeNull();
  });
});
