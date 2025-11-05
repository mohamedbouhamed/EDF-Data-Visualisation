import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatasetService } from '../services/dataset.service';

interface Statistics {
  totalCentrales: number;
  totalPower: number;
  availabilityRate: number;
  totalReactors: number;
  loading: boolean;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  errorMessage: string | null = null;
  stats: Statistics = {
    totalCentrales: 0,
    totalPower: 0,
    availabilityRate: 0,
    totalReactors: 0,
    loading: true
  };

  constructor(private datasetService: DatasetService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Récupérer les données les plus récentes
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    this.datasetService.getDatasetAllRecords(
      {},
      ['centrale', 'tranche', 'puissance_disponible', 'date_et_heure_fuseau_horaire_europe_paris'],
      `date_et_heure_fuseau_horaire_europe_paris >= date'${dateStr}'`,
      'date_et_heure_fuseau_horaire_europe_paris desc'
    ).subscribe({
      next: (data) => {
        if (data.results && data.results.length > 0) {
          // Prendre seulement les données de la dernière heure disponible
          const latestDate = data.results[0].date_et_heure_fuseau_horaire_europe_paris;
          const latestData = data.results.filter(
            r => r.date_et_heure_fuseau_horaire_europe_paris === latestDate
          );

          const centrales = new Set(latestData.map(r => r.centrale));
          const totalPower = latestData.reduce((sum, r) => sum + (r.puissance_disponible || 0), 0);

          // Puissance installée totale théorique: ~63 GW pour le parc EDF
          const totalInstalledTheoretical = 63200; // MW

          this.stats = {
            totalCentrales: centrales.size,
            totalPower: Math.round(totalPower),
            availabilityRate: Math.round((totalPower / totalInstalledTheoretical) * 100),
            totalReactors: latestData.length,
            loading: false
          };
        } else {
          this.stats.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.stats.loading = false;
        this.errorMessage = 'Impossible de charger les statistiques';
      }
    });
  }
}
