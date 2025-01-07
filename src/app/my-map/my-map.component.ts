import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { centrale, centraleDecale, plants } from '../app.component.models';
@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss'],
  standalone: true
})
export class MyMapComponent implements OnInit {

  private map!: L.Map;

  // Données des centrales avec coordonnées, puissance et autres informations
  plants = plants;
  centrales = centrale;
  centralesdecalees = centraleDecale;
  constructor() { }

  ngOnInit(): void {
    this.initMap();
    this.setupFullscreenButton(); // Configurer le bouton plein écran
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [46.6034, 1.8883], // Centre de la France
      zoom: 4, // Zoom initial
      minZoom: 3, // Limite de zoom minimum
      maxZoom: 15, // Limite de zoom maximum
      worldCopyJump: true // Permet le rebouclage horizontal
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.centrales.forEach(plant => {
      const color = this.getColorByPower(plant.puissance_disponible);

      // Ajouter un CircleMarker pour chaque centrale
      L.circleMarker([plant.coordonnees.lat, plant.coordonnees.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        radius: 10 // Taille uniforme
      }).addTo(this.map)
        .bindPopup(`
          <b>${plant.nom}</b><br>
          Tranche : ${plant.tranche} <br>
          Puissance installée : ${plant.puissance_installee} MW<br>
          Puissance disponible : ${plant.puissance_disponible}
          `);
    });
    /*     this.centralesdecalees.forEach(plant => {
          const color = this.getColorByPower(plant.puissance_disponible);
        
          // Ajouter un CircleMarker pour chaque centrale
          L.circleMarker([plant.point_gps_modifie_pour_afficher_la_carte_opendata.lat, plant.point_gps_modifie_pour_afficher_la_carte_opendata.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: 10 // Taille uniforme
          }).addTo(this.map)
            .bindPopup(`
              <b>${plant.centrale}</b><br>
              Tranche : ${plant.tranche} <br>
              Puissance disponible : ${plant.puissance_disponible}
              `);
        }); */
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

  // Méthode pour configurer le bouton plein écran
  private setupFullscreenButton(): void {
    const fullscreenButton = document.getElementById('fullscreen-button');

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du lien

        const mapElement = document.getElementById('map');

        // Vérifier si le mode plein écran est déjà activé
        if (!document.fullscreenElement) {
          mapElement?.requestFullscreen().catch(err => {
            console.error(`Erreur lors de la demande de plein écran: ${err.message} (${err.name})`);
          });
        } else {
          // Sortir du mode plein écran
          document.exitFullscreen();
        }
      });
    }
  }
}
