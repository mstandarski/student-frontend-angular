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
  selector: 'app-instructor-form',
  templateUrl: './instructor-form.component.html',
  styleUrls: ['./instructor-form.component.css'],
  animations: [slideInAnimation],
  host: {
    '[@slideInAnimation]': ''
  }
})
export class InstructorFormComponent implements OnInit {
  instructorForm: NgForm;
  @ViewChild('instructorForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  instructor: object = {};

  majors: any[]; // -- needed to lookup the majors

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('instructor', +params['id']))
      .subscribe(instructor => this.instructor = instructor);
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

  saveInstructor(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('instructor', this.instructor, id)
        .subscribe(
          instructor => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('instructor', this.instructor)
        .subscribe(
          instructor => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }
    // this.student = {};
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.instructorForm = this.currentForm;
    this.instructorForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );

  }
  onValueChanged(data ? : any) {
    let form = this.instructorForm.form;

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
    'years_of_experience': '',
    'start_date': '',
    'tenured': ''
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
    'years_of_experience': {
      'pattern': 'Value must be numeric and not exceed 80 years experience.',
      'maxlength': 'Experience cannot be more than 2 characters long.'
    },
    'tenured': {
      'pattern': 'Choose either a 1 for yes or a 0 for no.'
    }
  };

  // this.instructor = {};

}
