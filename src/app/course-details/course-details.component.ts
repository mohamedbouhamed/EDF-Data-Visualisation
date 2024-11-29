import { Component, Input } from '@angular/core';
import { CourseCardComponent } from '../course-card/course-card.component';
import { ICourse, courses } from '../app.component.models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CourseCardComponent,CommonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
  courses: ICourse[] = courses;
  @Input({required: true}) course: ICourse = {} as ICourse;
  currentCourseId!: number;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  courseId!: number;
  ngOnInit(): void {
    // Get the course ID from the URL
    this.activatedRoute.queryParams.subscribe(params => {
      this.courseId = Number(params['id']);
      this.course = this.getCourse(this.courseId);
      if (!this.course) {
        // If the course is not found, redirect to home page and pass a message
        this.router.navigate(['/home'], { queryParams: { error: 'cours_introuvable' } });
      } else {
        this.currentCourseId = this.courseId;
      }
    });
/*     this.activatedRoute.paramMap.subscribe((res: ParamMap) =>{
      const courseId = Number(res.get('id'));
      this.currentCourseId = courseId
      this.course = this.getCourse(courseId);
    }); */
  } 
  getNext(): void{
    if (this.currentCourseId<this.courses.length ){
      /* this.router.navigate([`course`, this.currentCourseId+1]) */
      this.router.navigate(['course'], {queryParams : {id : this.currentCourseId+1}})
    }
    
  }
  getPrecedent(): void{
    if (this.currentCourseId>1 ){
    /* this.router.navigate([`course`,  this.currentCourseId-1 ]) */
    this.router.navigate(['course'], {queryParams : {id : this.currentCourseId-1}})
    }
  } 
  private getCourse(courseId: number): ICourse {
    return courses.find(c => c.id === courseId)!;
  }
}
