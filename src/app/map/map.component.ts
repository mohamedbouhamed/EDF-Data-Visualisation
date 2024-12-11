import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets, Dispo } from '../app.component.models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  datasets: DataSets = { total_count: 0, results: [] };
  dataset: Dispo[] = [];

  constructor(private datasetService: DatasetService) {}

  ngOnInit(): void {
    this.initMap();
    this.loadCentralesOnMap();
  }

  private initMap(): void {
    const franceBounds: L.LatLngBoundsExpression = [
      [55.124199, -5.142222], // Point le plus au nord-ouest de la France
      [40.371944, 9.561556]   // Point le plus au sud-est de la France
    ];
  
    this.map = L.map('map', {
      center: [46.6034, 1.8883], // Centre de la France
      zoom: 6,                   // Zoom initial pour voir toute la France
      minZoom: 5,                // Niveau de dézoom minimum
      maxBounds: franceBounds,   // Limiter les mouvements à une zone autour de la France
      maxBoundsViscosity: 0.8    // Empêcher complètement de sortir des limites
    });
  
    // Ajouter les tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  
    // Ajuster automatiquement la vue pour que la France remplisse l'écran
    this.map.fitBounds(franceBounds);
  }
  

  private loadCentralesOnMap(): void {
    this.datasetService.getDatasetAllRecords(
      this.getRefinementsForNow(),
      ['centrale', 'tranche', 'point_gps_modifie_pour_afficher_la_carte_opendata', 'puissance_disponible'],
      "tranche like '%1'"
    ).subscribe((data: DataSets) => {
      this.datasets = data;
      this.dataset = data.results;

      // Ajouter les marqueurs sur la carte
      this.dataset.forEach((dispo) => {
        const { lat, lon } = dispo.point_gps_modifie_pour_afficher_la_carte_opendata;
        const popupContent = `
          <b>${dispo.centrale}</b> - ${dispo.tranche}<br>
          Puissance disponible : ${dispo.puissance_disponible} MW
        `;

        // Ajouter un marqueur avec une info-bulle
        L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(popupContent);
      });
    });
  }

  private getRefinementsForNow(): Record<string, string[]> {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '/'); // Format "YYYY/MM/DD"
    const hour = now.getHours().toString().padStart(2, '0'); // Format "HH"
    return {
      date_et_heure_fuseau_horaire_europe_paris: [date],
      heure_fuseau_horaire_europe_paris: [hour]
    };
  }
}
