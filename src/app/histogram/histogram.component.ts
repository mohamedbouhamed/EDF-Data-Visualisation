import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DatasetService } from '../srvices/dataset.service';
import { DataSets, Dispo } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule, FormsModule,TranslateModule],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss',
})
export class HistogramComponent implements OnInit {
  @Input() tranche!: string;
  
  isChartLoading: boolean = false;
  selectedCentrale: string = '';
  dateLimit: string = '';
  centralesData: Dispo[] = []; // Liste de toutes les centrales
  // Nouvelle propriété pour stocker les données
  selectedCentraleData: {
    centrale: string;
    tranches: Dispo[];
  } | null = null;

  // Getter pour toutes les centrales disponibles
  get centrales(): string[] {
    return [...new Set(this.centralesData.map(d => d.centrale))];
  }

  // Getter pour les tranches de la centrale sélectionnée
  getTranches(): string[] {
    if (!this.selectedCentraleData?.tranches) return [];
    return this.selectedCentraleData.tranches.map(d => d.tranche);
  }

  constructor(
    private route: ActivatedRoute, 
    private datasetService: DatasetService,
    private router: Router,
    private translate: TranslateService
  ) {
        // S'abonner aux changements de langue
        this.translate.onLangChange.subscribe(() => {
          if (this.datasets.results?.length > 0) {
            this.afficherDonnees(this.datasets);
          }
        });
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  datasets: DataSets = {} as DataSets;


  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    const state = history.state;
    
    this.selectedCentrale = queryParams['centrale'] || '';
    this.tranche = queryParams['tranche'] || '';
    this.dateLimit = queryParams['date'] || new Date().toISOString().split('T')[0];

    // Si on a les données dans le state, on les utilise
    if (state.centralesData) {
      this.centralesData = state.centralesData;
    } else {
      // Sinon on va les chercher
      this.chargerCentrales();
    }

    // Si on a une centrale sélectionnée, on charge ses tranches
    if (this.selectedCentrale) {
      this.chargerTranchesPourCentrale(this.selectedCentrale);
    }
    if (this.tranche) {
      this.chargerDonneesTranche(this.tranche);
    }
  }
  chargerDonneesTranche(tranche: string): void {
    this.isChartLoading = true;

    // Construction de la condition where avec plage de dates
    let whereCondition = '';
    if (this.dateLimit) {
      const dateLimite = new Date(this.dateLimit);
      dateLimite.setHours(23, 59, 59);

      // Calculer la date 50 jours avant
      const dateDebut = new Date(dateLimite);
      dateDebut.setDate(dateDebut.getDate() - 50);
      dateDebut.setHours(0, 0, 0);

      // Calculer la date 50 jours après
      const dateFin = new Date(dateLimite);
      dateFin.setDate(dateFin.getDate() + 50);
      dateFin.setHours(23, 59, 59);

      whereCondition = `date_et_heure_fuseau_horaire_europe_paris>"${dateDebut.toISOString()}" AND date_et_heure_fuseau_horaire_europe_paris<"${dateFin.toISOString()}"`;
    }

    this.datasetService.getDatasetAllRecords(
      { 
        tranche: [tranche], 
        heure_fuseau_horaire_europe_paris: ["12"]
      },
      ['date_et_heure_fuseau_horaire_europe_paris', 'puissance_disponible', 'heure_fuseau_horaire_europe_paris'],
      whereCondition,
      'date_et_heure_fuseau_horaire_europe_paris'
    ).subscribe({
      next: (data) => {
        this.datasets = data;
        this.afficherDonnees(this.datasets);
        this.isChartLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
        this.isChartLoading = false;
      }
    });
}
  private chargerTranchesPourCentrale(centrale: string): void {
    const hour = '12'; // On peut utiliser une heure fixe pour la recherche des tranches
    const refinements = {
      date_et_heure_fuseau_horaire_europe_paris: [this.dateLimit || new Date().toISOString().split('T')[0]],
      heure_fuseau_horaire_europe_paris: [hour],
    };
    this.datasetService.getDatasetAllRecords(
      refinements,
      ['centrale', 'tranche', 'puissance_disponible'],
      `centrale = '${centrale}'`,
      "tranche ASC"
    ).subscribe({
      next: (data) => {
        this.selectedCentraleData = {
          centrale: centrale,
          tranches: data.results
        };
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tranches:', error);
        this.selectedCentraleData = null;
      }
    });
  }
    // Le reste du code reste identique
  private chargerCentrales(): void {
    const hour = '12';
    const refinements = {
      date_et_heure_fuseau_horaire_europe_paris: [this.dateLimit],
      heure_fuseau_horaire_europe_paris: [hour],
    };

    this.datasetService.getDatasetAllRecords(
      refinements,
      ['centrale', 'tranche'],
      "tranche like '%1'", // Pour avoir une centrale par site
      "centrale ASC"
    ).subscribe({
      next: (data) => {
        this.centralesData = data.results;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des centrales:', error);
      }
    });
  }
  onCentraleChange(): void {
    this.tranche = '';
    if (this.selectedCentrale) {
      // Charger les tranches de la centrale sélectionnée
      this.chargerTranchesPourCentrale(this.selectedCentrale);
    }
    this.updateUrlParams();
  }


  onTrancheChange(): void {
    if (this.tranche) {
      this.chargerDonneesTranche(this.tranche);
      this.updateUrlParams();
    }
  }

  onDateChange(): void {
    if (this.tranche) {
      this.chargerDonneesTranche(this.tranche);
      this.updateUrlParams();
    }
  }

  private updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        centrale: this.selectedCentrale,
        tranche: this.tranche,
        date: this.dateLimit
      },
      queryParamsHandling: 'merge'
    });
  }

  afficherDonnees(data: DataSets): void {
    const dataStructure: [number, number][] = this.datasets.results.map((item) => {
      const baseDate = new Date(item.date_et_heure_fuseau_horaire_europe_paris);
      baseDate.setUTCHours(item.heure_fuseau_horaire_europe_paris);
      return [
        baseDate.getTime(),
        item.puissance_disponible,
      ];
    });
  
    // Fetch translations synchronously
    const chartTitle = this.translate.instant('HISTOGRAM.CHART_TITLE');
    const chartSubtitle = document.ontouchstart === undefined
      ? this.translate.instant('HISTOGRAM.CHART_SUBTITLE')
      : this.translate.instant('HISTOGRAM.CHART_SUBTITLE_TOUCH');
    const yAxisTitle = this.translate.instant('HISTOGRAM.Y_AXIS_TITLE');
  
    // Define chart options with translations
    this.chartOptions = {
      chart: {
        zooming: {
          type: 'x',
        },
        backgroundColor: '#FFFFFF',
      },
      title: {
        text: chartTitle,
        style: {
          color: '#003366',
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text: chartSubtitle,
        style: {
          color: '#003366',
        },
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            color: '#003366',
          },
        },
      },
      yAxis: {
        title: {
          text: yAxisTitle,
          style: {
            color: '#003366',
          },
        },
        labels: {
          style: {
            color: '#003366',
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
            fillColor: '#003366',
            lineWidth: 2,
            lineColor: '#003366',
          },
          lineWidth: 2,
          color: '#FF7300',
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(255, 115, 0, 0.5)'],
              [1, 'rgba(255, 115, 0, 0.1)'],
            ],
          },
          threshold: null,
        },
      },
      series: [
        {
          type: 'area',
          name: yAxisTitle,
          data: dataStructure,
          lineColor: '#FF7300',
        },
      ],
    };
  
    // Initialize the chart
    Highcharts.chart('container', this.chartOptions);
  }
  
  
}