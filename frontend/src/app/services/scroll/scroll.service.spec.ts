import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start with isSticky false', () => {
    expect(service.isSticky()).toBe(false);
  });

  it('should set isSticky true when scrollY > 50', () => {
    Object.defineProperty(window, 'scrollY', { value: 51, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(service.isSticky()).toBe(true);
  });

  it('should set isSticky false when scrollY <= 50', () => {
    Object.defineProperty(window, 'scrollY', { value: 51, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(service.isSticky()).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(service.isSticky()).toBe(false);
  });

  it('should set isSticky false when scrollY is 0', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(service.isSticky()).toBe(false);
  });
});
