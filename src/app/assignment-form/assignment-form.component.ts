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
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class AssignmentFormComponent implements OnInit {

  assignmentForm: NgForm;
  @ViewChild('assignmentForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  assignment: object = {};

  students: any[]; // --need to look up the students
  grades: any[]; // --need to look up the grades
  classes: any[]; // --need to look up the classes

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('assignment', +params['id']))
      .subscribe(assignment => this.assignment = assignment);
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

  getGrades() {
    this.dataService.getRecords('grade')
      .subscribe(
        grades => this.grades = grades,
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

    this.getStudents(); // --getting students for the select drop down
    this.getGrades(); // -getting grades for the select drop down
    this.getClasses(); // --getting classes for the select drop down

  }

  saveAssignment(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('assignment', this.assignment, id)
        .subscribe(
          assignment => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('assignment', this.assignment)
        .subscribe(
          assignment => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }

    // this.assignment = {};

  }
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.assignmentForm = this.currentForm;
    this.assignmentForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data ? : any) {
    let form = this.assignmentForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'assignment_nbr': ''
  };

  validationMessages = {
    'assignment_nbr': {
      'pattern': 'Assignment Number must be numeric.'
    }
  };
}
