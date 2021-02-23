import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ObjectUnsubscribedError, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';

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
    getUser(id: number): Observable<User | HttpErrorResponse> {
      const url=`${this.usersUrl}/${id}`;
      return this.http.get<User>(url).pipe(
        tap(_ => console.log("successfully got user " + _.id)),
        catchError(this.handleError<HttpErrorResponse>('getUser', ))
      );
    }


    //error handler that returns an Observable with a default value passed in
    //TODO: consider adding any Utopia-specific functionality to this (now it's mostly as in the tutorial)
     private handleError<T>(operation = 'operation', result?: T) {
      return (err: any): Observable<T> => {
        console.error(`error in ${operation}, this object was returned:`);
        console.error(err);
        if (err.status == 404) {
          //do 404 handling
          return of(err as T);
        }
        return of(result as T);
      };
    }
}
