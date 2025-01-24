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

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
          map ((event: HttpEvent<any>) => { 
            if (event instanceof HttpResponse && event.body.data) {
              let encryptedData = event.body.data
              const decodedData = JSON.parse(CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Utf8));

              const key = appSettings.note
              const iv = CryptoJS.enc.Base64.parse(decodedData.iv)
              const salt = CryptoJS.enc.Base64.parse(decodedData.salt)
              const iterations = CryptoJS.enc.Base64.parse(decodedData.iterations).toString(CryptoJS.enc.Utf8)
              const ciphertext = decodedData.encryptedValue

              const hashKey = CryptoJS.PBKDF2(key, salt, {
                  hasher: CryptoJS.algo.SHA256,
                  keySize: 8,
                  iterations: parseInt(iterations),
              });

              const bytes = CryptoJS.AES.decrypt(ciphertext, hashKey, {
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7,
              });

              let data = bytes.toString(CryptoJS.enc.Utf8);
              data = JSON.parse(data)

              const response = event.clone({
                body: data
              })
              return response
            }

            return event
          })
        );
    }
  }
