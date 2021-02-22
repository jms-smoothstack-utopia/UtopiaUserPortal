import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
      //HttpClient's get() fetches JSON by default, but thanks to TypeScript, we can automatically parse it as a Hero array
      return this.http.get<User[]>(this.usersUrl).pipe(
        tap(_ => console.log("successfully got all users")),
        catchError(this.handleError<User[]>('getUsers', []))
        );
    }

    // GET a user by ID
    getUser(id: number): Observable<User> {
      const url=`${this.usersUrl}/${id}`;
      return this.http.get<User>(url).pipe(
        tap(_ => console.log("successfully got user " + _.id)),
        catchError(this.handleError<User>('getUser', ))
      );
    }


    //error handler that returns an Observable with a default value passed in
    //TODO: consider adding any Utopia-specific functionality to this (now it's mostly as in the tutorial)
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error('error in ' + operation + ', this object was returned:');
        console.error(error);
        return of(result as T);
      };
    }
}
