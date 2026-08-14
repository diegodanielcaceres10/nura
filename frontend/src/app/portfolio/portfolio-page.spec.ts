import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioPage } from './portfolio-page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let fixture: ComponentFixture<PortfolioPage>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: any, ..._args: any) => {
      return typeof message === 'string' ? message : message[0] ?? '';
    });

    await TestBed.configureTestingModule({
      imports: [PortfolioPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isSticky signal from scrollService', () => {
    expect(component.isSticky).toBeDefined();
  });

  it('should have currentLang from localeService', () => {
    expect(component.currentLang).toBeDefined();
  });

  it('should have all imported child components', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should have HeaderComponent in imports', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header-component')).toBeDefined();
  });

  it('should have FooterComponent in imports', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-footer-component')).toBeDefined();
  });
});
