import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink } from '@angular/router';
import { PortfolioPage } from './portfolio-page';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { LocaleService } from '../services/locale/locale.service';
import { ScrollService } from '../services/scroll/scroll.service';

@Component({ selector: 'app-header-component', standalone: true, template: '' })
class HeaderStubComponent {}

@Component({ selector: 'app-home-component', standalone: true, template: '' })
class HomeStubComponent {}

@Component({ selector: 'app-experiences-component', standalone: true, template: '' })
class ExperiencesStubComponent {}

@Component({ selector: 'app-projects-component', standalone: true, template: '' })
class ProjectsStubComponent {}

@Component({ selector: 'app-recommendations-component', standalone: true, template: '' })
class RecommendationsStubComponent {}

@Component({ selector: 'app-about-component', standalone: true, template: '' })
class AboutStubComponent {}

@Component({ selector: 'app-contact-component', standalone: true, template: '' })
class ContactStubComponent {}

@Component({ selector: 'app-footer-component', standalone: true, template: '' })
class FooterStubComponent {}

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  const isSticky = signal(false);
  const localeService = { getCurrentLocale: vi.fn(() => 'en') };

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [
        provideRouter([]),
        { provide: LocaleService, useValue: localeService },
        { provide: ScrollService, useValue: { isSticky } },
      ],
    })
      .overrideComponent(PortfolioPage, {
        set: {
          imports: [
            RouterLink,
            HeaderStubComponent,
            HomeStubComponent,
            ExperiencesStubComponent,
            ProjectsStubComponent,
            RecommendationsStubComponent,
            AboutStubComponent,
            ContactStubComponent,
            FooterStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    isSticky.set(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isSticky signal from scrollService', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(component.isSticky()).toBe(false);
    expect(native.querySelector('.scroll_to_top')?.classList.contains('show')).toBe(false);

    isSticky.set(true);
    fixture.detectChanges();

    expect(component.isSticky()).toBe(true);
    expect(native.querySelector('.scroll_to_top')?.classList.contains('show')).toBe(true);
  });

  it('should have currentLang from localeService', () => {
    expect(component.currentLang).toBe('en');
    expect(localeService.getCurrentLocale).toHaveBeenCalledOnce();
  });

  it('should compose the expected page sections', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('app-header-component')).not.toBeNull();
    expect(native.querySelector('app-home-component')).not.toBeNull();
    expect(native.querySelector('app-experiences-component')).not.toBeNull();
    expect(native.querySelector('app-projects-component')).not.toBeNull();
    expect(native.querySelector('app-recommendations-component')).not.toBeNull();
    expect(native.querySelector('app-about-component')).not.toBeNull();
    expect(native.querySelector('app-contact-component')).not.toBeNull();
    expect(native.querySelector('app-footer-component')).not.toBeNull();
  });

  it('should link back to the localized home section', () => {
    const native = fixture.nativeElement as HTMLElement;
    const backToTopLink = native.querySelector<HTMLAnchorElement>('.scroll_to_top a');

    expect(backToTopLink?.getAttribute('href')).toBe('/en#home');
    expect(backToTopLink?.getAttribute('aria-label')).toBe('Back to top');
  });
});
