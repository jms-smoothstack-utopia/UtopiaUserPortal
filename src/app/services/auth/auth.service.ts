import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

interface AuthResponse {
  userId: string;
  token: string;
  expiresAt: number;
}

interface AuthData {
  userId: string;
  token: string;
  expiresAt: Date;
  userEmail: string;
  tokenExpirationTimer: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userId?: string;
  public token?: string;
  public expiresAt?: Date;
  public userEmail?: string;
  private tokenExpirationTimer?: any;

  readonly LOGIN_URL = environment.hostUrl + '/login';
  readonly CONFIRM_REGISTRATION_URL = environment.hostUrl + '/accounts/confirm';
  readonly DELETE_ACCOUNT_URL = environment.hostUrl + '/customers';

  readonly STORAGE_KEY = 'AUTH_DATA';

  constructor(private http: HttpClient, private log: NGXLogger) {}

  login(email: string, password: string) {
    this.log.debug('Attempt authentication', email);
    return this.http
      .post<AuthResponse>(this.LOGIN_URL, {
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
    this.userId = !!this.token ? res.userId : undefined;
    this.userEmail = !!this.token ? userEmail : undefined;

    this.tokenExpirationTimer = this.setAutoLogout(
      this.expiresAt.getTime() - new Date().getTime()
    );

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        userId: this.userId,
        token: this.token,
        expiresAt: this.expiresAt,
        userEmail: this.userEmail,
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

    this.log.debug('Refreshing authentication data.');

    this.userId = authData.userId;
    this.token = authData.token;
    this.expiresAt = new Date(authData.expiresAt);
    this.userEmail = authData.userEmail;

    this.tokenExpirationTimer = this.setAutoLogout(
      this.expiresAt.getTime() - new Date().getTime()
    );
  }

  logout() {
    this.log.debug('Logout');
    this.userId = undefined;
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

  confirmRegistration(confirmationTokenId: string) {
    this.log.debug(
      'Confirm account registration, tokenId=' + confirmationTokenId
    );
    const url = this.CONFIRM_REGISTRATION_URL + '/' + confirmationTokenId;
    return this.http.put(url, null);
  }

  deleteAccount(email: string, password: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: { id: this.userId, email: email, password: password },
    };

    return this.http.delete(this.DELETE_ACCOUNT_URL, options);
  }

  confirmDeletion(confirmationToken: string) {
    const url = this.DELETE_ACCOUNT_URL + '/confirm/' + confirmationToken;
    return this.http.delete(url).pipe(
      tap((res) => {
        this.logout();
      })
    );
  }
}
