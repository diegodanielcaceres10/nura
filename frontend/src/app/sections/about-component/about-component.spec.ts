import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AboutComponent } from './about-component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should expose non-empty skills list', () => {
    expect(component.skills().length).toBeGreaterThan(0);
  });

  it('should render one tag per skill', () => {
    const tags = fixture.nativeElement.querySelectorAll('.about_tag');
    expect(tags.length).toBe(component.skills().length);
  });

  it('should render key skill tags', () => {
    const text = fixture.nativeElement.querySelector('.about_tags').textContent;
    expect(text).toContain('Angular');
    expect(text).toContain('Node.js');
    expect(text).toContain('TypeScript');
  });

  it('should render section title and wrappers', () => {
    const section = fixture.nativeElement.querySelector('section.about');
    const title = fixture.nativeElement.querySelector('h2');
    const container = fixture.nativeElement.querySelector('.about_container');
    expect(section).toBeTruthy();
    expect(container).toBeTruthy();
    expect(title).toBeTruthy();
  });
});
