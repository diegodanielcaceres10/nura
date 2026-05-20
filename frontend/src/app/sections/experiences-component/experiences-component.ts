import { Component } from '@angular/core';
import { Experience } from '../../interfaces/experience';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-experiences-component',
  imports: [TranslateKeyPipe],
  templateUrl: './experiences-component.html',
  styleUrl: './experiences-component.scss',
})
export class ExperiencesComponent {
  experiences: Experience[] = [
    {
      company: 'WS Solutions - Cesla',
      roleKey: 'CESLA_TECH_LEAD_ROLE',
      roleShortKey: 'CESLA_TECH_LEAD_SHORT',
      startPeriodKey: 'CESLA_TECH_LEAD_START_PERIOD',
      endPeriodKey: 'CESLA_TECH_LEAD_END_PERIOD',
      skills: ['fa-brands fa-cloudflare', 'fa-brands fa-google-play', 'fa-brands fa-app-store', 'fa-brands fa-react', 'fa-brands fa-php', 'fa-brands fa-microsoft', 'fa-brands fa-android', 'fa-brands fa-apple', 'fa-brands fa-angular', 'fa-brands fa-js', 'fa-brands fa-html5', 'fa-brands fa-css'],
      responsibilityKeys: ['CESLA_TECH_LEAD_RESPONSIBILITY_1', 'CESLA_TECH_LEAD_RESPONSIBILITY_2', 'CESLA_TECH_LEAD_RESPONSIBILITY_3', 'CESLA_TECH_LEAD_RESPONSIBILITY_4', 'CESLA_TECH_LEAD_RESPONSIBILITY_5', 'CESLA_TECH_LEAD_RESPONSIBILITY_6', 'CESLA_TECH_LEAD_RESPONSIBILITY_7'],
    },
    {
      company: 'WS Solutions - Cesla',
      roleKey: 'CESLA_FULLSTACK_ROLE',
      roleShortKey: 'CESLA_FULLSTACK_SHORT',
      startPeriodKey: 'CESLA_FULLSTACK_START_PERIOD',
      endPeriodKey: 'CESLA_FULLSTACK_END_PERIOD',
      skills: ['fa-brands fa-react', 'fa-brands fa-php', 'fa-brands fa-microsoft', 'fa-brands fa-android', 'fa-brands fa-apple', 'fa-brands fa-angular', 'fa-brands fa-js', 'fa-brands fa-html5', 'fa-brands fa-css'],
      responsibilityKeys: ['CESLA_FULLSTACK_RESPONSIBILITY_1', 'CESLA_FULLSTACK_RESPONSIBILITY_2', 'CESLA_FULLSTACK_RESPONSIBILITY_3', 'CESLA_FULLSTACK_RESPONSIBILITY_4', 'CESLA_FULLSTACK_RESPONSIBILITY_5', 'CESLA_FULLSTACK_RESPONSIBILITY_6'],
    },
    {
      company: 'Apex America - Cognitive',
      roleKey: 'APEX_FRONTEND_ROLE',
      roleShortKey: 'APEX_FRONTEND_SHORT',
      startPeriodKey: 'APEX_FRONTEND_START_PERIOD',
      endPeriodKey: 'APEX_FRONTEND_END_PERIOD',
      skills: ['fa-brands fa-aws', 'fa-brands fa-angular', 'fa-brands fa-js', 'fa-brands fa-html5', 'fa-brands fa-css'],
      responsibilityKeys: ['APEX_FRONTEND_RESPONSIBILITY_1', 'APEX_FRONTEND_RESPONSIBILITY_2', 'APEX_FRONTEND_RESPONSIBILITY_3', 'APEX_FRONTEND_RESPONSIBILITY_4'],
    },
  ];
}
