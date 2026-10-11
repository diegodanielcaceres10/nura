import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../components/header-component/header-component';
import { FooterComponent } from '../components/footer-component/footer-component';
import { CaseStudyDetail, CaseStudyItem } from '../sections/case-study-component/case-study.component';
import { CaseStudiesService } from '../services/case-studies/case-studies.service';
import { LocaleService } from '../services/locale/locale.service';
import { TranslateKeyPipe } from '../services/translate/translate-key.pipe';

type CopySection = Exclude<keyof CaseStudyDetail, 'stack'>;

const SECTIONS: { key: CopySection; label: string }[] = [
  { key: 'context', label: 'CASE_DETAIL_LABEL_CONTEXT' },
  { key: 'challenge', label: 'CASE_DETAIL_LABEL_CHALLENGE' },
  { key: 'role', label: 'CASE_DETAIL_LABEL_ROLE' },
  { key: 'decisions', label: 'CASE_DETAIL_LABEL_DECISIONS' },
  { key: 'execution', label: 'CASE_DETAIL_LABEL_EXECUTION' },
  { key: 'results', label: 'CASE_DETAIL_LABEL_RESULTS' },
  { key: 'learnings', label: 'CASE_DETAIL_LABEL_LEARNINGS' },
];

@Component({
  selector: 'app-case-study-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TranslateKeyPipe],
  templateUrl: './case-study-page.html',
  styleUrl: './case-study-page.scss',
})
export class CaseStudyPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly caseStudiesService = inject(CaseStudiesService);
  private readonly localeService = inject(LocaleService);

  protected readonly caseStudy = signal<CaseStudyItem | null>(null);
  protected readonly notFound = signal(false);

  // Only sections that have copy are rendered, in the fixed order above.
  protected readonly sections = computed(() => {
    const current = this.caseStudy();
    if (!current) return [];

    return SECTIONS.filter((section) => !!current.detail[section.key]).map((section) => ({ key: section.key, label: section.label, copy: current.detail[section.key] }));
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = slug ? this.caseStudiesService.getBySlug(slug) : undefined;

    if (found) {
      this.caseStudy.set(found);
    } else {
      this.notFound.set(true);
    }
  }

  // Router navigation (not Location.back) so a deep link with no history still lands on the section.
  protected goBack(): void {
    const lang = this.localeService.getCurrentLocale();
    this.router.navigate(['/', lang], { fragment: 'case-study' });
  }
}
