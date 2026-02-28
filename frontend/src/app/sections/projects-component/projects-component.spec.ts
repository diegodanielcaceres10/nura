import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectsComponent } from './projects-component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should expose 4 projects', () => {
    expect(component.projects().length).toBe(4);
  });

  it('should render one card per project', () => {
    const cards = fixture.nativeElement.querySelectorAll('.projects_card');
    expect(cards.length).toBe(component.projects().length);
  });

  it('should render only one "Nuevo" tag', () => {
    const tags = fixture.nativeElement.querySelectorAll('.projects_card_front_tag');
    expect(tags.length).toBe(1);
    expect(tags[0].textContent.trim()).toBe('Nuevo');
  });

  it('should render expected number of KPI blocks', () => {
    const renderedKpis = fixture.nativeElement.querySelectorAll('.projects_card_back_kpi');
    const expectedKpis = component.projects().reduce((acc, project) => acc + project.kpis.length, 0);

    expect(renderedKpis.length).toBe(expectedKpis);
  });

  it('should render one repository link per project with safe attributes', () => {
    const links = fixture.nativeElement.querySelectorAll('.projects_card_back_links a');
    expect(links.length).toBe(component.projects().length);

    Array.from(links).forEach((link: any) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('href')).toMatch(/^https:\/\/github\.com\//);
    });
  });

  it('should render front logos with expected alt suffix', () => {
    const images = fixture.nativeElement.querySelectorAll('.projects_card_front_logo img');
    expect(images.length).toBe(component.projects().length);

    Array.from(images).forEach((img: any) => {
      expect(img.getAttribute('alt')).toContain('Logo');
    });
  });

  it('should generate gradient style from three colors', () => {
    const colors = ['#000000', '#111111', '#222222'];
    const gradient = component.getGradient(colors)();

    expect(gradient).toContain('linear-gradient(135deg');
    expect(gradient).toContain(colors[0]);
    expect(gradient).toContain(colors[1]);
    expect(gradient).toContain(colors[2]);
  });
});
