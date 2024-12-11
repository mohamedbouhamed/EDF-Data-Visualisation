import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets, Dispo } from '../app.component.models';
import { HistogramComponent } from '../histogram/histogram.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule,HistogramComponent]
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  datasets: DataSets = { total_count: 0, results: [] };
  dataset: Dispo[] = [];
  selectedCentrale: Dispo | null = null; // Centrale sélectionnée
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
      center: [47.3, 1.8883], // Centre de la France
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

  }
  

  private loadCentralesOnMap(): void {
    const centraleIcon = L.icon({
      iconUrl: 'centraleNuc.png', // Chemin de l'image de l'icône
      iconSize: [45, 45],                      // Taille de l'icône
      iconAnchor: [20, 0],                    // Point d'ancrage
      popupAnchor: [0, 0]                    // Décalage pour l'info-bulle
    });  
    this.datasetService.getDatasetAllRecords(
      this.getRefinementsForNow(),
      ['centrale', 'tranche', 'point_gps_modifie_pour_afficher_la_carte_opendata', 'puissance_disponible'],
      "tranche like '%1'"
    ).subscribe((data: DataSets) => {
      this.datasets = data;
      this.dataset = data.results;

      this.dataset.forEach((dispo) => {
        const { lat, lon } = dispo.point_gps_modifie_pour_afficher_la_carte_opendata;
        const popupContent = `
          <b>${dispo.centrale}</b> - ${dispo.tranche}<br>
          Puissance disponible : ${dispo.puissance_disponible} MW
        `;

        const marker = L.marker([lat, lon], { icon: centraleIcon })
          .addTo(this.map)
          .bindPopup(popupContent);

        marker.on('click', () => {
          this.selectCentrale(dispo); // Gestion de la sélection
        });
      });
    });
  }

  private selectCentrale(centrale: Dispo): void {
    this.selectedCentrale = centrale; // Mettre à jour la centrale sélectionnée
    const { lat, lon } = centrale.point_gps_modifie_pour_afficher_la_carte_opendata;

    // Déplacer la carte vers la centrale sélectionnée
    this.map.flyTo([lat, lon], 8, { animate: true });
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