import { Component, HostListener } from '@angular/core';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';
import { CourseCardComponent } from './course-card/course-card.component';
import { ICourse, courses } from './app.component.models';
import { CommonModule, NgForOf } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MyMapComponent } from './my-map/my-map.component';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
import topology from '@highcharts/map-collection/custom/europe.topo.json';
import { HistogramComponent } from './histogram/histogram.component';
HC_map(Highcharts);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CourseCardComponent,MapComponent,NgForOf,CommonModule,RouterLink,RouterLinkActive,MyMapComponent,HighchartsChartModule,HistogramComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  topology: typeof topology=topology;
  title = 'firstapp';
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Ferme le dropdown quand on clique ailleurs sur la page
  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  amount = 50.05666;
  total = 1;
  price=860;
  data = {
    title:'Angular Core Course!',
    lessonName:'21- Angular Built-in Pipes'
  };
  date = new Date();
  onLogoClicked() {
    alert("Hello World")
    
  }
  onKeyUp (titre:string): void{
    this.data.title = titre;
  }
  courses: ICourse[] = courses;
  beginnerCourse = courses[0];
  bCourse = courses[1];
  aCourse = courses[2];
  onCourseClicked(course:ICourse): void{
    console.log('course clicked ',course.description);
  }
}
