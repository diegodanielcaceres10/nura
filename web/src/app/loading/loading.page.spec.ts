import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingPage } from './loading.page';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LoadingPage', () => {
  let component: LoadingPage;
  let fixture: ComponentFixture<LoadingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the loading component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the high-end loading container', () => {
    const section = fixture.nativeElement.querySelector('.loading');
    expect(section).toBeTruthy();
  });

  it('should render the ambient backdrop', () => {
    const backdrop = fixture.nativeElement.querySelector('.loading__backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should render the orbital precision SVG indicator', () => {
    const orbit = fixture.nativeElement.querySelector('.loading__orbit-svg');
    expect(orbit).toBeTruthy();
  });

  it('should render the isologo', () => {
    const img = fixture.nativeElement.querySelector('.loading__logo');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('isologo.png');
  });

  it('should render the brand title and subtitle', () => {
    const title = fixture.nativeElement.querySelector('.loading__title');
    const subtitle = fixture.nativeElement.querySelector('.loading__subtitle');
    expect(title?.textContent?.trim()).toBe('NURA');
    expect(subtitle?.textContent?.trim()).toContain('PORTFOLIO');
  });

  it('should render the progress track and status text', () => {
    const track = fixture.nativeElement.querySelector('.loading__progress-track');
    const statusText = fixture.nativeElement.querySelector('.loading__status-text');
    expect(track).toBeTruthy();
    expect(statusText?.textContent?.trim()).toBe('INITIALIZING EXPERIENCE');
  });

  it('should maintain language__spinner selector compatibility', () => {
    const spinner = fixture.nativeElement.querySelector('.language__spinner');
    expect(spinner).toBeTruthy();
  });
});
