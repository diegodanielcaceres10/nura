import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('should render the education details and signature with alternative text', () => {
    const native = fixture.nativeElement as HTMLElement;
    const signature = native.querySelector<HTMLImageElement>('.about__signature img');

    expect(native.querySelector('.about__education-degree')?.textContent?.trim()).toBe('Analista de Sistemas');
    expect(native.querySelector('.about__education-institution')?.textContent?.trim()).toBe('Instituto Cervantes');
    expect(native.querySelector('.about__education-meta')?.textContent?.trim()).toBe('Argentina · 2020');
    expect(signature?.getAttribute('alt')).toBe('Diego Daniel Caceres Logo');
  });

  it('should render the three interests beyond work', () => {
    const native = fixture.nativeElement as HTMLElement;
    const titles = Array.from(native.querySelectorAll('.about__beyond-title')).map((title) => title.textContent?.trim());

    expect(titles).toEqual(['I love to travel', 'Photography', 'Good coffee']);
    expect(native.querySelectorAll('.about__beyond-description')).toHaveLength(3);
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
    expect(native.querySelectorAll('.about__icon i[aria-hidden="true"]')).toHaveLength(4);
  });
});
