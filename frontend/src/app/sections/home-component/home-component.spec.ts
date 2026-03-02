import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HomeComponent } from './home-component';
import { LocaleService } from '../../services/locale/locale.service';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localeService: { getCurrentLocale: ReturnType<typeof vi.fn> };
  let windowOpenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    localeService = {
      getCurrentLocale: vi.fn(() => 'en'),
    };

    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: LocaleService, useValue: localeService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should open CV with current locale in url', () => {
    localeService.getCurrentLocale.mockReturnValue('en');
    component.openCV();
    expect(windowOpenSpy).toHaveBeenCalledWith('assets/cvs/diego-daniel-caceres-cv-en.pdf', '_blank');
  });

  it('should open CV with correct url for each locale', () => {
    ['en', 'es', 'pt'].forEach((lang) => {
      localeService.getCurrentLocale.mockReturnValue(lang);
      component.openCV();
      expect(windowOpenSpy).toHaveBeenCalledWith(`assets/cvs/diego-daniel-caceres-cv-${lang}.pdf`, '_blank');
    });
  });
});
