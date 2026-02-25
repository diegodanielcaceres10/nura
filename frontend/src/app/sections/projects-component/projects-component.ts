import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
export interface ProjectTech {
  left: string;
  width: string;
  color: string;
}
export interface ProjectCard {
  title: string;
  subtitle: string;
  stackKey: string;
  descKey: string;
  resultKey?: string;
  logo: string;
  card: string;
  repo: string;
  repoLabelKey: string;
  techsKey: string;
  techs: ProjectTech[]; // 👈 reemplaza el tipo inline
  legend: string;
}
@Component({
  selector: 'app-projects-component',
  imports: [TranslatePipe],
  templateUrl: './projects-component.html',
  styleUrl: './projects-component.scss',
})
export class ProjectsComponent {
  projects = signal<ProjectCard[]>([
    {
      title: 'AutoDrive - Saas Platform',
      subtitle: '',
      stackKey: 'PROJECT_AUTODRIVE_STACK',
      descKey: 'PROJECT_AUTODRIVE_DESC',
      logo: 'assets/projects/autodrive/logo.png',
      card: 'assets/projects/autodrive/card.jpg',
      repo: 'https://github.com/diegodanielcaceres10/octoautodrive',
      repoLabelKey: 'PROJECT_REPOSITORY',
      techsKey: 'PROJECT_TECHNOLOGIES',
      techs: [
        { left: '0', width: '54%', color: '#3178c6' },
        { left: '54%', width: '32.1%', color: '#e34c26' },
        { left: '32.1%', width: '7.4%', color: '#f1e05a' },
        { left: '7.4%', width: '6.5%', color: '#c6538c' },
      ],
      legend: 'TypeScript 54,0% • HTML 32,1% • JavaScript 7,4% • SCSS 6,5%',
    },
    {
      title: 'OilGroup - CRM Platform',
      subtitle: '',
      stackKey: 'PROJECT_OILGROUP_STACK',
      descKey: 'PROJECT_OILGROUP_DESC',
      resultKey: 'PROJECT_OILGROUP_RESULT',
      logo: 'assets/projects/oilgroup/logo.png',
      card: 'assets/projects/oilgroup/card.jpg',
      repo: 'https://github.com/diegodanielcaceres10/oilgroup',
      repoLabelKey: 'PROJECT_REPOSITORY',
      techsKey: 'PROJECT_TECHNOLOGIES',
      techs: [
        { left: '0', width: '49.4%', color: '#3178c6' },
        { left: '49.4%', width: '25.9%', color: '#e34c26' },
        { left: '25.9%', width: '19.6%', color: '#f1e05a' },
        { left: '19.6%', width: '5.1%', color: '#c6538c' },
      ],
      legend: 'TypeScript 49,4% • HTML 25,9% • JavaScript 19,6% • SCSS 5,1%',
    },
    {
      title: 'Angular JSON Form - NPM Package',
      subtitle: '',
      stackKey: 'PROJECT_ANGULARJSONFORM_STACK',
      descKey: 'PROJECT_ANGULARJSONFORM_DESC',
      resultKey: 'PROJECT_ANGULARJSONFORM_RESULT',
      logo: 'assets/projects/angularjsonform/logo.png',
      card: 'assets/projects/angularjsonform/card.jpg',
      repo: 'https://github.com/diegodanielcaceres10/angular-json-form',
      repoLabelKey: 'PROJECT_REPOSITORY',
      techsKey: 'PROJECT_TECHNOLOGIES',
      techs: [
        { left: '0', width: '43.2%', color: '#3178c6' },
        { left: '43.2%', width: '36.6%', color: '#e34c26' },
        { left: '36.6%', width: '18.2%', color: '#c6538c' },
        { left: '18.2%', width: '1.8%', color: '#f1e05a' },
      ],
      legend: 'TypeScript 43,2% • HTML 36,6% • SCSS 18,2% • JavaScript 1,8% • Other 0,2%',
    },
  ]);
}
