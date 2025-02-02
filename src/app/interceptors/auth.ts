import { Injectable, Inject,  PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { GeneralService } from '../services/general.service';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token: string = btoa('token')

    constructor(
        private us: UserService
    ) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let token = this.us.getToken()
        
        if(!token){
            return next.handle(request);
        }
    
        const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    
        return next.handle(authReq);
    }
  }