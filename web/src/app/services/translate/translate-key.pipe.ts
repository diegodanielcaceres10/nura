import { Pipe, PipeTransform } from '@angular/core';
import { MESSAGES } from '../../i18n/messages';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslateKeyPipe implements PipeTransform {
  transform(key: string | null | undefined): string {
    if (!key) {
      return '';
    }

    // Own keys only: names inherited from Object.prototype (constructor, toString) are not messages.
    return Object.hasOwn(MESSAGES, key) ? MESSAGES[key] : key;
  }
}
