import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the contact section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.contact')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render the four configured contact channels', () => {
    const native = fixture.nativeElement as HTMLElement;
    const labels = Array.from(native.querySelectorAll('.contact__channel-label')).map((label) => label.textContent?.trim());

    expect(labels).toEqual(['Email', 'LinkedIn', 'GitHub', 'npm']);
  });

  it('should render the email address as a mailto link', () => {
    const native = fixture.nativeElement as HTMLElement;
    const emailLink = native.querySelector<HTMLAnchorElement>('.contact__channel-value');

    expect(emailLink?.textContent?.trim()).toBe('diegodanielcaceres10@gmail.com');
    expect(emailLink?.getAttribute('href')).toBe('mailto:diegodanielcaceres10@gmail.com');
  });

  it('should render secure external action links for professional profiles', () => {
    const native = fixture.nativeElement as HTMLElement;
    const links = Array.from(native.querySelectorAll<HTMLAnchorElement>('.contact__channel-action'));

    expect(links).toHaveLength(3);
    expect(links.every((link) => link.target === '_blank' && link.rel === 'noopener')).toBe(true);
    expect(links.map((link) => link.href)).toEqual([
      'https://www.linkedin.com/in/diego-daniel-caceres-1328991aa',
      'https://github.com/diegodanielcaceres10',
      'https://npmjs.com/~diegodanielcaceres10',
    ]);
  });

  it('should render the availability metadata items', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('.contact__meta-item')).toHaveLength(2);
    expect(native.querySelector('.contact__availability-highlight')).not.toBeNull();
  });

  it('should hide decorative icons from assistive technologies', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(10);
  });
});
