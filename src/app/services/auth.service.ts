import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { apiUrl } from '../config/config';
import { UserService } from './user.service';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router, 
        private http: HttpClient,
        private userService: UserService,
        private gs: GeneralService
    ) { }

    login(credentials: {email: string, password: string}) {

        return this.http.post<any>(`${apiUrl}login/superadmin`, credentials).pipe(
            tap((response => {
                if(response.token){
                    sessionStorage.setItem('userLogState', 'true')

                    let encryptedToken = this.gs.encrypt(response.token)
                    sessionStorage.setItem('token', encryptedToken)

                    this.userService.setUser(response.user)

                    this.router.navigate(['/main'])
                }
            }))
        )
    }

    logout() {
        return this.http.get<any>(apiUrl + 'logout').pipe(
            tap((response => {
                sessionStorage.clear()
            }))
        )
    }

}