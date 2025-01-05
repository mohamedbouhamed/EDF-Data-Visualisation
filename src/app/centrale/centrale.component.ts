import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Dispo } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { DatasetService } from '../srvices/dataset.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-centrale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './centrale.component.html',
  styleUrl: './centrale.component.scss'
})
export class CentraleComponent implements OnChanges {
  @Input() centrale!: Dispo;
  @Input() selectedHour!: number;
  @Input() selectedDate!: string;
  @Output() closePanel = new EventEmitter<void>();
  @Input() centralesData: Dispo[] = []; // Nouvelle input property

  additionalData: Dispo[] | null = null;
  isVisible: boolean = false;

  constructor(private datasetService: DatasetService, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['centrale'] && this.centrale) {
      this.isVisible = true;
      this.fetchAdditionalData();
    }
  }

  private getRefinements(): Record<string, string[]> {
    const hour = this.selectedHour.toString().padStart(2, '0');
    return {
      date_et_heure_fuseau_horaire_europe_paris: [this.selectedDate],
      heure_fuseau_horaire_europe_paris: [hour],
    };
  }
// Dans centrale.component.ts
goToHistogram(tranche: string): void {
  if (this.additionalData) {
    this.router.navigate(['/histogram'], {
      queryParams: { 
        centrale: this.centrale.centrale,
        tranche: tranche,
        date: this.selectedDate
      },
      state: { 
        selectedCentraleData: {
          centrale: this.centrale.centrale,
          tranches: this.additionalData
        },
        centralesData: this.centralesData // Ajout de toutes les centrales
      }
    });
  }
}
  fetchAdditionalData(): void {
    const refinements = this.getRefinements();
    this.datasetService.getDatasetAllRecords(
      refinements,
      ['centrale', 'tranche', 'point_gps_modifie_pour_afficher_la_carte_opendata', 'puissance_disponible'],
      `centrale = '${this.centrale.centrale}'`,
      "tranche ASC"
    ).subscribe({
      next: (data) => {
        this.additionalData = data.results;
        console.log('Données récupérées pour l\'histogramme :', this.additionalData);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
        this.additionalData = null;
      }
    });
  }

  close(): void {
    this.isVisible = false;
    // Attendre la fin de l'animation avant d'émettre l'événement
    setTimeout(() => {
      this.closePanel.emit();
    }, 300); // 300ms correspond à la durée de l'animation CSS
  }

  calculateTotalPower(): number {
    if (!this.additionalData) return 0;
    return this.additionalData.reduce((total, item) => total + item.puissance_disponible, 0);
  }

  calculatePowerPercentage(power: number): number {
    if (!this.additionalData || !this.additionalData.length) return 0;
    const maxPower = Math.max(...this.additionalData.map(item => item.puissance_disponible));
    return maxPower === 0 ? 0 : (power / maxPower) * 100;
  }

  // Helpers pour le formatage
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatHour(hour: number): string {
    return hour.toString().padStart(2, '0') + ':00';
  }
}