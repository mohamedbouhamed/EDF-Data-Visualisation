import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  // Données des centrales avec coordonnées, puissance et autres informations
  private plants = [
    {
      name: "GRAVELINES 3",
      lat: 51.015, lng: 2.125, 
      power: 0, // Puissance en MW
      link: "https://doaat.edf.fr/indisponibilite/05470-edf-t-00058484",
      lastUpdated: "15 octobre 2024 10:00"
    },
    // Ajouter d'autres centrales ici si nécessaire
  ];

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.6034, 1.8883], // Centre de la France
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Ajouter des indicateurs colorés pour chaque centrale
    this.plants.forEach(plant => {
      const color = this.getColorByPower(plant.power);

      // Ajouter un CircleMarker pour chaque centrale
      L.circleMarker([plant.lat, plant.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        radius: 10 // Taille uniforme
      }).addTo(this.map)
        .bindPopup(`
          <b>${plant.name}</b><br>
          Puissance disponible : ${plant.power} MW<br>
          <a href="${plant.link}" target="_blank">Voir l'indisponibilité</a><br>
          Dernière actualisation : ${plant.lastUpdated}
        `);
    });
  }

  // Fonction pour déterminer la couleur en fonction de la puissance disponible
  private getColorByPower(power: number): string {
    if (power === 0) {
      return 'red'; // Rouge si la puissance vaut 0 MW
    } else if (power < 800) {
      return 'orange'; // Orange si la puissance est en dessous de 800 MW
    } else {
      return 'green'; // Vert si la puissance est au-dessus de 800 MW
    }
  }
}
