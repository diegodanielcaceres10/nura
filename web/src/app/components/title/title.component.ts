import { Component, input } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-title-component',
  imports: [TranslateKeyPipe],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly intro = input.required<string>();
}
