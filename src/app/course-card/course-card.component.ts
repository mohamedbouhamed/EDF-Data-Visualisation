import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import{ CategoryType, ICourse } from './../app.component.models'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss'
})
export class CourseCardComponent {
  assets: any;
  categoryType = CategoryType;
  /* @Input() course={}; */ /* valeur par défaut */
  @Input({required: true}) course: ICourse = {} as ICourse;
  @Input({required: true}) index!: number;
  @Input({required: true}) title!:string;
  @Output() viewCourseEvent= new EventEmitter<ICourse>();
  constructor(private router: Router){
  }
  viewcourse(): void{
    this.viewCourseEvent.emit (this.course);
    /* this.router.navigateByUrl(`course-details/${this.course.id}`)  */
    this.router.navigate(['course'], {queryParams : {id : this.course.id}})

  };
}
/*   ngOnChanges(changes: SimpleChanges): void {
    console.log('change: ',changes, 'color : blue' )
  }
  ngOnInit(): void {
    console.log('ngOnInit', this.course.id, this.course.id);
  }
  ngDoCheck(): void {
    console.log('ngDoCheck',this.course.id)
  }
  ngAfterContentInit(): void {
    console.log('ngAfterContentInIt',)
  }
  ngAfterContentChecked(): void {
    
  }
  ngAfterViewInit(): void {
     
  } */

