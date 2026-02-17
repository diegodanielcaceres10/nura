import { Component, signal, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Card } from './shared/card/card';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    imports: [
        TranslatePipe,
        Card
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})

export class App {
    protected readonly title = signal('frontend');
    isSticky = false;

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isSticky = window.scrollY > 10;
    }
    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }
}
