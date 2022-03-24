import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private userService: UserService,
              private router: Router,
              public snackbar: MatSnackBar) { }

  ngOnInit(): void {

  }

  onLogin() {
    this.userService.login({
      username: this.username,
      password: this.password
    }).subscribe(
      user => {
        this.userService.registerUser(user);
        this.router.navigate(['home']);
      },
      error => {
        this.snackbar.open('Error logging in', 'Dismiss');
      }
    )
  }
}
