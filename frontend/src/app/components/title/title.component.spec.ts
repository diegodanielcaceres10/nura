import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TitleComponent } from './title.component';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [TitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'TEST_TITLE');
    fixture.componentRef.setInput('subtitle', 'TEST_SUBTITLE');
    fixture.componentRef.setInput('intro', 'TEST_INTRO');
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should receive and render title input', () => {
    expect(component.title()).toBe('TEST_TITLE');
  });

  it('should receive and render subtitle input', () => {
    expect(component.subtitle()).toBe('TEST_SUBTITLE');
  });

  it('should receive and render intro input', () => {
    expect(component.intro()).toBe('TEST_INTRO');
  });

  it('should render title section in template', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.title')).not.toBeNull();
  });
});
