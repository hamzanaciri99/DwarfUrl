import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router, public snackbar: MatSnackBar) { }

  ngOnInit(): void {

  }

  onSignup() {
    this.userService.signup({
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(
      user => {
        this.router.navigate(['login']);
      },
      error => {
        this.snackbar.open('Error signing in', 'Dismiss');
      });
  }

}
