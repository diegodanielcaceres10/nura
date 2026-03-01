import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render router outlet', () => {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const root = fixture.nativeElement;
    expect(root.querySelector('router-outlet')).toBeTruthy();
  });
});
