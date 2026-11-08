import { Component, input } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { ScrollRevealDirective } from '../../directives/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-title-component',
  imports: [TranslateKeyPipe, ScrollRevealDirective],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly intro = input.required<string>();
}
