import { Component, signal } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-about-component',
  imports: [TranslateKeyPipe],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss',
})
export class AboutComponent {
  skills = signal(['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'PHP', 'Ionic', 'MySQL', 'MongoDB', 'REST APIs', 'Docker', 'Azure', 'Cloudflare R2', 'Firebase', 'AWS', 'CI/CD', 'Git', 'Android', 'iOS', 'Mobile Development', 'Software Architecture', 'Tech Leadership', 'Legacy Modernization', 'Agile/Scrum']);
}
