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
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  animations: [fadeInAnimation],
  host: {
    '[@fadeInAnimation': ''
  }
})
export class ClassComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  classes: any[];
  instructors: any[];
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getClasses();
    this.getInstructors();
    // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getClasses() {
    this.dataService.getRecords('class')
      .subscribe(
        classes => this.classes = classes,
        error => this.errorMessage = < any > error);
  }
  getInstructors() {
    this.dataService.getRecords('instructor')
      .subscribe(
        instructors => this.instructors = instructors,
        error => this.errorMessage = < any > error);
  }

  deleteClass(id: number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('class', id)
          .subscribe(
            classes => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getClasses();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
