import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : (message[0] ?? '')));

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

  it('should have education item', () => {
    const education = component['education'];

    expect(education.degree).toBe('Analista de Sistemas');
  });

  it('should have languages in array', () => {
    const languages = component['languages'];

    expect(languages.length).toBeGreaterThan(0);
  });

  it('should have beyond work items in array', () => {
    const beyondWork = component['beyondWork'];

    expect(beyondWork.length).toBeGreaterThan(0);
  });
});
