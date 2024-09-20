import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface User {
    name: string, 
    program: string, 
    picture: string
} 

@Injectable({
  providedIn: 'root'
})

export class UserService {
    industryPartner: string = 'industryPartner'

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) {}
    setUser(user: User) {
        sessionStorage.setItem('user', JSON.stringify(user))
    }

    getUser() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let user = sessionStorage.getItem('user')

        if(!user) {
            return null
        }

        return JSON.parse(user)
    }

    setIndustryPartner(industryPartner: any) {
        sessionStorage.setItem(this.industryPartner, JSON.stringify(industryPartner))
    }

    getIndustryPartner() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let industryPartner = sessionStorage.getItem(this.industryPartner)

        if(!industryPartner) {
            return null
        }

        return JSON.parse(industryPartner)

    }
}
