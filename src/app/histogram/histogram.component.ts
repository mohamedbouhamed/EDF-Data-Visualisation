import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets } from '../app.component.models';
@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss',
})
export class HistogramComponent implements OnInit {
  datasets:DataSets = {} as DataSets;
  @Input() tranche!: string; 
  chargerDonneesTranche(tranche: string): void {
    this.datasetService.getDatasetAllRecords(
      { tranche: [tranche], heure_fuseau_horaire_europe_paris: ["12"] },
      ['date_et_heure_fuseau_horaire_europe_paris', 'puissance_disponible','heure_fuseau_horaire_europe_paris'],'','date_et_heure_fuseau_horaire_europe_paris'
    ).subscribe({
      next: (data) => {
        this.datasets = data
        this.afficherDonnees(this.datasets);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    });
  }
/*   private chargerDonneesTranche(tranche: string): Promise<any> {
    return firstValueFrom(
      this.datasetService.getDatasetAllRecords(
        { tranche: [tranche] },
        ['date_et_heure_fuseau_horaire_europe_paris', 'tranche']
      )
    );
  } */
  afficherDonnees(data: DataSets): void{
    const dataStructure: [number, number][] = this.datasets.results.map((item) => {
      const baseDate = new Date(item.date_et_heure_fuseau_horaire_europe_paris);
      
      // Ajuster l'heure à partir de `heure_fuseau_horaire_europe_paris`
      baseDate.setUTCHours(item.heure_fuseau_horaire_europe_paris);
  
      return [
        baseDate.getTime(), // Timestamp ajusté
        item.puissance_disponible, // Puissance disponible
      ];
    });
    console.log(dataStructure)
  // Configuration du graphique
    this.chartOptions = {
      chart: {
        zooming: {
          type: 'x',
        },
        backgroundColor: '#FFFFFF', // Fond blanc pour respecter une charte visuelle épurée
      },
      title: {
        text: 'Histogramme EDF',
        style: {
          color: '#003366', // Bleu foncé pour le titre
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text:
          document.ontouchstart === undefined
            ? 'Cliquez et glissez pour zoomer'
            : 'Pincez pour zoomer',
        style: {
          color: '#003366', // Bleu foncé
        },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            color: '#003366', // Bleu foncé pour les labels de l'axe X
          },
        },
      },
      yAxis: {
        title: {
          text: 'Puissance Disponible',
          style: {
            color: '#003366', // Bleu foncé pour le titre de l'axe Y
          },
        },
        labels: {
          style: {
            color: '#003366', // Bleu foncé pour les valeurs de l'axe Y
          },
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          marker: {
            radius: 4,
            fillColor: '#003366', // Bleu foncé pour les marqueurs
            lineWidth: 2,
            lineColor: '#003366', // Contour des marqueurs
          },
          lineWidth: 2,
          color: '#FF7300', // Orange vif pour la ligne
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(255, 115, 0, 0.5)'], // Orange vif en haut
              [1, 'rgba(255, 115, 0, 0.1)'], // Orange clair en bas
            ],
          },
          threshold: null,
        },
      },
      series: [
        {
          type: 'area',
          name: 'Puissance Disponible',
          data: dataStructure, // Données existantes
          lineColor: '#003366', // Ligne bleu foncé
        },
      ],
    };
  
    Highcharts.chart('container', this.chartOptions); // Mettez à jour le graphique
    console.log(data)
  }
  constructor(private route:ActivatedRoute, private datasetService: DatasetService){}
  Highcharts: typeof Highcharts = Highcharts; // Référence à Highcharts
  chartOptions: Highcharts.Options = {}; // Configuration du graphique
  ngOnInit(): void {
    // Récupérer le paramètre 'tranche' depuis la route si non passé en @Input()
    if (!this.tranche) {
      this.tranche = this.route.snapshot.queryParamMap.get('tranche') || '';
    }
    this.chargerDonneesTranche(this.tranche);
    

    // Charger les données à partir de l'API
 }
}