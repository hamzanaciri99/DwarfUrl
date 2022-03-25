import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";

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

  firstNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  lastNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20)
  ]);

  usernameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("[a-zA-Z0-9_]*"),
    Validators.minLength(3),
    Validators.maxLength(15)
  ]);

  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(30)
  ]);

  passwordControl: FormControl = new FormControl('', [
    Validators.required,
    // Regex for:
    //  - At least 8 characters in length
    //  - Lowercase letters
    //  - Uppercase letters
    //  - Numbers
    //  - Special characters
    Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}"),
    Validators.maxLength(15)
  ]);

  hidePassword: boolean = true;
  @ViewChild('upperCaseCheck') upperCaseCheckRef! : MatIcon;
  @ViewChild('lowerCaseCheck') lowerCaseCheckRef! : MatIcon;
  @ViewChild('numberCheck') numberCheckRef! : MatIcon;
  @ViewChild('specialCharCheck') specialCharCheckRef! : MatIcon;
  @ViewChild('lengthCheck') lengthCheckRefRef! : MatIcon;

  constructor(private userService: UserService, private router: Router, public snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.passwordControl.valueChanges.subscribe(value => this.validatePassword(value))
  }

  onSignup() {

    if(this.firstNameControl.invalid || this.lastNameControl.invalid || this.usernameControl.invalid ||
        this.emailControl.invalid || this.passwordControl.invalid ) {
      this.snackbar.open('Please make sure all fields are filled in correctly', 'Dismiss');
      return;
    }

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

  getControlErrorMessage(control: 'firstname' | 'lastname' | 'email' | 'username') {
    switch (control) {
      case 'email':
        if(this.emailControl.hasError('required')) return 'Email is required';
        if(this.emailControl.hasError('maxlength')) return 'Email max length is 30';
        if(this.emailControl.hasError('email')) return 'Enter a valid email';
        break;
      case 'firstname':
        if(this.firstNameControl.hasError('required')) return 'First name is required';
        if(this.firstNameControl.hasError('maxlength')) return 'First name max length is 20';
        if(this.firstNameControl.hasError('minlength')) return 'First name min length is 3';
        break;
      case 'lastname':
        if(this.lastNameControl.hasError('required')) return 'Last name is required';
        if(this.lastNameControl.hasError('maxlength')) return 'Last name max length is 20';
        if(this.lastNameControl.hasError('minlength')) return 'Last name min length is 3';
        break;
      case 'username':
        if(this.usernameControl.hasError('required')) return 'Username is required';
        if(this.usernameControl.hasError('maxlength')) return 'Username max length is 20';
        if(this.usernameControl.hasError('minlength')) return 'Username min length is 3';
        if(this.usernameControl.hasError('pattern'))
          return 'Username can contain only contains characters [a-zA-Z0-9] and underscore _ ';
        break;
    }
    return '';
  }

  validatePassword(value: string) {
    if(/(?=.{8,})/g.test(value))
      this.lengthCheckRefRef.color = 'primary';
    else this.lengthCheckRefRef.color = 'warn';

    if(/(?=.*[a-z])/g.test(value))
      this.lowerCaseCheckRef.color = 'primary';
    else this.lowerCaseCheckRef.color = 'warn';

    if(/(?=.*[A-Z])/g.test(value))
      this.upperCaseCheckRef.color = 'primary';
    else this.upperCaseCheckRef.color = 'warn';

    if(/(?=.*[!@#$%^&*])/g.test(value))
      this.specialCharCheckRef.color = 'primary';
    else this.specialCharCheckRef.color = 'warn';

    if(/(?=.*[0-9])/g.test(value))
      this.numberCheckRef.color = 'primary';
    else this.numberCheckRef.color = 'warn';
  }
}
