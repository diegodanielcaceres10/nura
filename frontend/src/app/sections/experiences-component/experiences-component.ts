import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-experiences-component',
  imports: [TranslatePipe],
  templateUrl: './experiences-component.html',
  styleUrl: './experiences-component.scss',
})
export class ExperiencesComponent {}
