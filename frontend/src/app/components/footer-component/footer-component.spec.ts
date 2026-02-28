import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { FooterComponent } from './footer-component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, TranslateModule.forRoot()],
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
    const contactText = fixture.nativeElement.querySelector('.footer_list').textContent;
    expect(contactText).toContain('+34 62431-2028');
    expect(contactText).toContain('diegodanielcaceres10@gmail.com');
  });

  it('should render 3 social links with target blank', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer_icons .footer_icon') as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBe(3);

    Array.from(links).forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('should contain expected social urls', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer_icons .footer_icon') as NodeListOf<HTMLAnchorElement>;
    const hrefs = Array.from(links).map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('https://www.linkedin.com/in/diego-daniel-caceres-1328991aa/');
    expect(hrefs).toContain('https://github.com/diegodanielcaceres10');
    expect(hrefs).toContain('https://www.npmjs.com/~diegodanielcaceres10');
  });

  it('should render copyright section', () => {
    const copyright = fixture.nativeElement.querySelector('.footer_copyright');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('Diego Daniel Caceres');
  });
});
