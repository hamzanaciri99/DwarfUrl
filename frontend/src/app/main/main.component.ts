import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public userService: UserService, private snackbar: MatSnackBar) { }

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
    )
  }

}
