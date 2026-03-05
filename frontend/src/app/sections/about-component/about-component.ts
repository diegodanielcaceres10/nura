import { Component, signal } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-about-component',
  imports: [TranslateKeyPipe],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss',
})
export class AboutComponent {
  skills = signal([
    // Frontend
    'Angular',
    'React',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    // Backend
    'Node.js',
    'PHP',
    'REST APIs',
    'MySQL',
    // Mobile
    'Ionic',
    'Cordova',
    'Capacitor',
    'Android',
    'iOS',
    // Cloud & DevOps
    'Docker',
    'Azure',
    'Cloudflare R2',
    'Firebase',
    'CI/CD',
    'Git',
    // Architecture & Leadership
    'Full Stack Development',
    'Software Architecture',
    'Team Leadership',
    'Legacy Modernization',
    'Agile/Scrum',
  ]);
}
