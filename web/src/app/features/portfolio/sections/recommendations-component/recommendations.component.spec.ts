import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RecommendationsComponent, Testimonial } from './recommendations.component';

describe('RecommendationsComponent', () => {
  let component: RecommendationsComponent;
  let fixture: ComponentFixture<RecommendationsComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [RecommendationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the recommendations section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.recommendations')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render the three published recommendations', () => {
    const native = fixture.nativeElement as HTMLElement;
    const names = Array.from(native.querySelectorAll('.recommendations__name')).map((name) => name.textContent?.trim());

    expect(names).toEqual(['Bruno Zanon', 'Paulo César Rodrigues', 'Marisa Rosana Paredes']);
  });

  describe('with controlled testimonials', () => {
    const withLinkedin: Testimonial = {
      avatar: 'assets/test/ana.jpg',
      name: 'Ana Test',
      linkedinUrl: 'https://www.linkedin.com/in/ana-test/',
      role: 'Engineering Manager',
      quote: 'Great teammate.',
      duration: '3+',
      location: 'Chile',
      lang: 'Español',
    };
    const withoutLinkedin: Testimonial = {
      avatar: 'assets/test/luis.jpg',
      name: 'Luis Test',
      role: 'Designer',
      quote: 'Pleasure to work with.',
      duration: '2+',
      location: 'Peru',
      lang: 'English',
    };

    // Testimonials are hardcoded in the component, so they are replaced before the first change detection
    const render = (testimonials: Testimonial[]): HTMLElement => {
      const controlled = TestBed.createComponent(RecommendationsComponent);
      (controlled.componentInstance as unknown as { testimonials: Testimonial[] }).testimonials = testimonials;
      controlled.detectChanges();
      return controlled.nativeElement;
    };

    it('should render one card per testimonial with its details', () => {
      const cards = render([withLinkedin, withoutLinkedin]).querySelectorAll('.recommendations__card');
      const first = cards[0];
      const avatar = first.querySelector('.recommendations__avatar') as HTMLImageElement;

      expect(cards.length).toBe(2);
      expect(first.querySelector('.recommendations__name')?.textContent?.trim()).toBe('Ana Test');
      expect(first.querySelector('.recommendations__role')?.textContent?.trim()).toBe('Engineering Manager');
      expect(first.querySelector('.recommendations__quote')?.textContent?.trim()).toBe('Great teammate.');
      expect(first.querySelector('.recommendations__lang')?.textContent).toContain('Chile');
      expect(first.querySelector('.recommendations__lang')?.textContent).toContain('Español');
      expect(first.querySelector('.recommendations__footer')?.textContent).toContain('3+');
      expect(avatar.getAttribute('src')).toBe('assets/test/ana.jpg');
      expect(avatar.getAttribute('alt')).toBe('Ana Test');
    });

    it('should render the LinkedIn link only for testimonials that have one', () => {
      const cards = render([withLinkedin, withoutLinkedin]).querySelectorAll('.recommendations__card');
      const link = cards[0].querySelector('.recommendations__linkedin') as HTMLAnchorElement;

      expect(link.getAttribute('href')).toBe('https://www.linkedin.com/in/ana-test/');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener');
      expect(link.getAttribute('aria-label')).toBe('View Ana Test on LinkedIn');
      expect(cards[1].querySelector('.recommendations__linkedin')).toBeNull();
    });

    it('should hide decorative icons from assistive technologies', () => {
      const native = render([withLinkedin, withoutLinkedin]);

      expect(native.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(7);
    });
  });
});
