import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private httpClient: HttpClient) {}

  authenticate(login: string | null | undefined, password: string | null | undefined): Observable<UserModel> {
    const authenticationInfo = {
      login,
      password
    };
    return this.httpClient
      .post<UserModel>('https://ponyracer.ninja-squad.com/api/users/authentication', authenticationInfo)
      .pipe(tap((user: UserModel) => this.userEvents.next(user)));
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
}
