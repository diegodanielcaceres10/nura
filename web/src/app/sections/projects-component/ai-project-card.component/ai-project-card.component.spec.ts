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
      bannerImage: 'assets/projects/luma/banner.png',
      gallery: ['assets/projects/luma/screen-login.png', 'assets/projects/luma/screen-home.png'],
      aiMetrics: [
        { value: '3', labelKey: 'LUMA_METRIC_CLIENTS', icon: 'fa-solid fa-users' },
        { value: '1.200+', labelKey: 'LUMA_METRIC_TRANSACTIONS', icon: 'fa-solid fa-arrow-right-arrow-left' },
        { value: 'Gemini AI', labelKey: 'LUMA_METRIC_AI_SCAN', icon: 'fa-solid fa-wand-magic-sparkles' },
      ],
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

  it('should render banner image as background when bannerImage is provided', () => {
    const native = fixture.nativeElement as HTMLElement;
    const img = native.querySelector<HTMLImageElement>('.ai-project-card__bg-img');

    expect(img).not.toBeNull();
    expect(img?.src).toContain('assets/projects/luma/banner.png');
    expect(img?.alt).toBe('Test App');
  });

  it('should fallback to gallery image if bannerImage is not set', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, bannerImage: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const img = native.querySelector<HTMLImageElement>('.ai-project-card__bg-img');

    expect(img).not.toBeNull();
    expect(img?.src).toContain('assets/projects/luma/screen-home.png');
  });

  it('should fallback to logo/favicon when neither bannerImage nor gallery are present', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, bannerImage: undefined, gallery: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const fallbackLogo = native.querySelector<HTMLImageElement>('.ai-project-card__bg-fallback img');

    expect(fallbackLogo).not.toBeNull();
    expect(fallbackLogo?.src).toContain('assets/projects/luma/logo.png');
  });

  it('should navigate to work page when card is clicked or triggered by keyboard', () => {
    const router = TestBed.inject(Router);
    const native = fixture.nativeElement as HTMLElement;
    const card = native.querySelector<HTMLElement>('.ai-project-card');

    card?.click();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);

    card?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);

    card?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);
  });

  it('should render usage metrics when aiMetrics are provided', () => {
    const native = fixture.nativeElement as HTMLElement;
    const metricItems = native.querySelectorAll('.ai-project-card__metric');

    expect(metricItems.length).toBe(3);

    const values = Array.from(native.querySelectorAll('.ai-project-card__metric-value')).map((el) => el.textContent?.trim());
    expect(values).toEqual(['3', '1.200+', 'Gemini AI']);

    const labels = Array.from(native.querySelectorAll('.ai-project-card__metric-label')).map((el) => el.textContent?.trim());
    expect(labels).toEqual([
      MESSAGES['LUMA_METRIC_CLIENTS'],
      MESSAGES['LUMA_METRIC_TRANSACTIONS'],
      MESSAGES['LUMA_METRIC_AI_SCAN'],
    ]);

    const icons = Array.from(native.querySelectorAll('.ai-project-card__metric i')).map((el) => el.className);
    expect(icons[0]).toContain('fa-users');
    expect(icons[1]).toContain('fa-arrow-right-arrow-left');
    expect(icons[2]).toContain('fa-wand-magic-sparkles');
  });

  it('should not render metrics container when aiMetrics is empty or undefined', () => {
    fixture.componentRef.setInput('product', { ...mockProduct, aiMetrics: undefined });
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    expect(native.querySelector('.ai-project-card__metrics')).toBeNull();
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

  it('should trigger navigation on Enter and Space keydown events on view more button', () => {
    const router = TestBed.inject(Router);
    const native = fixture.nativeElement as HTMLElement;
    const moreBtn = native.querySelector<HTMLButtonElement>('.ai-project-card__action--more');

    moreBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);

    moreBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'es', 'work', 'test-app']);
  });
});
