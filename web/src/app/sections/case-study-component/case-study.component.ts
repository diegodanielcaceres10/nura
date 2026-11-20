import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateKeyPipe } from '../../core/services/translate/translate-key.pipe';
import { TitleComponent } from '../../shared/components/title/title.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal/scroll-reveal.directive';
import { CaseStudiesService } from '../../core/services/case-studies/case-studies.service';
import { LocaleService } from '../../core/services/locale/locale.service';
import { CaseStudyItem } from '../../core/models/case-study.model';

export type { CaseStudyDetail, CaseStudyItem, CaseStudyMetric } from '../../core/models/case-study.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-case-study-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent, RouterLink, ScrollRevealDirective],
  templateUrl: './case-study.component.html',
  styleUrl: './case-study.component.scss',
})
export class CaseStudyComponent {
  protected readonly caseStudies: CaseStudyItem[] = inject(CaseStudiesService).getAll();
  protected readonly locale = inject(LocaleService).getCurrentLocale();
}
