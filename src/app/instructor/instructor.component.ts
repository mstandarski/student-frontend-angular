import { Component, OnInit,Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'

import {fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css'],
  animations: [fadeInAnimation],
})


export class InstructorComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  instructors: any[];
  majors: any[]; // -- needed to lookup the major
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getInstructors();
    this.getMajors();
     // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getInstructors() {
    this.dataService.getRecords('instructor')
      .subscribe(
        instructors => this.instructors = instructors,
        error => this.errorMessage = < any > error);
  }

  getMajors() {
    this.dataService.getRecords('major')
      .subscribe(
        majors => this.majors = majors,
        error => this.errorMessage = < any > error);
  }
  deleteInstructor(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('instructor', id)
          .subscribe(
            instructor => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getInstructors();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
