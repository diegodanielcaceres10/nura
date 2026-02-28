import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { ExperiencesComponent } from './experiences-component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperiencesComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should expose 3 experiences', () => {
    expect(component.experiences.length).toBe(3);
  });

  it('should render one card per experience', () => {
    const cards = fixture.nativeElement.querySelectorAll('.experiences_card');
    expect(cards.length).toBe(component.experiences.length);
  });

  it('should render all company names', () => {
    const titles = fixture.nativeElement.querySelectorAll('.experiences_title');
    const rendered = Array.from(titles).map((item: any) => item.textContent.trim());

    expect(rendered).toContain('Cesla - WS Solutions');
    expect(rendered).toContain('Apex America');
  });

  it('should render total number of skill icons', () => {
    const icons = fixture.nativeElement.querySelectorAll('.experiences_skills i');
    const expected = component.experiences.reduce((acc, experience) => acc + experience.skills.length, 0);
    expect(icons.length).toBe(expected);
  });

  it('should render at least one known skill class', () => {
    const icons = fixture.nativeElement.querySelectorAll('.experiences_skills i');
    const classes = Array.from(icons).map((item: any) => item.getAttribute('class'));

    expect(classes.some((value) => value?.includes('fa-angular'))).toBe(true);
    expect(classes.some((value) => value?.includes('fa-react'))).toBe(true);
  });

  it('should render total number of responsibilities paragraphs', () => {
    const paragraphs = fixture.nativeElement.querySelectorAll('.experiences_container p');
    const expected = component.experiences.reduce(
      (acc, experience) => acc + experience.responsibilityKeys.length,
      0,
    );

    expect(paragraphs.length).toBe(expected);
  });

  it('should render one period span per experience', () => {
    const periods = fixture.nativeElement.querySelectorAll('.experiences_period');
    expect(periods.length).toBe(component.experiences.length);
  });

  it('should render section root and cards wrapper', () => {
    const section = fixture.nativeElement.querySelector('section.experiences');
    const wrapper = fixture.nativeElement.querySelector('.experiences_cards');

    expect(section).toBeTruthy();
    expect(wrapper).toBeTruthy();
  });
});
