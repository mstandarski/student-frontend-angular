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
} from '../data.service'
import {
  slideInAnimation,
} from '../animations/slide-in.animation';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class StudentFormComponent implements OnInit {

  studentForm: NgForm;
  @ViewChild('studentForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  student: object = {};

  majors: any[]; // -- needed to lookup the majors

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('student', +params['id']))
      .subscribe(student => this.student = student);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  getMajors() {
    this.dataService.getRecords('major')
      .subscribe(
        majors => this.majors = majors,
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

    this.getMajors(); // -- getting majors for the select drop down
  }

  saveStudent(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('student', this.student, id)
        .subscribe(
          student => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('student', this.student)
        .subscribe(
          student => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }
    // this.student = {};
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.studentForm = this.currentForm;
    this.studentForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data ? : any) {
    let form = this.studentForm.form;

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
    'first_name': '',
    'last_name': '',
    'sat': '',
    'start_date': '',
    'gpa': ''
  };

  validationMessages = {
    'first_name': {
      'required': 'First name is required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 30 characters long.'
    },
    'last_name': {
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name cannot be more than 30 characters long.'
    },
    'sat': {
      'pattern': 'Sat score must be between 400 and 1600',
      'maxlength': 'Sat cannot be more than 4 characters long.'
    },
    'start_date': {
      'pattern': 'Start date should be in the following format: YYYY-MM-DD'
    },
    'gpa': {
      'pattern': 'GPA must be a decimal'
    }
  };
}
