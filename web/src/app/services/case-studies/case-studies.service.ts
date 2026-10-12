import { Injectable } from '@angular/core';
import { CaseStudyDetail, CaseStudyItem } from '../../sections/case-study-component/case-study.component';

// Detail keys follow CASE_DETAIL_<SLUG>_<SECTION>; they are named after the slug, not the card number.
function detailFor(slug: string, stack: string[]): CaseStudyDetail {
  const key = (section: string): string => `CASE_DETAIL_${slug.toUpperCase().replace(/-/g, '_')}_${section}`;
  return {
    context: key('CONTEXT'),
    challenge: key('CHALLENGE'),
    role: key('ROLE'),
    decisions: key('DECISIONS'),
    execution: key('EXECUTION'),
    results: key('RESULTS'),
    learnings: key('LEARNINGS'),
    stack,
  };
}

@Injectable({ providedIn: 'root' })
export class CaseStudiesService {
  private readonly caseStudies: CaseStudyItem[] = [
    {
      number: '01',
      category: 'Web / Backend',
      icon: 'fa-solid fa-code',
      title: 'CASE_STUDY_04_TITLE',
      subtitle: 'US workflow → LATAM workflow',
      description: 'CASE_STUDY_04_DESCRIPTION',
      metrics: [{ icon: 'fa-solid fa-arrow-trend-down', value: '-60%', label: 'CASE_STUDY_04_METRIC_01_LABEL' }],
      slug: 'legacy-codebase-modernization',
      detail: detailFor('legacy-codebase-modernization', ['Ionic 5', 'Angular 8+', 'Node.js', 'Express']),
    },
    {
      number: '02',
      category: 'Infrastructure',
      icon: 'fa-solid fa-infinity',
      title: 'CASE_STUDY_02_TITLE',
      subtitle: '1h → 5m',
      description: 'CASE_STUDY_02_DESCRIPTION',
      metrics: [
        { icon: 'fa-regular fa-clock', value: '60 min → 5 min', label: 'CASE_STUDY_02_METRIC_01_LABEL' },
        { icon: 'fa-solid fa-rocket', value: '4–6', label: 'CASE_STUDY_02_METRIC_02_LABEL' },
      ],
      slug: 'cicd-pipeline-automation',
      detail: detailFor('cicd-pipeline-automation', ['Ionic 3', 'Ionic 4', 'Ionic 5', 'Azure DevOps', 'Gradle', 'Google Play', 'App Store']),
    },
    {
      number: '03',
      category: 'Team / Process',
      icon: 'fa-solid fa-users',
      title: 'CASE_STUDY_05_TITLE',
      subtitle: 'Semester → semester',
      description: 'CASE_STUDY_05_DESCRIPTION',
      metrics: [{ icon: 'fa-solid fa-bug', value: '-50%', label: 'CASE_STUDY_05_METRIC_01_LABEL' }],
      slug: 'recurring-bugs-reduction',
      detail: detailFor('recurring-bugs-reduction', ['React 18', 'Ionic', 'Angular 8–18', 'Azure DevOps']),
    },
    {
      number: '04',
      category: 'Mobile',
      icon: 'fa-solid fa-mobile-screen-button',
      title: 'CASE_STUDY_01_TITLE',
      subtitle: 'Ionic 3 + Cordova → Ionic 8 + Capacitor',
      description: 'CASE_STUDY_01_DESCRIPTION',
      metrics: [
        { icon: 'fa-solid fa-arrow-trend-up', value: 'Ionic 3 → 8', label: 'CASE_STUDY_01_METRIC_01_LABEL' },
        { icon: 'fa-solid fa-arrows-rotate', value: 'Cordova → Capacitor', label: 'CASE_STUDY_01_METRIC_02_LABEL' },
      ],
      slug: 'legacy-mobile-migration',
      detail: detailFor('legacy-mobile-migration', ['Ionic 3, 4, 5 → Ionic 8', 'Cordova → Capacitor']),
    },
    {
      number: '05',
      category: 'Infrastructure',
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'CASE_STUDY_03_TITLE',
      subtitle: 'Azure Blob Storage → Cloudflare R2',
      description: 'CASE_STUDY_03_DESCRIPTION',
      metrics: [{ icon: 'fa-solid fa-percent', value: '50%', label: 'CASE_STUDY_03_METRIC_01_LABEL' }],
      slug: 'cloud-storage-migration',
      detail: detailFor('cloud-storage-migration', ['Node.js', 'Express', 'PHP', 'Azure Blob Storage', 'Cloudflare R2']),
    },
  ];

  getAll(): CaseStudyItem[] {
    return this.caseStudies;
  }

  getBySlug(slug: string): CaseStudyItem | undefined {
    return this.caseStudies.find((item) => item.slug === slug);
  }
}
