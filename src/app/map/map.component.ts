import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets, DateLimits, Dispo } from '../app.component.models';
import { CentraleComponent } from '../centrale/centrale.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule,CentraleComponent,TranslateModule]
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
  dateLimits: DateLimits | null = null;
  minDate: string = '';
  maxDate: string = '';

  constructor(private datasetService: DatasetService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.initMap();
    this.setCurrentDate();
    this.setCurrentHour();
    this.loadCentralesOnMap();
    this.loadDateLimits();
  }
  private loadDateLimits(): void {
    this.isLoading = true;
    this.datasetService.getDateLimits().subscribe({
      next: (data) => {
        // Conversion des dates en format YYYY-MM-DD pour l'input date
        this.minDate = new Date(data.results[0]['min(date_et_heure_fuseau_horaire_europe_paris)']).toISOString().split('T')[0];
        this.maxDate = new Date(data.results[0]['max(date_et_heure_fuseau_horaire_europe_paris)']).toISOString().split('T')[0];
        
        // Vérifier si la date actuelle est dans les limites
        const currentDate = new Date(this.selectedDate);
        const minDateTime = new Date(this.minDate);
        const maxDateTime = new Date(this.maxDate);
        
        if (currentDate < minDateTime || currentDate > maxDateTime) {
          this.selectedDate = new Date().toISOString().split('T')[0];
        }
        
        this.isLoading = false;
        // Charger les données initiales après avoir défini les limites
        this.loadCentralesOnMap();  // Votre méthode de chargement de données existante
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dates limites:', error);
        this.isLoading = false;
      }
    });
  }
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
    this.isLoading = true;
    
    // Définition de l'icône principale
    const centraleIcon = L.icon({
      iconUrl: 'centraleNuc1.png',
      iconSize: [45, 45],
      iconAnchor: [20, 0],
      popupAnchor: [0, 0],
    });
  
    // Effacer tous les marqueurs existants
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        this.map.removeLayer(layer);
      }
    });
  
    // Map pour stocker les cercles de chaque centrale
    const circlesMap = new Map<string, L.Circle[]>();
  
    this.datasetService.getDatasetAllRecords(
      this.getRefinementsForNow(),
      ['centrale', 'point_gps_modifie_pour_afficher_la_carte_opendata'],
      "tranche like '%1'"
    ).subscribe({
      next: (data: DataSets) => {
        this.datasets = data;
        this.dataset = data.results;
  
        // Pour chaque centrale, récupérer les données de toutes ses tranches
        this.dataset.forEach((dispo) => {
          const { lat, lon } = dispo.point_gps_modifie_pour_afficher_la_carte_opendata;
          const marker = L.marker([lat, lon], { icon: centraleIcon })
            .addTo(this.map);
  
          // Créer popup
          const popup = L.popup({
            closeButton: false,
            className: 'custom-popup'
          }).setContent(`<b>${dispo.centrale}</b>`);
  
          // Récupérer les données des tranches
          this.datasetService.getDatasetAllRecords(
            this.getRefinementsForNow(),
            ['tranche', 'puissance_disponible'],
            `centrale = '${dispo.centrale}'`,
            "tranche ASC"
          ).subscribe(tranchesData => {
            const circles: L.Circle[] = [];
            
            // Créer un cercle pour chaque tranche
            tranchesData.results.forEach((tranche, index) => {
              // Calculer la position du cercle autour du marqueur
              const angle = (index * 2 * Math.PI) / tranchesData.results.length;
              const radius = 30; // Rayon du cercle par rapport au marqueur
              const circleLat = lat + Math.cos(angle) * 0.001;
              const circleLon = lon + Math.sin(angle) * 0.001;
  
              // Déterminer la couleur en fonction de la puissance disponible
              const disponibilite = tranche.puissance_disponible / 1400; // Supposant 1400MW max
              const color = this.getColorFromDisponibilite(disponibilite);
  
              const circle = L.circle([circleLat, circleLon], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: 200, // Taille du cercle en mètres
                interactive: false // Pour que les cercles ne capturent pas les événements
              });
  
              circles.push(circle);
            });
  
            circlesMap.set(dispo.centrale, circles);
  
            // Événements hover
            marker.on('mouseover', (e) => {
              popup.setLatLng(e.target.getLatLng()).openOn(this.map);
              // Afficher les cercles
              circles.forEach(circle => circle.addTo(this.map));
            });
  
            marker.on('mouseout', () => {
              this.map.closePopup(popup);
              // Cacher les cercles
              circles.forEach(circle => this.map.removeLayer(circle));
            });
  
            marker.on('click', () => {
              this.selectCentrale(dispo);
            });
          });
        });
  
        if (this.selectedCentrale) {
          this.updateHistogram();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données :', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  private getColorFromDisponibilite(disponibilite: number): string {
    if (disponibilite >= 0.8) return '#2ecc71'; // Vert pour haute dispo
    if (disponibilite >= 0.5) return '#f1c40f'; // Jaune pour moyenne dispo
    if (disponibilite >= 0.2) return '#e67e22'; // Orange pour faible dispo
    return '#e74c3c'; // Rouge pour très faible dispo
  }
  private updateHistogram(): void {
    // Au lieu de chercher par tranche, chercher par nom de centrale
    if (this.selectedCentrale) {
      const centraleName = this.selectedCentrale.centrale;
      this.selectedCentrale = this.dataset.find((dispo) => dispo.centrale === centraleName) || null;
    }
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
    this.isCompactView = true;
    const { lat, lon } = centrale.point_gps_modifie_pour_afficher_la_carte_opendata;
  
    // Redirection avec tous les paramètres nécessaires
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { 
        centrale: centrale.centrale,
        date: this.selectedDate,
        hour: this.selectedHour.toString()
      },
      queryParamsHandling: 'merge'
    });
  
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.flyTo([lat, lon], 8, { animate: true });
    });
  }
  private refreshData(): void {
    const currentCentraleName = this.selectedCentrale?.centrale;
  
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { 
        ...(currentCentraleName && { centrale: currentCentraleName }),
        date: this.selectedDate,
        hour: this.selectedHour.toString()
      },
      queryParamsHandling: 'merge'
    });
  
    this.isLoading = true;
    this.loadCentralesOnMap();
  }
  closeHistogram(): void {
    this.selectedCentrale = null; // Supprime la centrale sélectionnée
    this.isCompactView = false; // Désactive la vue compacte
    this.map.flyTo([47.3, 1.8883], 6, { animate: true }); // Recentre sur la position par défaut
  }
}
