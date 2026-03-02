import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home-component';
import { LocaleService } from '../../i18n/locale.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule, // <- necesario para routerLink
      ],
      providers: [{ provide: LocaleService, useValue: localeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render 3 decorative wave elements', () => {
    const waves = fixture.nativeElement.querySelectorAll('.home_wave');
    expect(waves.length).toBe(3);
  });
});
