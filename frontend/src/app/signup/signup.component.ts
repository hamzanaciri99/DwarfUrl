import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {User} from "../model/User";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, public snackbar: MatSnackBar) { }

  ngOnInit(): void {

  }

  onSubmit(user: User) {
    this.userService.signup(user).subscribe(
      user => {
        this.router.navigate(['login']);
      },
      error => {
        this.snackbar.open('Error signing in', 'Dismiss');
      });
  }

}
