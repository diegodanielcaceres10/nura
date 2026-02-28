import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HomeComponent } from './home-component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, TranslateModule.forRoot()],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    translateService.use('en');

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render developer name in title', () => {
    const title = fixture.nativeElement.querySelector('.home_title h1');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Diego Daniel Caceres');
  });

  it('should render 3 decorative wave elements', () => {
    const waves = fixture.nativeElement.querySelectorAll('.home_wave');
    expect(waves.length).toBe(3);
  });

  it('should open english CV when current language is en', () => {
    translateService.use('en');
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openCV();

    expect(openSpy).toHaveBeenCalledWith('assets/cvs/diego-daniel-caceres-cv-en.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('should fallback to english CV when current language is undefined', () => {
    const langSpy = vi.spyOn(translateService, 'getCurrentLang').mockReturnValue(undefined as any);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openCV();

    expect(langSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('assets/cvs/diego-daniel-caceres-cv-en.pdf', '_blank');
    openSpy.mockRestore();
  });

  it('should open portuguese CV when current language is pt', () => {
    translateService.use('pt');
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.openCV();

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
