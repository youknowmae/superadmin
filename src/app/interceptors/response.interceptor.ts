import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { appSettings } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private us: UserService
  ) {

  }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
          map ((event: HttpEvent<any>) => { 
            if (event instanceof HttpResponse && event.body.data) {
              try {

                let data = this.us.recover(event.body.data)

                const response = event.clone({
                  body: data
                })
                return response
              }
              catch {
                const response = event.clone()

                return response
              }
            }

            return event
          })
        );
    }
  }
