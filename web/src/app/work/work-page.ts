import { Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../components/header-component/header-component';
import { FooterComponent } from '../components/footer-component/footer-component';
import { ProjectCardComponent } from '../sections/projects-component/project-card.component/project-card.component';
import { TranslateKeyPipe } from '../services/translate/translate-key.pipe';
import { ProjectsService } from '../services/projects/projects.service';
import { LocaleService } from '../services/locale/locale.service';
import { ProjectItem } from '../sections/projects-component/projects.component';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ProjectCardComponent, TranslateKeyPipe],
  templateUrl: './work-page.html',
  styleUrl: './work-page.scss',
})
export class WorkPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly projectsService = inject(ProjectsService);
  private readonly localeService = inject(LocaleService);

  protected readonly project = signal<ProjectItem | null>(null);
  protected readonly notFound = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      return;
    }

    const found = this.projectsService.getById(id);
    if (found) {
      this.project.set(found);
    } else {
      this.notFound.set(true);
    }
  }

  protected goBack(): void {
    const lang = this.localeService.getCurrentLocale();
    this.router.navigate(['/', lang], { fragment: 'projects' });
  }

  // Exposes the theme as CSS custom properties so the SCSS stays the single source of styling.
  protected cardThemeVars(project: ProjectItem | null): Record<string, string> {
    if (!project) return {};
    const { accent, gradient, cover } = project.cardTheme ?? {};
    const vars: Record<string, string | undefined> = {
      '--card-accent': accent,
      '--card-from': gradient?.from,
      '--card-to': gradient?.to,
      '--card-angle': gradient?.angle === undefined ? undefined : `${gradient.angle}deg`,
      '--card-overlay': cover?.overlay === undefined ? undefined : String(cover.overlay),
    };

    return Object.fromEntries(Object.entries(vars).filter((entry): entry is [string, string] => entry[1] !== undefined));
  }
}
