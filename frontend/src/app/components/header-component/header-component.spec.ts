import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header-component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: any, ..._args: any) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentLang signal', () => {
    expect(component.currentLang()).toBeDefined();
  });

  it('should initialize isMenuOpen signal as false', () => {
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should have langs array with 3 languages', () => {
    expect(component.langs.length).toBe(3);
    expect(component.langs[0].code).toBe('es');
    expect(component.langs[1].code).toBe('en');
    expect(component.langs[2].code).toBe('pt');
  });

  it('should toggle menu when toogleMenu is called', () => {
    const initialState = component.isMenuOpen();
    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(!initialState);
    component.toogleMenu();
    expect(component.isMenuOpen()).toBe(initialState);
  });

  it('should render header element', () => {
    const headerElement = fixture.nativeElement.querySelector('header');
    expect(headerElement).toBeTruthy();
  });

  it('should call localeService.changeLocale when changeLang is called', () => {
    const spy = vi.spyOn(component['localeService'], 'changeLocale');
    component.changeLang('es');
    expect(spy).toHaveBeenCalledWith('es');
  });

  it('should have isSticky signal from scrollService', () => {
    expect(component.isSticky).toBeDefined();
  });
});
