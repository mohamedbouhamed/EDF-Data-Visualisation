import { Component } from '@angular/core';
import { MyMapComponent } from '../my-map/my-map.component';

@Component({
  selector: 'app-edf',
  standalone: true,
  imports: [MyMapComponent],
  templateUrl: './edf.component.html',
  styleUrl: './edf.component.scss'
})
export class EdfComponent {

}
