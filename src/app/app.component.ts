import { Component, Input } from '@angular/core';

import { StudentComponent } from './student/student.component'
import { AssignmentComponent } from './assignment/assignment.component'
import { ClassComponent } from './class/class.component'
import { GradeComponent } from './grade/grade.component'
import { InstructorComponent } from './instructor/instructor.component'
import { MajorComponent } from './major/major.component'
import { MajorClassComponent } from './major-class/major-class.component'
import { StudentClassComponent } from './student-class/student-class.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input() erroMessage: string;
}
