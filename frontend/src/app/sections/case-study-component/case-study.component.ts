import { Component, signal } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';

export interface CaseStudyMetric {
  icon: string;
  value: string;
  label: string;
}

export interface CaseStudyItem {
  number: string;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: CaseStudyMetric[];
  link: string;
}

@Component({
  selector: 'app-case-study-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent],
  templateUrl: './case-study.component.html',
  styleUrl: './case-study.component.scss',
})
export class CaseStudyComponent {
  protected readonly caseStudies = signal<CaseStudyItem[]>([
    {
      number: '01',
      category: 'Mobile',
      icon: 'fa-solid fa-mobile-screen-button',
      title: 'CASE_STUDY_01_TITLE',
      subtitle: 'Ionic 3 + Cordova → Ionic 8 + Capacitor',
      description: 'CASE_STUDY_01_DESCRIPTION',
      metrics: [
        { icon: 'fa-solid fa-arrow-trend-up', value: 'Ionic 3 → 8', label: 'CASE_STUDY_01_METRIC_01_LABEL' },
        { icon: 'fa-solid fa-arrows-rotate', value: 'Cordova → Capacitor', label: 'CASE_STUDY_01_METRIC_02_LABEL' },
      ],
      link: '/case-studies/legacy-mobile-migration',
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
      link: '/case-studies/cicd-pipeline-automation',
    },
    {
      number: '03',
      category: 'Infrastructure',
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'CASE_STUDY_03_TITLE',
      subtitle: 'Azure Blob Storage → Cloudflare R2',
      description: 'CASE_STUDY_03_DESCRIPTION',
      metrics: [{ icon: 'fa-solid fa-percent', value: '50%', label: 'CASE_STUDY_03_METRIC_01_LABEL' }],
      link: '/case-studies/cloud-storage-migration',
    },
    {
      number: '04',
      category: 'Web / Backend',
      icon: 'fa-solid fa-code',
      title: 'CASE_STUDY_04_TITLE',
      subtitle: 'Refactor',
      description: 'CASE_STUDY_04_TITLE',
      metrics: [{ icon: 'fa-solid fa-arrow-trend-down', value: '-60%', label: 'CASE_STUDY_04_TITLE' }],
      link: '/case-studies/legacy-codebase-modernization',
    },
  ]);
}
