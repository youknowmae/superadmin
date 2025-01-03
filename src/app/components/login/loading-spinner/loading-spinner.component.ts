import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  imports: [MatProgressSpinnerModule],
  standalone: true
})
export class LoadingSpinnerComponent {

}
