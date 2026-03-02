import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home-component';
import { LocaleService } from '../../i18n/locale.service';

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

  it('should open english CV when current language is en', () => {
    localeService.getCurrentLocale.mockReturnValue('en');
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openCV();

    expect(openSpy).toHaveBeenCalledWith('assets/cvs/diego-daniel-caceres-cv-en.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('should use locale service to decide CV language', () => {
    localeService.getCurrentLocale.mockReturnValue('pt');
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openCV();

    expect(localeService.getCurrentLocale).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('assets/cvs/diego-daniel-caceres-cv-pt.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('should call openCV when download button is clicked', () => {
    const openCvSpy = vi.spyOn(component, 'openCV');
    const button = fixture.nativeElement.querySelector('.home_button-alt');

    button.click();
    fixture.detectChanges();

    expect(openCvSpy).toHaveBeenCalled();
  });

  it('should render contact anchor to footer section', () => {
    const link = fixture.nativeElement.querySelector('.home_buttons a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#contact');
  });
});
