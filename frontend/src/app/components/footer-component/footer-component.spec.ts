import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FooterComponent } from './footer-component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render contact title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title).toBeTruthy();
    expect(title.textContent.trim().length).toBeGreaterThan(0);
  });

  it('should render phone and email contact info', () => {
    const contactText = fixture.nativeElement.querySelector('.footer_address').textContent;
    expect(contactText).toContain('+34 62431-2028');
    expect(contactText).toContain('diegodanielcaceres10@gmail.com');
  });

  it('should render copyright section', () => {
    const copyright = fixture.nativeElement.querySelector('.footer_copyright');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('Diego Daniel Caceres');
  });
});
