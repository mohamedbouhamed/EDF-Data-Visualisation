import { Component } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { DataSetResult, DataSets, ICourse, courses } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../srvices/catalog.service';

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
  title='hello';
  onCourseClicked(course:ICourse): void{
    console.log('courseclicked ',course.description);
  }
    //mathod 1 to call data from service
    constructor(private catalogService: CatalogService){};
    ngOnInit(): void {
      this.catalogService.getDatasets().subscribe((data: DataSets) => {
        this.datasets = data.results; // Récupérer les résultats depuis l'objet DataSets
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
