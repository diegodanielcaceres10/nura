import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { splitParagraphs } from '../../../services/translate/split-paragraphs';
import { TranslateKeyPipe } from '../../../services/translate/translate-key.pipe';
import { ProjectItem } from '../projects.component';

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
