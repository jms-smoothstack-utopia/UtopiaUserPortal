import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

interface AuthResponse {
  token: string;
  expiresAt: number;
}

interface AuthData {
  token: string;
  expiresAt: Date;
  userEmail: string;
  tokenExpirationTimer: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token?: string;
  public expiresAt?: Date;
  public userEmail?: string;
  private tokenExpirationTimer?: any;

  readonly URL = environment.hostUrl + '/authenticate';

  readonly STORAGE_KEY = 'AUTH_DATA';

  constructor(private http: HttpClient, private log: NGXLogger) {}

  login(email: string, password: string) {
    this.log.debug('Attempt authentication', email);
    return this.http
      .post<AuthResponse>(this.URL, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.handleAuthenticationSuccess(res, email);
        })
      );
  }

  private handleAuthenticationSuccess(res: AuthResponse, userEmail: string) {
    this.log.debug('Authentication response', res);

    this.token = res.token;
    this.expiresAt = new Date(res.expiresAt);
    this.userEmail = !!this.token ? userEmail : undefined;

    this.tokenExpirationTimer = this.setAutoLogout(
      this.expiresAt.getTime() - new Date().getTime()
    );

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        token: this.token,
        expiresAt: this.expiresAt,
        userEmail: this.userEmail,
        tokenExpirationTimer: this.tokenExpirationTimer,
      })
    );
  }

  autoLogin() {
    this.log.debug('Auto login');
    const authData: AuthData = JSON.parse(
      <string>localStorage.getItem(this.STORAGE_KEY)
    );

    if (!authData) {
      this.log.debug('No auth data present.');
      return;
    }

    this.token = authData.token;
    this.expiresAt = new Date(authData.expiresAt);
    this.userEmail = authData.userEmail;

    this.tokenExpirationTimer = this.setAutoLogout(
      authData.tokenExpirationTimer - new Date().getTime()
    );
  }

  logout() {
    this.log.debug('Logout');
    this.token = undefined;
    this.expiresAt = undefined;
    this.userEmail = undefined;
    localStorage.removeItem(this.STORAGE_KEY);
    this.log.debug('Auth data removed.');
  }

  private setAutoLogout(expirationDuration: number) {
    return setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isLoggedIn() {
    return !!this.token;
  }

  readonly CONFIRM_REGISTRATION_URL = environment.hostUrl + '/accounts/confirm';

  confirmRegistration(confirmationTokenId: string) {
    this.log.debug(
      'Confirm account registration, tokenId=' + confirmationTokenId
    );
    const url = this.CONFIRM_REGISTRATION_URL + '/' + confirmationTokenId;
    return this.http.put(url, null);
  }
}
