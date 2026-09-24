import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../components/title/title.component';
import { ProjectCardComponent } from './project-card.component/project-card.component';
import { ProjectsService } from '../../services/projects/projects.service';
import { LocaleService } from '../../services/locale/locale.service';

export interface ProjectItem {
  id: string;
  avatar?: string;
  icon?: string;
  title: string;
  type: 'Mobile' | 'Web' | 'Fullstack' | 'Library' | 'Challenge';
  shortDescription: string;
  coverImage?: string;
  techStackPreview: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED';
  year: number;
  fullDescription: string;
  techStackFull?: TechCategory[];
  keyFeatures: string[];
  challenges?: string[];
  gallery?: string[];
  links?: ProjectLinks;
  metrics?: ProjectMetrics;
  typeDetails?: MobileDetails | WebDetails | FullstackDetails | LibraryDetails | ChallengeDetails;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface ProjectLinks {
  repo: string;
  demo?: string;
  npm?: string;
  androidAPK?: string;
}

export interface ProjectMetrics {
  npmDownloads?: number;
  githubStars?: number;
  testCoverage?: string;
}

export interface MobileDetails {
  kind: 'mobile';
  platforms: ('android' | 'ios' | 'web')[];
  nativePlugins: string[];
  buildTool: string;
}

export interface WebDetails {
  kind: 'web';
  deployUrl: string;
  pwa?: boolean;
  responsive: boolean;
}

export interface FullstackDetails {
  kind: 'fullstack';
  backendStack: string[];
  databases: string[];
  apiType: 'REST' | 'GraphQL' | 'gRPC';
  deployment: string;
}

export interface LibraryDetails {
  kind: 'library';
  packageName: string;
  installCommand: string;
  registry: 'npm' | 'other';
}

export interface ChallengeDetails {
  kind: 'challenge';
  platform: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
}

type ProjectFilterValue = 'all' | 'angular' | 'typescript' | 'ionic' | 'capacitor' | 'react' | 'node' | 'docker';

interface ProjectFilter {
  label: string;
  value: ProjectFilterValue;
}

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [TitleComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  private readonly projectsService = inject(ProjectsService);

  protected readonly projectFilters: ProjectFilter[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Ionic', value: 'ionic' },
    { label: 'Capacitor', value: 'capacitor' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'node' },
    { label: 'Docker', value: 'docker' },
  ];

  protected readonly activeFilter = signal<ProjectFilterValue>('all');

  private readonly projects = this.projectsService.getAll();

  protected readonly filteredProjects = computed(() => {
    const activeFilter = this.activeFilter();

    if (activeFilter === 'all') {
      return this.projects;
    }

    return this.projects.filter((project) => this.matchesProjectFilter(project, activeFilter));
  });

  protected setActiveFilter(filter: ProjectFilterValue): void {
    this.activeFilter.set(filter);
  }

  protected navigateToProject(project: ProjectItem): void {
    const lang = this.localeService.getCurrentLocale();
    this.router.navigate(['/', lang, 'work', project.id]);
  }

  private matchesProjectFilter(project: ProjectItem, filter: Exclude<ProjectFilterValue, 'all'>): boolean {
    const searchTermByFilter: Record<Exclude<ProjectFilterValue, 'all'>, string> = {
      angular: 'angular',
      typescript: 'typescript',
      ionic: 'ionic',
      capacitor: 'capacitor',
      react: 'react',
      node: 'node',
      docker: 'docker',
    };

    const searchTerm = searchTermByFilter[filter];
    const searchPattern = new RegExp(`(^|[^a-z0-9])${searchTerm}(?=$|[^a-z0-9])`, 'i');

    return this.getProjectSearchTerms(project).some((term) => searchPattern.test(term));
  }

  private getProjectSearchTerms(project: ProjectItem): string[] {
    const techStackFull = project.techStackFull?.flatMap((category) => [category.category, ...category.items]) ?? [];

    return [...project.techStackPreview, ...techStackFull];
  }
}
