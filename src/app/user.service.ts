import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  authenticate(login: string | null | undefined, password: string | null | undefined): Observable<UserModel> {
    const authenticationInfo = {
      login,
      password
    };
    return this.httpClient.post<UserModel>('https://ponyracer.ninja-squad.com/api/users/authentication', authenticationInfo);
  }
}
