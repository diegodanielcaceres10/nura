import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';
import { CaseStudiesService } from '../../services/case-studies/case-studies.service';
import { LocaleService } from '../../services/locale/locale.service';

export interface CaseStudyMetric {
  icon: string;
  value: string;
  label: string;
}

export interface CaseStudyDetail {
  context: string;
  challenge: string;
  role: string;
  decisions: string;
  execution: string;
  results: string;
  learnings: string;
  stack: string[];
}

export interface CaseStudyItem {
  number: string;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: CaseStudyMetric[];
  slug: string;
  detail: CaseStudyDetail;
}

@Component({
  selector: 'app-case-study-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent, RouterLink],
  templateUrl: './case-study.component.html',
  styleUrl: './case-study.component.scss',
})
export class CaseStudyComponent {
  protected readonly caseStudies: CaseStudyItem[] = inject(CaseStudiesService).getAll();
  protected readonly locale = inject(LocaleService).getCurrentLocale();
}
