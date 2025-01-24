import { Injectable, Inject,  PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { GeneralService } from '../services/general.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token: string = btoa('token')

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private gs: GeneralService
    ) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let token = sessionStorage.getItem(this.token)
        
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