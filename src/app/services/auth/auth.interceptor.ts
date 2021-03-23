import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const bearer = this.authService.token;
    if (bearer) {
      const authedReq = request.clone({
        headers: request.headers.set('Authorization', bearer),
      });
      return next.handle(authedReq);
    }

    return next.handle(request);
  }
}
