import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ReportComponent} from "../report/report.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public userService: UserService,
              private snackbar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  onLogout() {
    this.userService.logout().subscribe(
      value => {
        if(value == false) {
          this.userService.clearUser();
        } else {
          this.snackbar.open('Error logging out', 'Dismiss');
        }
      }
    );
    this.router.navigate(['home']);
  }

  openReportDialog() {
    let dialogRef = this.dialog.open(ReportComponent, {
      width: '400px'
    });
  }

}
