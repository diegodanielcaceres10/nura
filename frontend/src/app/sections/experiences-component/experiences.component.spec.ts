import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperiencesComponent } from './experiences.component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async () => {
    vi.stubGlobal(
      '$localize',
      (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : message[0] ?? ''),
    );

    await TestBed.configureTestingModule({
      imports: [ExperiencesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.experiences')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should render the expected experience entries', () => {
    expect(component['entries']).toHaveLength(2);
    expect(component['entries'][0].company).toContain('Apex America');
    expect(component['entries'][1].company).toContain('WS Solutions');
  });

  it('should render the timeline entries in the DOM', () => {
    const native = fixture.nativeElement as HTMLElement;
    const cards = native.querySelectorAll('.experiences__card');

    expect(cards.length).toBe(2);
  });
});
