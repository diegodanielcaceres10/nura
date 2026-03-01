import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should render app shell sections from template', () => {
    fixture = TestBed.createComponent(App);
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
