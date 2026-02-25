import { Component, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-component',
  imports: [TranslatePipe],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  constructor(private translate: TranslateService) {}

  isDownloading = signal(false);

  downloadCV(): void {
    this.isDownloading.set(true);
    const lang = this.translate.getCurrentLang() ?? 'en';
    const url = `assets/cvs/cv-${lang}.pdf`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-${lang}.pdf`;
    a.click();
    setTimeout(() => this.isDownloading.set(false), 2000);
  }
}
