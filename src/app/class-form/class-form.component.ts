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
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class ClassFormComponent implements OnInit {

  classForm: NgForm;
  @ViewChild('classForm') currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  class: object = {};
  instructors: any[];

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('class', +params['id']))
      .subscribe(classes => this.class = classes);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  getInstructors() {
    this.dataService.getRecords('instructor')
      .subscribe(
        instructors => this.instructors = instructors,
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

    this.getInstructors();

  }

  saveClass(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('class', this.class, id)
        .subscribe(
          classes => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('class', this.class)
        .subscribe(
          classes => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }

    // this.class = {};

  }
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.classForm = this.currentForm;
    this.classForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data ? : any) {
    let form = this.classForm.form;

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
    'subject': '',
    'course': ''
  };

  validationMessages = {
    'subject': {
      'maxlength': 'Subject cannot be more than 30 characters in length'
    },
    'course': {
      'maxlength': 'Course cannot be more than 4 characters in length',
      'pattern': 'Assignment Number must be numeric.'
    }
  };
}
