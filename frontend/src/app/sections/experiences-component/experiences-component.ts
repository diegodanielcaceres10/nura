import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Experience } from '../../interfaces/experience';

@Component({
  selector: 'app-experiences-component',
  imports: [TranslatePipe],
  templateUrl: './experiences-component.html',
  styleUrl: './experiences-component.scss',
})
export class ExperiencesComponent {
  experiences: Experience[] = [
    {
      company: 'Cesla - WS Solutions',
      roleKey: 'CESLA_TECH_LEAD',
      periodKey: 'CESLA_TECH_LEAD_PERIOD',
      skills: [
        'fa-brands fa-cloudflare',
        'fa-brands fa-google-play',
        'fa-brands fa-app-store',
        'fa-brands fa-react',
        'fa-brands fa-php',
        'fa-brands fa-microsoft',
        'fa-brands fa-android',
        'fa-brands fa-apple',
        'fa-brands fa-angular',
        'fa-brands fa-js',
        'fa-brands fa-html5',
        'fa-brands fa-css',
      ],
      responsibilityKeys: [
        'CESLA_TECH_LEAD_RESPONSIBILITY_1',
        'CESLA_TECH_LEAD_RESPONSIBILITY_2',
        'CESLA_TECH_LEAD_RESPONSIBILITY_3',
        'CESLA_TECH_LEAD_RESPONSIBILITY_4',
        'CESLA_TECH_LEAD_RESPONSIBILITY_5',
        'CESLA_TECH_LEAD_RESPONSIBILITY_6',
        'CESLA_TECH_LEAD_RESPONSIBILITY_7',
      ],
    },
    {
      company: 'Cesla - WS Solutions',
      roleKey: 'CESLA_FULLSTACK',
      periodKey: 'CESLA_FULLSTACK_PERIOD',
      skills: [
        'fa-brands fa-react',
        'fa-brands fa-php',
        'fa-brands fa-microsoft',
        'fa-brands fa-android',
        'fa-brands fa-apple',
        'fa-brands fa-angular',
        'fa-brands fa-js',
        'fa-brands fa-html5',
        'fa-brands fa-css',
      ],
      responsibilityKeys: [
        'CESLA_FULLSTACK_RESPONSIBILITY_1',
        'CESLA_FULLSTACK_RESPONSIBILITY_2',
        'CESLA_FULLSTACK_RESPONSIBILITY_3',
        'CESLA_FULLSTACK_RESPONSIBILITY_4',
        'CESLA_FULLSTACK_RESPONSIBILITY_5',
        'CESLA_FULLSTACK_RESPONSIBILITY_6',
      ],
    },
    {
      company: 'Apex America',
      roleKey: 'APEX_FRONTEND',
      periodKey: 'APEX_FRONTEND_PERIOD',
      skills: [
        'fa-brands fa-aws',
        'fa-brands fa-angular',
        'fa-brands fa-js',
        'fa-brands fa-html5',
        'fa-brands fa-css',
      ],
      responsibilityKeys: [
        'APEX_FRONTEND_RESPONSIBILITY_1',
        'APEX_FRONTEND_RESPONSIBILITY_2',
        'APEX_FRONTEND_RESPONSIBILITY_3',
        'APEX_FRONTEND_RESPONSIBILITY_4',
      ],
    },
  ];
}
