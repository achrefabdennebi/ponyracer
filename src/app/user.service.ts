import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private httpClient: HttpClient) {
    this.retrieveUser();
  }

  authenticate(login: string | null | undefined, password: string | null | undefined): Observable<UserModel> {
    const authenticationInfo = {
      login,
      password
    };
    return this.httpClient
      .post<UserModel>('https://ponyracer.ninja-squad.com/api/users/authentication', authenticationInfo)
      .pipe(tap((user: UserModel) => this.storeLoggedInUser(user)));
  }

  register(
    login: string | null | undefined,
    password: string | null | undefined,
    birthYear: number | null | undefined
  ): Observable<UserModel> {
    const registerInfo = {
      login,
      password,
      birthYear
    };
    return this.httpClient.post<UserModel>('https://ponyracer.ninja-squad.com/api/users', registerInfo);
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }
}
