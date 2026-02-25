import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectCard } from '../../interfaces/project';
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
        { legend: 'TypeScript', left: '0', percent: '54%', color: '#3178c6' },
        { legend: 'HTML', left: '54%', percent: '32.1%', color: '#e34c26' },
        { legend: 'JavaScript', left: '32.1%', percent: '7.4%', color: '#f1e05a' },
        { legend: 'SCSS', left: '7.4%', percent: '6.5%', color: '#c6538c' },
      ],
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
        { legend: 'TypeScript', left: '0', percent: '49.4%', color: '#3178c6' },
        { legend: 'HTML', left: '49.4%', percent: '25.9%', color: '#e34c26' },
        { legend: 'JavaScript', left: '25.9%', percent: '19.6%', color: '#f1e05a' },
        { legend: 'SCSS', left: '19.6%', percent: '5.1%', color: '#c6538c' },
      ],
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
        { legend: 'TypeScript', left: '0', percent: '43.2%', color: '#3178c6' },
        { legend: 'HTML', left: '43.2%', percent: '36.6%', color: '#e34c26' },
        { legend: 'SCSS', left: '36.6%', percent: '18.2%', color: '#c6538c' },
        { legend: 'JavaScript', left: '18.2%', percent: '1.8%', color: '#f1e05a' },
      ],
    },
  ]);
}
