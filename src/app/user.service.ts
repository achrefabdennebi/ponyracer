import { effect, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = signal<UserModel | null>(null);
  readonly currentUser = this.user.asReadonly();

  constructor(private httpClient: HttpClient) {
    this.retrieveUser();
    effect(() => {
      if (this.user()) {
        window.localStorage.setItem('rememberMe', JSON.stringify(this.user()));
      } else {
        window.localStorage.removeItem('rememberMe');
      }
    });
  }

  authenticate(login: string | null | undefined, password: string | null | undefined): Observable<UserModel> {
    const authenticationInfo = {
      login,
      password
    };
    return this.httpClient
      .post<UserModel>(`${environment.baseUrl}/api/users/authentication`, authenticationInfo)
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
    return this.httpClient.post<UserModel>(`${environment.baseUrl}/api/users`, registerInfo);
  }

  storeLoggedInUser(user: UserModel) {
    this.user.set(user);
  }

  retrieveUser() {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.user.set(user);
    }
  }

  logout() {
    this.user.set(null);
  }
}
