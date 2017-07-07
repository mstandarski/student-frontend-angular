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
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class GradeFormComponent implements OnInit {

  gradeForm: NgForm;
  @ViewChild('gradeForm') currentForm: NgForm;
  successMessage: string;
  errorMessage: string;

  grade: object = {};

  formErrors = {
    'grade': ''
  };

  validationMessages = {
    'grade': {
      'maxlength': 'Grade value cannot be more than 30 characters long.'
    }
  };

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('grade', +params['id']))
      .subscribe(grade => this.grade = grade);
    // console.log('Grade Object for edit = ' + this.grade);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

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

  }

  saveGrade(id) {
    // console.log('saveGrade = ' + id);

    if (typeof id === 'number') {
      this.dataService.editRecord('grade', this.grade, id)
        .subscribe(
          grade => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      // console.log(this.grade);
      this.dataService.addRecord('grade', this.grade)
        .subscribe(
          grade => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }

    this.grade = {};

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.gradeForm = this.currentForm;
    this.gradeForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }
  onValueChanged(data ?: any) {
    const form = this.gradeForm.form;

    // console.log('onValueChanged');

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }


}
