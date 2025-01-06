import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  errorMessage: string | null = null;

  goToEco2Mix(): void {
    window.open('https://www.rte-france.com/eco2mix/la-production-delectricite-par-filiere', '_blank');
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['error'] === 'cours_introuvable') {
        this.errorMessage = 'Cours introuvable !';
      }
    });
  }
}

