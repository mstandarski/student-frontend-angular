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
} from '../data.service';
import {
  DeleteConfirmComponent
} from '../delete-confirm/delete-confirm.component';
import {
  fadeInAnimation
} from '../animations/fade-in.animation';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css'],
  animations: [fadeInAnimation]
})
export class GradeComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  grades: any[];
  mode = 'Observable';

  constructor(private dataService: DataService, public dialog: MdDialog) {}

  ngOnInit() {
    this.getGrades();

    // -- turn the footer on, if off
    let div = document.getElementById('the-footer');
    if (div.style.display == 'none') {
      div.style.display = 'block';
    }
  }

  getGrades() {
    this.dataService.getRecords('grade')
      .subscribe(
        grades => this.grades = grades,
        error => this.errorMessage = < any > error);
  }

  deleteGrade(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('grade', id)
          .subscribe(
            grade => {
              this.successMessage = 'Record(s) deleted succesfully';
              this.getGrades();
            },
            error => this.errorMessage = < any > error);
      }
    });
  }

}
