import { Component, Input } from '@angular/core';
import { Dispo } from '../app.component.models';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="centrale">
      <h3>{{ centrale.centrale }}</h3>
      <p>Tranche: {{ centrale.tranche }}</p>
      <p>Puissance disponible: {{ centrale.puissance_disponible }} MW</p>
    </div>
  `,
  styleUrl: './histogram.component.scss'
})
export class HistogramComponent {
  @Input() centrale!: Dispo;

}
