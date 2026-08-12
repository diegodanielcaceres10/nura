import { Component, input } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';

export interface ContactChannel {
  icon: string;
  label: string;
  value?: string;
  note?: string;
  actionLabel?: string;
  href?: string;
}

export interface AvailabilityMeta {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  protected readonly channels = input<ContactChannel[]>([
    {
      icon: 'fa-solid fa-envelope',
      label: 'Email',
      value: 'diegodanielcaceres10@gmail.com',
      note: 'CONTACT_EMAIL_NOTE',
      href: 'mailto:diegodanielcaceres10@gmail.com',
    },
    {
      icon: 'fa-brands fa-linkedin-in',
      label: 'LinkedIn',
      actionLabel: 'CONTACT_LINKEDIN_NOTE',
      href: 'https://www.linkedin.com/in/diego-daniel-caceres-1328991aa',
    },
    {
      icon: 'fa-brands fa-github',
      label: 'GitHub',
      actionLabel: 'CONTACT_GITHUB_NOTE',
      href: 'https://github.com/diegodanielcaceres10',
    },
    {
      icon: 'fa-brands fa-npm',
      label: 'npm',
      actionLabel: 'CONTACT_NPM_NOTE',
      href: 'https://npmjs.com/~diegodanielcaceres10',
    },
  ]);

  protected readonly availabilityMeta = input<AvailabilityMeta[]>([
    { icon: 'fa-solid fa-globe', title: 'CONTACT_AVAILABILITY_GLOBE_TITLE', description: 'CONTACT_AVAILABILITY_GLOBE_DESCRIPTION' },
    { icon: 'fa-regular fa-clock', title: 'CONTACT_AVAILABILITY_CLOCK_TITLE', description: 'CONTACT_AVAILABILITY_CLOCK_DESCRIPTION' },
  ]);
}
