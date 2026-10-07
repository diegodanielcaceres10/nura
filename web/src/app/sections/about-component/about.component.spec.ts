import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MESSAGES } from '../../i18n/messages';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the about section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.about')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render the four content cards', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = native.querySelectorAll('article.about__card');

    expect(cards).toHaveLength(4);
  });

  it('should render the three degrees, newest first, with institution and year', () => {
    const native = fixture.nativeElement as HTMLElement;
    const degrees = Array.from(native.querySelectorAll('.about__education-degree')).map((degree) => degree.textContent?.trim());
    const institutions = Array.from(native.querySelectorAll('.about__education-institution')).map((institution) => institution.textContent?.trim());
    const meta = Array.from(native.querySelectorAll('.about__education-meta')).map((item) => item.textContent?.trim());

    expect(degrees).toEqual(['Computer Systems Analyst', 'Programmer Analyst', 'IT Technician']);
    expect(institutions).toEqual(['Institución Cervantes', 'Institución Cervantes', 'Institución Cervantes']);
    expect(meta).toEqual(['Argentina · 2020', 'Argentina · 2016', 'Argentina · 2015']);
  });

  it('should render the signature with alternative text', () => {
    const native = fixture.nativeElement as HTMLElement;
    const signature = native.querySelector<HTMLImageElement>('.about__signature img');

    expect(signature?.getAttribute('alt')).toBe('Diego Daniel Caceres Logo');
  });

  it('should render the three interests beyond work', () => {
    const native = fixture.nativeElement as HTMLElement;
    const titles = Array.from(native.querySelectorAll('.about__beyond-title')).map((title) => title.textContent?.trim());

    expect(titles).toEqual(['I love to travel', 'Photography', 'Good coffee']);
    expect(native.querySelectorAll('.about__beyond-description')).toHaveLength(3);
  });

  it('should render the beyond work texts from the translation table', () => {
    const keys = {
      ABOUT_BEYOND_TRAVEL_TITLE: 'travel-title',
      ABOUT_BEYOND_TRAVEL_DESCRIPTION: 'travel-description',
      ABOUT_BEYOND_PHOTO_TITLE: 'photo-title',
      ABOUT_BEYOND_PHOTO_DESCRIPTION: 'photo-description',
      ABOUT_BEYOND_COOFEE_TITLE: 'coffee-title',
      ABOUT_BEYOND_COOFEE_DESCRIPTION: 'coffee-description',
    };
    const original = Object.fromEntries(Object.keys(keys).map((key) => [key, MESSAGES[key]]));
    Object.assign(MESSAGES, keys);

    try {
      const translated = TestBed.createComponent(AboutComponent);
      translated.detectChanges();
      const native = translated.nativeElement as HTMLElement;
      const titles = Array.from(native.querySelectorAll('.about__beyond-title')).map((title) => title.textContent?.trim());
      const descriptions = Array.from(native.querySelectorAll('.about__beyond-description')).map((description) => description.textContent?.trim());

      expect(titles).toEqual(['travel-title', 'photo-title', 'coffee-title']);
      expect(descriptions).toEqual(['travel-description', 'photo-description', 'coffee-description']);
    } finally {
      Object.assign(MESSAGES, original);
    }
  });

  it('should render all supported languages with their levels', () => {
    const native = fixture.nativeElement as HTMLElement;
    const languages = native.querySelectorAll('.about__language');
    const levels = Array.from(native.querySelectorAll('.about__language-level')).map((level) => level.textContent?.trim());

    expect(languages).toHaveLength(3);
    expect(levels.every((level) => (level?.length ?? 0) > 0)).toBe(true);
  });

  it('should hide decorative dots and icons from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('.about__dot[aria-hidden="true"]')).toHaveLength(4);
    expect(native.querySelectorAll('.about__icon i[aria-hidden="true"]')).toHaveLength(6);
  });
});
