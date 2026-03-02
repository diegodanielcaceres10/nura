import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home-component';
import { LocaleService } from '../../i18n/locale.service';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: LocaleService, useValue: localeService },
        provideRouter([]), // 👈 esto resuelve el ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });
});
