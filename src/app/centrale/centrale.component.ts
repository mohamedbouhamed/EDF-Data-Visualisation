import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Dispo } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { DatasetService } from '../srvices/dataset.service';
@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './centrale.component.html',
  styleUrl: './centrale.component.scss'
})
export class CentraleComponent {
  @Input() centrale!: Dispo;
  @Input() selectedHour!: number; // Reçoit l'heure sélectionnée
  @Input() selectedDate!: string; // Reçoit l'heure sélectionnée
  @Output() closePanel = new EventEmitter<void>(); // Événement pour fermer le panneau

  additionalData: any = null; // Stocke les données récupérées pour l'histogramme

  constructor(private datasetService: DatasetService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['centrale'] && this.centrale) {
      this.fetchAdditionalData(); // Récupère les données pour la centrale sélectionnée
    }
  }
  private getRefinements(): Record<string, string[]> {
    const hour = this.selectedHour.toString().padStart(2, '0'); // Format "HH"
    return {
      date_et_heure_fuseau_horaire_europe_paris: [this.selectedDate],
      heure_fuseau_horaire_europe_paris: [hour],
    };
  }
  fetchAdditionalData(): void {
    const refinements = this.getRefinements(); // Utilise la date et l'heure sélectionnées
    this.datasetService.getDatasetAllRecords(
      refinements,
      ['centrale', 'tranche', 'point_gps_modifie_pour_afficher_la_carte_opendata', 'puissance_disponible'],
      "centrale = '" + this.centrale.centrale + "'",
      "tranche ASC"
    ).subscribe((data) => {
      this.additionalData = data.results;
      console.log('Données récupérées pour l’histogramme :', this.additionalData);
    });
  }

  close(): void {
    this.closePanel.emit(); // Émet l'événement lorsqu'on clique sur le bouton
  }
}
