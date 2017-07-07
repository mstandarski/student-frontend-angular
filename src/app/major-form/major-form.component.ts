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
  selector: 'app-major-form',
  templateUrl: './major-form.component.html',
  styleUrls: ['./major-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class MajorFormComponent implements OnInit {

  majorForm: NgForm;
  @ViewChild('majorForm') currentForm: NgForm;
  successMessage: string;
  errorMessage: string;

  major: object = {};

  formErrors = {
    'major': '',
    'sat': ''
  };

  validationMessages = {
    'major': {
      'minlength': 'Major must be at least 2 characters long.',
      'maxlength': 'Major cannot be more than 30 characters long.'
    },
    'sat': {
      'pattern': 'Sat score must be between 400 and 1600',
      'maxlength': 'Sat cannot be more than 4 characters long.'
    }
  };

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('major', +params['id']))
      .subscribe(major => {this.major = major;
    });
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

      // console.log('Object for edit onInit= ' + JSON.stringify(this.major));
  }

  saveMajor(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('major', this.major, id)
        .subscribe(
          major => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('major', this.major)
        .subscribe(
          major => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.majorForm = this.currentForm;
    this.majorForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }
  onValueChanged(data ?: any) {
    const form = this.majorForm.form;

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
