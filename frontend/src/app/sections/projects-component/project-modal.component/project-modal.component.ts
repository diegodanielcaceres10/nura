import { Component, input, output } from '@angular/core';
import { TranslateKeyPipe } from '../../../services/translate/translate-key.pipe';
import { ProjectItem } from '../projects.component';
import { ProjectCardComponent } from '../project-card.component/project-card.component';

@Component({
  selector: 'app-project-modal-component',
  imports: [TranslateKeyPipe, ProjectCardComponent],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
})
export class ProjectModalComponent {
  readonly project = input.required<ProjectItem>();

  readonly closeModalProject = output<void>();

  protected closeProject(): void {
    this.closeModalProject.emit();
  }
}
