import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TitleComponent } from '../../components/title/title.component';
import { ProjectCardComponent } from './project-card.component/project-card.component';
import { ProjectsService } from '../../services/projects/projects.service';
import { LocaleService } from '../../services/locale/locale.service';

export interface ProjectItem {
  id: string;
  icon?: string;
  favicon?: string;
  logo?: string;
  title: string;
  type: 'Mobile' | 'Web' | 'Fullstack' | 'Library' | 'Challenge';
  shortDescription: string;
  techStackMain: string[];
  techStackExtended?: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED';
  year: number;
  fullDescription: string;
  techStackFull?: TechCategory[];
  keyFeatures: string[];
  challenges?: string[];
  gallery?: string[];
  links?: ProjectLinks;
  metrics?: ProjectMetrics;
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

const ALL_FILTER = 'all';

interface ProjectFilter {
  label: string;
  value: string;
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

  private readonly projects = this.projectsService.getAll();

  protected readonly projectFilters: ProjectFilter[] = [{ label: 'Todos', value: ALL_FILTER }, ...this.buildTechFilters(this.projects)];

  protected readonly activeFilter = signal<string>(ALL_FILTER);

  protected readonly filteredProjects = computed(() => {
    const activeFilter = this.activeFilter();

    if (activeFilter === ALL_FILTER) {
      return this.projects;
    }

    return this.projects.filter((project) => this.matchesProjectFilter(project, activeFilter));
  });

  protected setActiveFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  protected navigateToProject(project: ProjectItem): void {
    const lang = this.localeService.getCurrentLocale();
    this.router.navigate(['/', lang, 'work', project.id]);
  }

  // One filter per distinct techStackMain entry, most repeated across projects first.
  private buildTechFilters(projects: ProjectItem[]): ProjectFilter[] {
    const tally = new Map<string, { label: string; count: number }>();

    for (const project of projects) {
      const countedInProject = new Set<string>();

      for (const tech of project.techStackMain) {
        const value = this.toFilterValue(tech);
        if (!value || countedInProject.has(value)) {
          continue;
        }

        countedInProject.add(value);
        const entry = tally.get(value);
        if (entry) {
          entry.count++;
        } else {
          tally.set(value, { label: tech.trim(), count: 1 });
        }
      }
    }

    return [...tally.entries()].sort(([, a], [, b]) => b.count - a.count || a.label.localeCompare(b.label, 'en')).map(([value, { label }]) => ({ label, value }));
  }

  private toFilterValue(tech: string): string {
    return tech.trim().toLowerCase();
  }

  private matchesProjectFilter(project: ProjectItem, filter: string): boolean {
    const escaped = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchPattern = new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, 'i');

    return this.getProjectSearchTerms(project).some((term) => searchPattern.test(term));
  }

  private getProjectSearchTerms(project: ProjectItem): string[] {
    const techStackFull = project.techStackFull?.flatMap((category) => [category.category, ...category.items]) ?? [];

    return [...project.techStackMain, ...(project.techStackExtended ?? []), ...techStackFull];
  }
}
