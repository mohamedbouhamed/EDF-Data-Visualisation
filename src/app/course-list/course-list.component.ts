import { Component } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { DataSetResult, DataSets, ICourse, courses } from '../app.component.models';
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
  datasets: DataSetResult[] = [];
  dataset1 : any[] = [];
  title='hello';
  onCourseClicked(course:ICourse): void{
    console.log('courseclicked ',course.description);
  }
    //mathod 1 to call data from service
    constructor(private catalogService: CatalogService, private datasetService: DatasetService){};
    ngOnInit(): void {
      this.catalogService.getDatasets().subscribe((data: DataSets) => {
        this.datasets = data.results; // Récupérer les résultats depuis l'objet DataSets
        console.log('datasets ', this.datasets);
      });
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // Heure avec deux chiffres
      this.datasetService.getDatasetAllRecords("disponibilite-du-parc-nucleaire-d-edf-sa-present-passe-et-previsionnel").subscribe((data: any) => {
        this.dataset1 = data; // Récupérer les résultats depuis l'objet DataSets
        console.log('datasets ', this.dataset1);
      });
    }  
    /* ngOnInit(): void {
      this.catalogService.getDatasets().subscribe(datasets => {
        this.datasets = Object.values(datasets);
        console.log('datasets ',this.datasets)
      });
    }   */
}
