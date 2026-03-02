import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../i18n/locale.service';
import { TranslateKeyPipe } from '../../i18n/translate-key.pipe';

@Component({
  selector: 'app-home-component',
  imports: [TranslateKeyPipe, RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  private readonly localeService = inject(LocaleService);

  openCV(): void {
    const lang = this.localeService.getCurrentLocale();
    const url = `assets/cvs/diego-daniel-caceres-cv-${lang}.pdf`;
    window.open(url, '_blank');
  }
}
