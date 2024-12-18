import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets, Dispo } from '../app.component.models';
import { CentraleComponent } from '../centrale/centrale.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule,CentraleComponent]
})
export class MapComponent implements OnInit {
  selectedHour: number = 0; // Heure sélectionnée
  selectedDate: string = ''; // Date sélectionnée au format "YYYY-MM-DD"
  private map!: L.Map;
  datasets: DataSets = { total_count: 0, results: [] };
  dataset: Dispo[] = [];
  selectedCentrale: Dispo | null = null; // Centrale sélectionnée
  isCompactView: boolean = false; // Vue compacte activée
  isLoading: boolean = false;

  constructor(private datasetService: DatasetService) {}

  ngOnInit(): void {
    this.initMap();
    this.setCurrentDate();
    this.setCurrentHour();
    this.loadCentralesOnMap();
  }
  private markers: Map<string, L.Marker> = new Map(); // Map pour conserver les marqueurs

  private setCurrentDate(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // Format "YYYY-MM-DD"
  }

  setCurrentHour(): void {
    const now = new Date();
    this.selectedHour = now.getHours(); // Obtient l'heure actuelle
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value; // Met à jour la date sélectionnée
    console.log(`Date sélectionnée : ${this.selectedDate}`);

    this.refreshData(); // Recharge les données avec la nouvelle date
  }

  onTimeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedHour = parseInt(input.value, 10); // Met à jour l'heure sélectionnée
    console.log(`Heure sélectionnée : ${this.selectedHour}:00`);

    this.refreshData(); // Recharge les données avec la nouvelle heure
  }

  private getRefinementsForNow(): Record<string, string[]> {
    const hour = this.selectedHour.toString().padStart(2, '0'); // Format "HH"
    return {
      date_et_heure_fuseau_horaire_europe_paris: [this.selectedDate],
      heure_fuseau_horaire_europe_paris: [hour],
    };
  }

  private loadCentralesOnMap(): void {
    this.isLoading = true; // Début du chargement
    const centraleIcon = L.icon({
      iconUrl: 'centraleNuc.png',
      iconSize: [45, 45],
      iconAnchor: [20, 0],
      popupAnchor: [0, 0],
    });
  
    this.datasetService.getDatasetAllRecords(
      this.getRefinementsForNow(),
      ['centrale', 'tranche', 'point_gps_modifie_pour_afficher_la_carte_opendata', 'puissance_disponible'],
      "tranche like '%1'"
    ).subscribe({
      next: (data: DataSets) => {
        this.datasets = data;
        this.dataset = data.results;
  
        this.dataset.forEach((dispo) => {
          const { lat, lon } = dispo.point_gps_modifie_pour_afficher_la_carte_opendata;
          const popupContent = `
            <b>${dispo.centrale}</b> - ${dispo.tranche}<br>
            Puissance disponible : ${dispo.puissance_disponible} MW
          `;
  
          // Si le marqueur existe, mettez à jour ses informations
          if (this.markers.has(dispo.tranche)) {
            const marker = this.markers.get(dispo.tranche);
            marker?.setPopupContent(popupContent); // Met à jour le contenu de la popup
          } else {
            // Sinon, créez un nouveau marqueur et ajoutez-le à la carte
            const marker = L.marker([lat, lon], { icon: centraleIcon })
              .addTo(this.map)
              .bindPopup(popupContent);
  
            // Ajoutez un gestionnaire d'événements pour la sélection
            marker.on('click', () => {
              this.selectCentrale(dispo);
            });
  
            // Stockez le marqueur dans la Map
            this.markers.set(dispo.tranche, marker);
          }
        });
  
        // Mettre à jour les données de la centrale sélectionnée si elle existe
        if (this.selectedCentrale) {
          this.updateHistogram();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données :', err);
        this.isLoading = false; // Arrêtez le chargement même en cas d'erreur
      },
      complete: () => {
        this.isLoading = false; // Arrêt du loading une fois terminé
      }
    });
  }
  
  


  private updateHistogram(): void {
    const centraleId = this.selectedCentrale?.tranche; // Identifiant unique (tranche ici)
    this.selectedCentrale = this.dataset.find((dispo) => dispo.tranche === centraleId) || null;
  }

  private initMap(): void {
    const franceBounds: L.LatLngBoundsExpression = [
      [55.124199, -5.142222], // Point le plus au nord-ouest de la France
      [40.371944, 9.561556], // Point le plus au sud-est de la France
    ];

    this.map = L.map('map', {
      center: [47.3, 1.8883], // Centre de la France
      zoom: 6, // Zoom initial
      minZoom: 6, // Niveau de dézoom minimum
      maxBounds: franceBounds, // Limiter les mouvements à une zone autour de la France
      maxBoundsViscosity: 0.8, // Empêcher complètement de sortir des limites
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
  }

  private selectCentrale(centrale: Dispo): void {
    this.selectedCentrale = centrale;
    this.isCompactView = true; // Réduire la largeur de la carte
    const { lat, lon } = centrale.point_gps_modifie_pour_afficher_la_carte_opendata;

    setTimeout(() => {
      this.map.invalidateSize(); // Recalcule la taille de la carte
      this.map.flyTo([lat, lon], 8, { animate: true }); // Recentre sur la centrale sélectionnée
    });
  }
  private refreshData(): void {
    this.isLoading = true;
    this.loadCentralesOnMap();
  }
  closeHistogram(): void {
    this.selectedCentrale = null; // Supprime la centrale sélectionnée
    this.isCompactView = false; // Désactive la vue compacte
    this.map.flyTo([47.3, 1.8883], 6, { animate: true }); // Recentre sur la position par défaut
  }
}
