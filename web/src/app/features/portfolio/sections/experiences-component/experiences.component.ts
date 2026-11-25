import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../../../core/services/locale/locale.service';
import { TranslateKeyPipe } from '../../../../core/services/translate/translate-key.pipe';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal/scroll-reveal.directive';

export type ExperienceLogoVariant = 'apex' | 'cesla';

export interface ExperienceStat {
  icon: string;
  value: string;
  labelKey: string;
}

export interface ExperienceCaseLink {
  slug: string;
  titleKey: string;
}

export interface ExperienceEntry {
  id: string;
  logoText: string;
  logoVariant: ExperienceLogoVariant;
  company: string;
  roleKey: string;
  startPeriodKey: string;
  endPeriodKey: string;
  summaryKey: string;
  descriptionKeys: string[];
  // Optional: bullets (by description key) that link to the case study that backs them.
  caseLinks?: Readonly<Record<string, ExperienceCaseLink>>;
  techStack: string[];
  stats: ExperienceStat[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-experiences-component',
  standalone: true,
  imports: [RouterLink, TranslateKeyPipe, TitleComponent, ScrollRevealDirective],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
})
export class ExperiencesComponent {
  protected readonly locale = inject(LocaleService).getCurrentLocale();

  protected readonly entries: ExperienceEntry[] = [
    {
      id: 'cesla-tech-lead',
      logoText: 'CESLA',
      logoVariant: 'cesla',
      company: 'Cesla',
      roleKey: 'EXPERIENCE_CESLA_TECH_LEAD_ROLE',
      startPeriodKey: 'EXPERIENCE_CESLA_TECH_LEAD_START_PERIOD',
      endPeriodKey: 'EXPERIENCE_CESLA_TECH_LEAD_END_PERIOD',
      summaryKey: 'EXPERIENCE_CESLA_TECH_LEAD_SUMMARY',
      descriptionKeys: ['EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_1', 'EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_2', 'EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_3', 'EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_4'],
      caseLinks: {
        EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_1: { slug: 'legacy-mobile-migration', titleKey: 'CASE_STUDY_01_TITLE' },
        EXPERIENCE_CESLA_TECH_LEAD_RESPONSIBILITY_3: { slug: 'recurring-bugs-reduction', titleKey: 'CASE_STUDY_05_TITLE' },
      },
      techStack: ['Angular', 'TypeScript', 'Ionic', 'Capacitor', 'React', 'Node.js', 'Express', 'Azure DevOps', 'CI/CD', 'Docker', 'Cypress'],
      // The Cesla figures cover the whole stay, so they are shown once, on the most recent card.
      stats: [
        { icon: 'fa-solid fa-user-tie', value: '~40', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_CLIENTS' },
        { icon: 'fa-solid fa-users', value: '+1000', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_USERS' },
        { icon: 'fa-solid fa-mobile-screen-button', value: '5', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_MOBILE_APPS' },
        { icon: 'fa-solid fa-plug', value: '5', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_APIS' },
      ],
    },
    {
      id: 'cesla-frontend',
      logoText: 'CESLA',
      logoVariant: 'cesla',
      company: 'Cesla',
      roleKey: 'EXPERIENCE_CESLA_FRONTEND_ROLE',
      startPeriodKey: 'EXPERIENCE_CESLA_FRONTEND_START_PERIOD',
      endPeriodKey: 'EXPERIENCE_CESLA_FRONTEND_END_PERIOD',
      summaryKey: 'EXPERIENCE_CESLA_FRONTEND_SUMMARY',
      descriptionKeys: ['EXPERIENCE_CESLA_FRONTEND_RESPONSIBILITY_1', 'EXPERIENCE_CESLA_FRONTEND_RESPONSIBILITY_2', 'EXPERIENCE_CESLA_FRONTEND_RESPONSIBILITY_3', 'EXPERIENCE_CESLA_FRONTEND_RESPONSIBILITY_4'],
      caseLinks: {
        EXPERIENCE_CESLA_FRONTEND_RESPONSIBILITY_1: { slug: 'legacy-codebase-modernization', titleKey: 'CASE_STUDY_04_TITLE' },
      },
      techStack: ['Angular', 'TypeScript', 'RxJS', 'Ionic', 'Storybook', 'Azure DevOps'],
      stats: [],
    },
    {
      id: 'apex',
      logoText: 'APEX',
      logoVariant: 'apex',
      company: 'Apex America',
      roleKey: 'EXPERIENCE_APEX_FRONTEND_ROLE',
      startPeriodKey: 'EXPERIENCE_APEX_FRONTEND_START_PERIOD',
      endPeriodKey: 'EXPERIENCE_APEX_FRONTEND_END_PERIOD',
      summaryKey: 'EXPERIENCE_APEX_FRONTEND_SUMMARY',
      descriptionKeys: ['EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_1', 'EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_2', 'EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_3'],
      techStack: ['Angular', 'AngularJS', 'JavaScript', 'RxJS', 'HTML5', 'CSS3', 'MongoDB', 'Jira', 'Git', 'AWS'],
      stats: [],
    },
  ];
}
