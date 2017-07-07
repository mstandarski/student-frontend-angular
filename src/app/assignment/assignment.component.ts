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
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  animations: [fadeInAnimation],
  host: {
    '[@fadeInAnimation': ''
  }
})
export class AssignmentComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  assignments: any[];
  students: any[];
  grades: any[];
  classes: any[];
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getAssignments();
    this.getStudents();
    this.getGrades();
    this.getClasses();

    // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getAssignments() {
    this.dataService.getRecords('assignment')
      .subscribe(
        assignments => this.assignments = assignments,
        error => this.errorMessage = < any > error);
  }

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

  deleteAssignment(id: number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('assignment', id)
          .subscribe(
            assignment => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getAssignments();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
