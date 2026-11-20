import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-page',
  standalone: true,
  imports: [],
  templateUrl: './loading.page.html',
  styleUrl: './loading.page.scss',
})
export class LoadingPage {}
