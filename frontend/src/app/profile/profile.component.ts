import {Component, Input, OnInit} from '@angular/core';
import {User} from "../model/User";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';

  constructor(private userService: UserService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    let currentUser = this.userService.currentUser;
    this.firstName = currentUser?.firstName ?? '';
    this.lastName = currentUser?.lastName ?? '';
    this.username = currentUser?.username ?? '';
    this.email = currentUser?.email ?? '';
  }

  onSubmit(user: User) {
    this.userService.updateUser({...user, id: this.userService.currentUser?.id})
      .subscribe((user) => {
        this.userService.registerUser(user);
        location.reload();
      }, error => {
        this.snackbar.open('Error updating profile info!', 'Dismiss');
      });
  }

}
