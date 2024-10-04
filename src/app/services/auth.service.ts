import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { apiUrl } from '../config/config';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router, 
        private http: HttpClient,
        private userService: UserService
    ) { }

    login(credentials: {email: string, password: string}) {

        return this.http.post<any>(`${apiUrl}login/superadmin`, credentials).pipe(
            tap((response => {
                if(response.token){
                    sessionStorage.setItem('userLogState', 'true')
                    sessionStorage.setItem('token', response.token)

                    // let course = response.user.student_courses[0].course_code

                    // let required_hours = 0
                    // if(course === 'ITP132') {
                    //     required_hours = 500
                    // }
                    // else if (course === 'ITP131') {
                    //     required_hours = 200
                    // }

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