import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {tap} from "rxjs/operators";

interface AuthResponse {
  token: string,
  expiresAt: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public bearer?: string = undefined
  public expiresAt = 0;

  constructor(private http: HttpClient) {
  }

  //todo store bearer in local storage
  // remove if expired
  authenticate(email: string, password: string) {
    return this.http.post<AuthResponse>(environment.authEndpoint, {email, password})
    .pipe(tap(res => {
      this.bearer = res.token;
      this.expiresAt = res.expiresAt;
    }));
  }

  testAuth() {
    return this.http.get<any>("http://localhost:8080/accounts/test");
  }
}
