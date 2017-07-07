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
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  animations: [fadeInAnimation]
})
export class StudentComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  students: any[];
  majors: any[]; // -- needed to lookup the major
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getStudents();
    this.getMajors();
    // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getStudents() {
    this.dataService.getRecords('student')
      .subscribe(
        students => this.students = students,
        error => this.errorMessage = < any > error);
  }

  getMajors() {
    this.dataService.getRecords('major')
      .subscribe(
        majors => this.majors = majors,
        error => this.errorMessage = < any > error);
  }

  deleteStudent(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('student', id)
          .subscribe(
            student => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getStudents();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
