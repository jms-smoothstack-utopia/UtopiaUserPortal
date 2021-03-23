import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

import { User } from '../user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = environment.hostUrl + '/customers';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private log: NGXLogger) {}

  // GET all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap((_) => this.log.debug('successfully got all users')),
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  // GET a user by ID
  getUser(id: string): Observable<User | HttpErrorResponse> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap((_) => this.log.debug('successfully got user ' + _.id)),
      catchError(this.handleError<HttpErrorResponse>('getUser'))
    );
  }

  //PUT update a user
  updateUser(updatedUser: User) {
    const url = `${this.usersUrl}/${updatedUser.id}`;
    return this.http.put<User>(url, updatedUser, this.httpOptions);
  }

  //error handler passes back an HttpErrorResponse, handled in the component/view
  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      this.log.debug(`error in ${operation}`);
      return of(err as T);
    };
  }
}
