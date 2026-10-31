import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectItem } from '../projects.component';
import { TranslateKeyPipe } from '../../../services/translate/translate-key.pipe';
import { LocaleService } from '../../../services/locale/locale.service';

@Component({
  selector: 'app-ai-project-card',
  standalone: true,
  imports: [TranslateKeyPipe],
  templateUrl: './ai-project-card.component.html',
  styleUrl: './ai-project-card.component.scss',
})
export class AiProjectCardComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  readonly product = input.required<ProjectItem>();

  protected navigateToWork(): void {
    const lang = this.localeService.getCurrentLocale();
    this.router.navigate(['/', lang, 'work', this.product().id]);
  }
}
