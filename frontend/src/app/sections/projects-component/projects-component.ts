import { Component, computed, signal } from '@angular/core';
import { ProjectCard } from '../../interfaces/project';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
@Component({
  selector: 'app-projects-component',
  imports: [TranslateKeyPipe],
  templateUrl: './projects-component.html',
  styleUrl: './projects-component.scss',
})
export class ProjectsComponent {
  projects = signal<ProjectCard[]>([
    {
      name: 'Nura',
      new: true,
      filename: 'nura',
      logo: 'assets/projects/nura/logo.png',
      title: 'PROJECT_NURA_TITLE',
      subtitle: 'PROJECT_NURA_SUBTITLE',
      skills: ['Angular 21', 'TypeScript', 'RxJS', 'SCSS', 'SSG', 'GitHub Actions', 'Vitest', 'Docker'],
      description: 'PROJECT_NURA_DESC',
      kpis: [
        { value: '3', legend: 'PROJECT_NURA_KPI_1' },
        { value: '11', legend: 'PROJECT_NURA_KPI_2' },
        { value: '100%', legend: 'PROJECT_NURA_KPI_3' },
      ],
      repo: 'https://github.com/diegodanielcaceres10/nura',
      colors: ['#07152a', '#1a1530', '#521f57'],
    },
    {
      name: 'Auto Drive',
      new: false,
      filename: 'octoautodrive',
      logo: 'assets/projects/octoautodrive/logo.png',
      title: 'PROJECT_OCTOAUTODRIVE_TITLE',
      subtitle: 'PROJECT_OCTOAUTODRIVE_SUBTITLE',
      skills: ['Angular 13', 'TypeScript', 'RxJS', 'SCSS', 'Socket', 'Node', 'Express', 'JWT', 'MySQL'],
      description: 'PROJECT_OCTOAUTODRIVE_DESC',
      kpis: [
        { value: '+10', legend: 'PROJECT_OCTOAUTODRIVE_KPI_1' },
        { value: '3', legend: 'PROJECT_OCTOAUTODRIVE_KPI_2' },
        { value: '3', legend: 'PROJECT_OCTOAUTODRIVE_KPI_3' },
      ],
      repo: 'https://github.com/diegodanielcaceres10/octoautodrive',
      colors: ['#17364a', '#2a5f7f', '#2a7d7f'],
    },
    {
      name: 'OilGroup',
      new: false,
      filename: 'oilgroup',
      logo: 'assets/projects/oilgroup/logo.png',
      title: 'PROJECT_OILGROUP_TITLE',
      subtitle: 'PROJECT_OILGROUP_SUBTITLE',
      skills: ['Angular 11', 'TypeScript', 'RxJS', 'SCSS', 'Node', 'Express', 'JWT', 'MySQL'],
      description: 'PROJECT_OILGROUP_DESC',
      kpis: [
        { value: '4', legend: 'PROJECT_OILGROUP_KPI_1' },
        { value: '+8', legend: 'PROJECT_OILGROUP_KPI_2' },
      ],
      repo: 'https://github.com/diegodanielcaceres10/oilgroup',
      colors: ['#46332e', '#5a4039', '#4a3129'],
    },
    {
      name: 'Angular JSON Form',
      new: false,
      filename: 'angularjsonform',
      logo: 'assets/projects/angularjsonform/logo.png',
      title: 'PROJECT_ANGULARJSONFORM_TITLE',
      subtitle: 'PROJECT_ANGULARJSONFORM_SUBTITLE',
      skills: ['Angular 13', 'TypeScript', 'WebSockets', 'Cloudinary', 'Node', 'Express', 'SCSS', 'i18n'],
      description: 'PROJECT_ANGULARJSONFORM_DESC',
      kpis: [
        { value: 'v1.4.6', legend: 'PROJECT_ANGULARJSONFORM_KPI_1' },
        { value: '15', legend: 'PROJECT_ANGULARJSONFORM_KPI_2' },
        { value: '3', legend: 'PROJECT_ANGULARJSONFORM_KPI_3' },
      ],
      repo: 'https://github.com/diegodanielcaceres10/angularjsonform',
      colors: ['#2E2F30', '#4A3E3A', '#6B463D'],
    },
  ]);

  getGradient = (colors: string[]) => computed(() => `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 45%, ${colors[2]} 100%)`);
}
