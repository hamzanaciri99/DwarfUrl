import { Injectable } from "@angular/core";
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";


const BASE_URL = 'http://localhost:8001'
const USER_KEY: string = 'current_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUserSubject: BehaviorSubject<User | null>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(USER_KEY) || 'null'));
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  signup(user: User) {
    return this.http.post<User>(`${BASE_URL}/user/signup`, user);
  }

  login(user: User) {
    return this.http.post<User>(`${BASE_URL}/user/login`, user);
  }

  registerUser(user: User) {
    this.currentUserSubject.next(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearUser() {
    this.currentUserSubject.next(null);
    localStorage.removeItem(USER_KEY);
  }

  logout() {
    return this.http.get(`${BASE_URL}/user/logout`);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  updateUser(user: User) {
    return this.http.patch<User>(`${BASE_URL}/user/update`, user);
  }
}
