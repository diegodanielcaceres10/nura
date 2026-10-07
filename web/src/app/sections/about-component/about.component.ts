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
  protected readonly education: EducationItem[] = [
    {
      icon: 'fa-solid fa-graduation-cap',
      degree: 'ABOUT_EDUCATION_SYSTEMS_ANALYST_DEGREE',
      institution: 'Institución Cervantes',
      location: 'Argentina',
      year: '2020',
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      degree: 'ABOUT_EDUCATION_PROGRAMMER_ANALYST_DEGREE',
      institution: 'Institución Cervantes',
      location: 'Argentina',
      year: '2016',
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      degree: 'ABOUT_EDUCATION_IT_TECHNICIAN_DEGREE',
      institution: 'Institución Cervantes',
      location: 'Argentina',
      year: '2015',
    },
  ];

  protected readonly languages: LanguageItem[] = [
    { name: 'ABOUT_LANGUAGES_ES', level: 'ABOUT_LANGUAGES_NATIVE' },
    { name: 'ABOUT_LANGUAGES_PT', level: 'ABOUT_LANGUAGES_PROFESSIONAL' },
    { name: 'ABOUT_LANGUAGES_EN', level: 'ABOUT_LANGUAGES_PROFESSIONAL' },
  ];

  protected readonly beyondWork: BeyondWorkItem[] = [
    {
      icon: 'fa-solid fa-plane',
      title: 'ABOUT_BEYOND_TRAVEL_TITLE',
      description: 'ABOUT_BEYOND_TRAVEL_DESCRIPTION',
    },
    {
      icon: 'fa-solid fa-camera',
      title: 'ABOUT_BEYOND_PHOTO_TITLE',
      description: 'ABOUT_BEYOND_PHOTO_DESCRIPTION',
    },
    {
      icon: 'fa-solid fa-mug-hot',
      title: 'ABOUT_BEYOND_COOFEE_TITLE',
      description: 'ABOUT_BEYOND_COOFEE_DESCRIPTION',
    },
  ];
}
