import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleService } from '../../services/locale/locale.service';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-home-component',
  imports: [TranslateKeyPipe, RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  private readonly localeService = inject(LocaleService);
  currentLang = this.localeService.getCurrentLocale();

  openCV(): void {
    const lang = this.localeService.getCurrentLocale();
    const url = `assets/cvs/cv_diego_daniel_caceres_${lang}.pdf`;
    window.open(url, '_blank');
  }
}
