import { Component } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';

export type ExperienceLogoVariant = 'apex' | 'cesla';

export interface ExperienceStat {
  icon: string;
  value: string;
  labelKey: string;
}

export interface ExperienceEntry {
  id: string;
  logoText: string;
  logoVariant: ExperienceLogoVariant;
  company: string;
  roleKey: string;
  durationLabel: string;
  startPeriodKey: string;
  endPeriodKey: string;
  descriptionKeys: string[];
  techStack: string[];
  stats: ExperienceStat[];
}

@Component({
  selector: 'app-experiences-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
})
export class ExperiencesComponent {
  protected readonly entries: ExperienceEntry[] = [
    {
      id: 'apex',
      logoText: 'APEX',
      logoVariant: 'apex',
      company: 'Apex America · Cognitive',
      roleKey: 'EXPERIENCE_APEX_FRONTEND_ROLE',
      durationLabel: '1.2 years',
      startPeriodKey: 'EXPERIENCE_APEX_FRONTEND_START_PERIOD',
      endPeriodKey: 'EXPERIENCE_APEX_FRONTEND_END_PERIOD',
      descriptionKeys: ['EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_1', 'EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_2', 'EXPERIENCE_APEX_FRONTEND_RESPONSIBILITY_3'],
      techStack: ['AngularJS', 'JavaScript', 'HTML5', 'CSS3', 'MongoDB', 'AWS'],
      stats: [],
    },
    {
      id: 'cesla',
      logoText: 'CESLA',
      logoVariant: 'cesla',
      company: 'WS Solutions · Cesla',
      roleKey: 'EXPERIENCE_CESLA_FULLSTACK_ROLE',
      durationLabel: '4.8 years',
      startPeriodKey: 'EXPERIENCE_CESLA_FULLSTACK_START_PERIOD',
      endPeriodKey: 'EXPERIENCE_CESLA_FULLSTACK_END_PERIOD',
      descriptionKeys: ['EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_1', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_2', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_3', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_4', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_5', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_6', 'EXPERIENCE_CESLA_FULLSTACK_RESPONSIBILITY_7'],
      techStack: ['Angular', 'React', 'Ionic', 'Capacitor', 'Node.js', 'MySQL', 'Docker', 'Azure', 'Cloudflare R2', 'Firebase', 'CI/CD', 'REST APIs'],
      stats: [
        { icon: 'fa-solid fa-user-tie', value: '40+', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_CLIENTS' },
        { icon: 'fa-solid fa-users', value: '+1000', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_USERS' },
        { icon: 'fa-solid fa-shield-halved', value: '>95%', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_AVAILABILITY' },
        { icon: 'fa-solid fa-mobile-screen-button', value: '5', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_MOBILE_APPS' },
        { icon: 'fa-solid fa-plug', value: '5', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_APIS' },
        { icon: 'fa-solid fa-arrow-trend-down', value: '50%', labelKey: 'EXPERIENCE_CESLA_FULLSTACK_STATS_INCIDENTS' },
      ],
    },
  ];
}
