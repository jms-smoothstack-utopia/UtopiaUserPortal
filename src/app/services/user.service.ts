import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = "http://localhost:8080/customers";
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

  constructor(private http: HttpClient) { }

    // GET all users
    getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.usersUrl).pipe(
        tap(_ => console.log("successfully got all users")),
        catchError(this.handleError<User[]>('getUsers', []))
        );
    }

    // GET a user by ID
    getUser(id: String): Observable<User | HttpErrorResponse> {
      const url=`${this.usersUrl}/${id}`;   
      return this.http.get<User>(url).pipe(
        tap(_ => console.log("successfully got user " + _.id)),
        catchError(this.handleError<HttpErrorResponse>('getUser', ))
      );
    }

    //PUT update a user
    updateUser(updatedUser: User): Observable<any> {
      const url=`${this.usersUrl}/${updatedUser.id}`;
      return this.http.put<User>(url, updatedUser, this.httpOptions).pipe(
        tap(_ => console.log("successfully updated user " + _.id)),
        catchError(this.handleError<HttpErrorResponse>('getUser', ))
      );
    }

    //error handler passes back an HttpErrorResponse, handled in the component/view
     private handleError<T>(operation = 'operation', result?: T) {
      return (err: any): Observable<T> => {
        console.error(`error in ${operation}`);
        return of(err as T);
      };
    }
}
