import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleService } from '../../services/locale/locale.service';

describe('HomeComponent', () => {
  let component: any;
  let fixture: ComponentFixture<any>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray, ..._args: unknown[]) => (typeof message === 'string' ? message : (message[0] ?? '')));

    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

    const { HomeComponent } = await import('./home.component');

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: LocaleService, useValue: localeService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the main content', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.home__title-name')?.textContent).toContain('Diego Daniel Caceres');
    expect(native.querySelector('.home__description')).not.toBeNull();
    expect(native.querySelector('.home__badge')).not.toBeNull();
  });

  it('should render the expected data blocks', () => {
    expect(component['techBadges']).toHaveLength(4);
    expect(component['stats']).toHaveLength(5);
    expect(component['categories']).toHaveLength(4);
  });
});
