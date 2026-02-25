import { Component, signal, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header-component',
  imports: [TranslatePipe],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 10);
  }
}
