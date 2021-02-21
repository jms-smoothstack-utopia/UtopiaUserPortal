import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public bearer = "";
  public expiresAt = 0;

  constructor(private http: HttpClient) {
  }

  authenticate(email: string, password: string) {
    return this.http.post<any>(environment.authEndpoint, {email, password})
    .pipe(tap(res => {
      this.bearer = res.token;
      this.expiresAt = res.expiresAt;
    }));
  }
}
