import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { PortfolioPage } from './portfolio-page';
import { ScrollService } from '../services/scroll/scroll.service';

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;
  let isStickySignal: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    isStickySignal = signal(false);

    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [provideRouter([]), { provide: ScrollService, useValue: { isSticky: isStickySignal } }],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render portfolio sections', () => {
    const root = fixture.nativeElement;
    expect(root.querySelector('app-header-component')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('app-home-component')).toBeTruthy();
    expect(root.querySelector('app-about-component')).toBeTruthy();
    expect(root.querySelector('app-experiences-component')).toBeTruthy();
    expect(root.querySelector('app-projects-component')).toBeTruthy();
    expect(root.querySelector('app-footer-component')).toBeTruthy();
  });

  it('should start with isSticky false', () => {
    expect(component.isSticky()).toBe(false);
  });

  it('should reflect isSticky true from ScrollService', () => {
    isStickySignal.set(true);
    fixture.detectChanges();
    expect(component.isSticky()).toBe(true);
  });
});
