import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorPage } from './language-selector.page';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('LanguageSelectorPage', () => {
  let component: LanguageSelectorPage;
  let fixture: ComponentFixture<LanguageSelectorPage>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: any, ..._args: any) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have languages array with 3 languages', () => {
    expect(component['languages'].length).toBe(3);
    expect(component['languages'][0].code).toBe('ES');
    expect(component['languages'][1].code).toBe('EN');
    expect(component['languages'][2].code).toBe('PT');
  });

  it('should have languages with correct locale codes', () => {
    expect(component['languages'][0].locale).toBe('es');
    expect(component['languages'][1].locale).toBe('en');
    expect(component['languages'][2].locale).toBe('pt');
  });

  it('should have channels array with 3 quick links', () => {
    expect(component['channels'].length).toBe(3);
    expect(component['channels'][0].label).toBe('LinkedIn');
    expect(component['channels'][1].label).toBe('GitHub');
    expect(component['channels'][2].label).toBe('npm');
  });

  it('should have valid URLs in channels', () => {
    const urls = component['channels'].map((c) => c.url);
    expect(urls[0]).toContain('linkedin.com');
    expect(urls[1]).toContain('github.com');
    expect(urls[2]).toContain('npmjs.com');
  });

  it('should call localeService.changeLocale when selectLanguage is called', () => {
    const spy = vi.spyOn(component['localeService'], 'changeLocale');
    component.selectLanguage('en');
    expect(spy).toHaveBeenCalledWith('en');
  });

  it('should render language selector container', () => {
    const container = fixture.nativeElement.querySelector('.language');
    expect(container).toBeTruthy();
  });

  it('should render language buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.language__lang');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render channel links', () => {
    const links = fixture.nativeElement.querySelectorAll('.language__channel');
    expect(links.length).toBeGreaterThan(0);
  });
});
