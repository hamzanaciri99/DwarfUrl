import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {UserInfoComponent} from "./user-info/user-info.component";
import {ProfileComponent} from "./profile/profile.component";
import {MainComponent} from "./main/main.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginSignupAuthService} from "./service/login-signup-auth.service";
import {SignupComponent} from "./signup/signup.component";
import {ProfileAuthService} from "./service/profile-auth.service";


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginSignupAuthService] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginSignupAuthService] },
  { path: '',
    component: MainComponent,
    children: [
      { path: 'profile', component: ProfileComponent, canActivate: [ProfileAuthService]},
      { path: 'home', component: DashboardComponent}
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
