import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudyComponent } from './case-study.component';

describe('CaseStudyComponent', () => {
  let component: CaseStudyComponent;
  let fixture: ComponentFixture<CaseStudyComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [CaseStudyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the case study section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.case-study')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should have case studies array', () => {
    const caseStudies = component['caseStudies'];

    expect(caseStudies).toBeDefined();
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it('should render case study items in grid', () => {
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.case-study__card');

    expect(items.length).toBeGreaterThan(0);
  });
});
