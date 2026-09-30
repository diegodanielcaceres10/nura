import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer-component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => {
      return typeof message === 'string' ? message : (message[0] ?? '');
    });

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer element', () => {
    const footerElement = fixture.nativeElement.querySelector('footer');
    expect(footerElement).toBeTruthy();
  });

  it('should render footer container', () => {
    const footerContainer = fixture.nativeElement.querySelector('.footer');
    expect(footerContainer).toBeTruthy();
  });

  it('should render glowing horizon and ambient beam', () => {
    const horizon = fixture.nativeElement.querySelector('.footer__horizon');
    const beam = fixture.nativeElement.querySelector('.footer__horizon-beam');
    expect(horizon).toBeTruthy();
    expect(beam).toBeTruthy();
  });

  it('should render status indicator and copyright', () => {
    const copyright = fixture.nativeElement.querySelector('.footer__copyright');
    expect(copyright?.textContent).toContain('2026');
    expect(copyright?.textContent).toContain('Diego Daniel Caceres');
  });

  it('should maintain backward compatibility for footer_copyright selector', () => {
    const legacyCopyright = fixture.nativeElement.querySelector('.footer_copyright');
    expect(legacyCopyright).toBeTruthy();
  });
});
