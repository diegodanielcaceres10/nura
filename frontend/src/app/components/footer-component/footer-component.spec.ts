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
});
