import { Component } from '@angular/core';
import { TranslateKeyPipe } from '../../i18n/translate-key.pipe';

@Component({
  selector: 'app-footer-component',
  imports: [TranslateKeyPipe],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss',
})
export class FooterComponent {}
