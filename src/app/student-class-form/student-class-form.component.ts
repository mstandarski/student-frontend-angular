import 'rxjs/add/operator/switchMap';
import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import {
  Location
} from '@angular/common';
import {
  NgForm
} from '@angular/forms';
import {
  DataService
} from '../data.service';
import {
  slideInAnimation,
} from '../animations/slide-in.animation';

@Component({
  selector: 'app-student-class-form',
  templateUrl: './student-class-form.component.html',
  styleUrls: ['./student-class-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class StudentClassFormComponent implements OnInit {

studentClassForm: NgForm;
@ViewChild('studentClassForm') currentForm: NgForm;
  successMessage: string;
  errorMessage: string;

  student_class: object = {};

  students: any[]; // -- needed to lookup the students
  classes: any[]; // -- needed to lookup the classes

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('student_class', +params['id']))
      .subscribe(student_class => this.student_class = student_class);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  getStudents() {
    this.dataService.getRecords('student')
      .subscribe(
        students => this.students = students,
        error => this.errorMessage = < any > error);
  }

  getClasses() {
    this.dataService.getRecords('class')
      .subscribe(
        classes => this.classes = classes,
        error => this.errorMessage = < any > error);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit(): null;
      });

    // -- turn the footer off
    let div = document.getElementById('the-footer');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }

    this.getStudents(); // getting students for the select drop down
    this.getClasses(); // getting classes for the select drop down
  }

  saveStudentClass(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('student_class', this.student_class, id)
        .subscribe(
          student_class => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('student_class', this.student_class)
        .subscribe(
          student_class => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }

    this.student_class = {};

  }

}
