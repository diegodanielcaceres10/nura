import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-component',
  imports: [TranslatePipe],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  constructor(private translate: TranslateService) {}

  openCV(): void {
    const lang = this.translate.getCurrentLang() ?? 'en';
    const url = `assets/cvs/diego-daniel-caceres-cv-${lang}.pdf`;
    window.open(url, '_blank');
  }
}
