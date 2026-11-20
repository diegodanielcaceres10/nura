import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { splitParagraphs } from '../../../core/services/translate/split-paragraphs';
import { TranslateKeyPipe } from '../../../core/services/translate/translate-key.pipe';
import { ProjectItem } from '../../../core/models/project.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-card-component',
  imports: [TranslateKeyPipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  readonly project = input.required<ProjectItem>();
  readonly fullDescription = input<boolean>(false);

  protected readonly splitParagraphs = splitParagraphs;
}
