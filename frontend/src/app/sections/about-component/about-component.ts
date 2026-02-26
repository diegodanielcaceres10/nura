import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-component',
  imports: [TranslatePipe],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss',
})
export class AboutComponent {
  skills = signal(['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'PHP', 'Ionic', 'MySQL', 'MongoDB', 'REST APIs', 'Docker', 'Azure', 'Cloudflare R2', 'Firebase', 'AWS', 'CI/CD', 'Git', 'Android', 'iOS', 'Mobile Development', 'Software Architecture', 'Tech Leadership', 'Legacy Modernization', 'Agile/Scrum']);
}
