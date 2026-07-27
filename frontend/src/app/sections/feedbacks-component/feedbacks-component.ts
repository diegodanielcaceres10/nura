import { Component } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';

@Component({
  selector: 'app-feedbacks-component',
  imports: [TranslateKeyPipe],
  templateUrl: './feedbacks-component.html',
  styleUrl: './feedbacks-component.scss',
})
export class FeedbacksComponent {}
