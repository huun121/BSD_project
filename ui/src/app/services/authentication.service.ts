import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { backendUrl } from '../constants';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http
      .post<any>(backendUrl.authService.authenticate, {
        username: username,
        password: password,
      })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        })
      );
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') as any);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  changePassword(id: string, oldPassword: string, newPassword: string) {
    return this.http.put(backendUrl.authService.changePassword + id, { oldPassword: oldPassword, newPassword: newPassword }) as any;
  }

  deleteUser(id: string) {
    return this.http.delete(backendUrl.authService.delete + id) as any;
  }
}