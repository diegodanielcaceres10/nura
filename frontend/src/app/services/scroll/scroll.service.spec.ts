import { PLATFORM_ID } from '@angular/core';
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

  it('should stop reacting to scroll events once the service is destroyed', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const destroyed = TestBed.inject(ScrollService);

    TestBed.resetTestingModule();
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(destroyed.isSticky()).toBe(false);
  });

  describe('on the server platform', () => {
    let serverService: ScrollService;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      serverService = TestBed.inject(ScrollService);
    });

    it('should start with isSticky false', () => {
      expect(serverService.isSticky()).toBe(false);
    });

    it('should not listen to scroll events', () => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));

      expect(serverService.isSticky()).toBe(false);
    });
  });
});
