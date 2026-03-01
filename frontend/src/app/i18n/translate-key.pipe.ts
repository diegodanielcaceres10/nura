import { Pipe, PipeTransform } from '@angular/core';
import { MESSAGES } from './messages';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslateKeyPipe implements PipeTransform {
  transform(key: string | null | undefined): string {
    if (!key) {
      return '';
    }

    return MESSAGES[key] ?? key;
  }
}
