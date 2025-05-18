import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, tap, catchError } from 'rxjs';

import { GeneralService } from '../services/general.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import e from 'express';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string = btoa('token');

  constructor(
    private us: UserService,
    private gs: GeneralService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let token = this.us.getToken();

    if (!token) {
      return next.handle(request);
    }

    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(authReq).pipe(
      tap((event) => {}),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          this.gs.makeAlert(
            error.error.title || 'Unauthenticated!',
            error.error.message ||
              'You do not the necessary credentials to perform this action.',
            'error'
          );
          return throwError(() => new Error('Unauthenticated'));
        } else if (error.status === 403) {
          this.router.navigate(['/login']);
          this.gs.makeAlert(
            error.error.title || 'Unauthorized!',
            error.error.message || 'You do not have access to this resources.',
            'error'
          );
          return throwError(() => new Error('Unauthenticated'));
        }

        return throwError(() => error);
      })
    );
  }
}
