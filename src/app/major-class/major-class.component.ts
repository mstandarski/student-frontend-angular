import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  MdDialog,
  MdDialogRef
} from '@angular/material';

import {
  DataService
} from '../data.service'
import {
  DeleteConfirmComponent
} from '../delete-confirm/delete-confirm.component'

import {
  fadeInAnimation
} from '../animations/fade-in.animation';

@Component({
  selector: 'app-major-class',
  templateUrl: './major-class.component.html',
  styleUrls: ['./major-class.component.css'],
  animations: [fadeInAnimation],
  host: {
    '[@fadeInAnimation': ''
  }
})
export class MajorClassComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  majors_classes: any[];
  majors: any[]; // -- needed to lookup the major
  classes: any[]; // -- needed to lookup the class
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getMajorsClasses();
    this.getMajors();
    this.getClasses();
    // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getMajorsClasses() {
    this.dataService.getRecords('major_class')
      .subscribe(
        majors_classes => this.majors_classes = majors_classes,
        error => this.errorMessage = < any > error);
  }

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

  deleteMajorClass(id: number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('major_class', id)
          .subscribe(
            major_class => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getMajorsClasses();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
