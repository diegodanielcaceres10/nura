import { TestBed } from '@angular/core/testing';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  it('should render an accessible status indicator', () => {
    const fixture = TestBed.createComponent(LoadingSpinner);
    fixture.detectChanges();

    const spinner = (fixture.nativeElement as HTMLElement).querySelector('[role="status"]');
    expect(spinner?.getAttribute('aria-label')).toBe('Cargando');
  });
});
