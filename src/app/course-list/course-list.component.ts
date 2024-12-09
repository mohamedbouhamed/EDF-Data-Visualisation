import { Component } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { DataSetResult, DataSets, Dispo, ICourse, courses } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { CatalogService} from '../srvices/catalog.service';
import { DatasetService } from '../srvices/dataset.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CourseCardComponent,CommonModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {
  courses: ICourse[] = courses;
  /* datasets: Array<any> = []; */
  datasets: DataSets[] = [];
  dataset : Dispo[] = [];
  title='hello';
  getRefinementsForNow(): Record<string, string[]> {
    const now = new Date();

    const date = now.toISOString().slice(0, 10).replace(/-/g, '/'); // Format "YYYY/MM/DD"
    const hour = now.getHours().toString().padStart(2, '0'); // Format "HH"

    return {
      date_et_heure_fuseau_horaire_europe_paris: [date],
      heure_fuseau_horaire_europe_paris: [hour]
    };
  };
  onCourseClicked(course:ICourse): void{
    console.log('courseclicked ',course.description);
  }
    //mathod 1 to call data from service
    constructor(private catalogService: CatalogService, private datasetService: DatasetService){};
    ngOnInit(): void {
 /*      this.catalogService.getDatasets().subscribe((data: DataSets) => {
        this.datasets = data.results; // Récupérer les résultats depuis l'objet DataSets
        console.log('datasets ', this.datasets);
      }); */
      const now = new Date();
     // Heure avec deux chiffres
      this.datasetService.getDatasetAllRecords("disponibilite-du-parc-nucleaire-d-edf-sa-present-passe-et-previsionnel",
        this.getRefinementsForNow()).subscribe((data: DataSets) => {
        this.datasets = [data]; // Récupérer les résultats depuis l'objet DataSets
        this.dataset = data.results;
        console.log('datasets ', this.datasets);
      });
    }  
    /* ngOnInit(): void {
      this.catalogService.getDatasets().subscribe(datasets => {
        this.datasets = Object.values(datasets);
        console.log('datasets ',this.datasets)
      });
    }   */
}
