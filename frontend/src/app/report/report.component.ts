import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  message: string = '';

  constructor(private dialogRef: MatDialogRef<ReportComponent>) { }

  ngOnInit(): void {

  }

  onSubmit() {
    //TODO implement backend endpoint and send email before closing
    this.dialogRef.close();
  }
}
