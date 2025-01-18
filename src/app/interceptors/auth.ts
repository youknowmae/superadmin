import { Injectable, Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { GeneralService } from '../services/general.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private gs: GeneralService
    ) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        //prevent ssr from reading the token
        if (!isPlatformBrowser(this.platformId)) {
            return next.handle(request);
        }

        let token = sessionStorage.getItem('token')
        
        if(!token){
            return next.handle(request);
        }

        token = this.gs.decrypt(token)
    
        const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    
        return next.handle(authReq);
    }
  }