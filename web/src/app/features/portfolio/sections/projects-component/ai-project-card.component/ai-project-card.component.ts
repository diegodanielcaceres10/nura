import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectItem } from '../../../../../core/models/project.model';
import { TranslateKeyPipe } from '../../../../../core/services/translate/translate-key.pipe';
import { LocaleService } from '../../../../../core/services/locale/locale.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
