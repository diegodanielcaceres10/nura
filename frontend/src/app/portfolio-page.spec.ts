import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { PortfolioPage } from './portfolio-page';

describe('PortfolioPage', () => {
  let fixture: ComponentFixture<PortfolioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render portfolio sections', () => {
    fixture = TestBed.createComponent(PortfolioPage);
    fixture.detectChanges();

    const root = fixture.nativeElement;
    expect(root.querySelector('app-header-component')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('app-home-component')).toBeTruthy();
    expect(root.querySelector('app-about-component')).toBeTruthy();
    expect(root.querySelector('app-experiences-component')).toBeTruthy();
    expect(root.querySelector('app-projects-component')).toBeTruthy();
    expect(root.querySelector('app-footer-component')).toBeTruthy();
  });
});
