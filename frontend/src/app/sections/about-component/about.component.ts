import { Component } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';

export interface EducationItem {
  icon: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface BeyondWorkItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly education: EducationItem = {
    icon: 'fa-solid fa-graduation-cap',
    degree: 'Analista de Sistemas',
    institution: 'Instituto Cervantes',
    location: 'Argentina',
    year: '2020',
  };

  protected readonly languages: LanguageItem[] = [
    { name: 'ABOUT_LANGUAGES_ES', level: 'ABOUT_LANGUAGES_NATIVE' },
    { name: 'ABOUT_LANGUAGES_PT', level: 'ABOUT_LANGUAGES_PROFESSIONAL' },
    { name: 'ABOUT_LANGUAGES_EN', level: 'ABOUT_LANGUAGES_PROFESSIONAL' },
  ];

  protected readonly beyondWork: BeyondWorkItem[] = [
    {
      icon: 'fa-solid fa-plane',
      title: 'I love to travel',
      description: 'Exploring new places and experiencing different cultures.',
    },
    {
      icon: 'fa-solid fa-camera',
      title: 'Photography',
      description: 'Capturing moments and seeing the world differently.',
    },
    {
      icon: 'fa-solid fa-mug-hot',
      title: 'Good coffee',
      description: 'Fuel for focused work and great ideas.',
    },
  ];
}
