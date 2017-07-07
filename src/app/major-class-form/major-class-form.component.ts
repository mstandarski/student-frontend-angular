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
  selector: 'app-major-class-form',
  templateUrl: './major-class-form.component.html',
  styleUrls: ['./major-class-form.component.css'],
  animations: [slideInAnimation],
  host: { '[@slideInAnimation]': '' }
})
export class MajorClassFormComponent implements OnInit {

majorClassForm: NgForm;
@ViewChild('majorClassForm') currentForm: NgForm;
  successMessage: string;
  errorMessage: string;

  major_class: object = {};

  majors: any[]; // -- needed to lookup the majors
  classes: any[]; // -- needed to lookup the classes

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('major_class', +params['id']))
      .subscribe(major_class => this.major_class = major_class);
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

    this.getMajors(); // -- getting majors for the select drop down
    this.getClasses(); // -- getting clases for the select drop down
  }

  saveMajorClass(id) {
    if (typeof id === 'number') {
      this.dataService.editRecord('major_class', this.major_class, id)
        .subscribe(
          major_class => this.successMessage = 'Record updated succesfully',
          error => this.errorMessage = < any > error);
    } else {
      this.dataService.addRecord('major_class', this.major_class)
        .subscribe(
          major_class => this.successMessage = 'Record added succesfully',
          error => this.errorMessage = < any > error);
    }
  }

}
