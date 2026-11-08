import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { ScrollAnimateService } from '../../services/scroll/scroll-animate.service';

@Component({
  imports: [ScrollRevealDirective],
  template: `
    <div class="target-single" appScrollReveal [revealDelay]="100" [revealDuration]="700" [revealDistance]="24">Single</div>
    <div class="target-custom" [appScrollReveal]="'fade-left'">Custom</div>
    <div class="target-container" appScrollReveal [revealSelector]="'.item'" [revealStaggerDelay]="80">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
    </div>
  `,
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let scrollAnimateService: ScrollAnimateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ScrollAnimateService],
    }).compileComponents();

    scrollAnimateService = TestBed.inject(ScrollAnimateService);
    vi.spyOn(scrollAnimateService, 'prefersReducedMotion', 'get').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize single element with reveal classes and custom properties', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.target-single') as HTMLElement;
    expect(el.classList.contains('reveal-init')).toBe(true);
    expect(el.classList.contains('reveal-fade-up')).toBe(true);
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('100ms');
    expect(el.style.getPropertyValue('--reveal-duration')).toBe('700ms');
    expect(el.style.getPropertyValue('--reveal-distance')).toBe('24px');
  });

  it('should support custom animation types such as fade-left', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.target-custom') as HTMLElement;
    expect(el.classList.contains('reveal-fade-left')).toBe(true);
  });

  it('should handle revealSelector for staggered children', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.item') as NodeListOf<HTMLElement>;
    expect(items.length).toBe(2);
    expect(items[0].classList.contains('reveal-init')).toBe(true);
    expect(items[0].style.getPropertyValue('--reveal-delay')).toBe('0ms');
    expect(items[1].classList.contains('reveal-init')).toBe(true);
    expect(items[1].style.getPropertyValue('--reveal-delay')).toBe('80ms');
  });

  it('should immediately reveal elements when prefersReducedMotion is active', () => {
    vi.spyOn(scrollAnimateService, 'prefersReducedMotion', 'get').mockReturnValue(true);

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.target-single') as HTMLElement;
    expect(el.classList.contains('revealed')).toBe(true);

    const items = fixture.nativeElement.querySelectorAll('.item') as NodeListOf<HTMLElement>;
    expect(items[0].classList.contains('revealed')).toBe(true);
    expect(items[1].classList.contains('revealed')).toBe(true);
  });
});
