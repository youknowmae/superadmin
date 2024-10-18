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
    studentProfile: string = 'studentProfile'
    industryPartnerAddRequest: string = 'industryPartnerAddRequest'

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

    setStudentProfile(studentProfile: any) {
        sessionStorage.setItem(this.studentProfile, JSON.stringify(studentProfile))
    }

    getStudentProfile() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }

        return JSON.parse(studentProfile)
    }

    setIndustryPartnerAddRequest(addRequest: any) {
        sessionStorage.setItem(this.industryPartnerAddRequest, JSON.stringify(addRequest))
    }

    getIndustryPartnerAddRequest() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let addRequest = sessionStorage.getItem(this.industryPartnerAddRequest)

        if(!addRequest) {
            return null
        }

        return JSON.parse(addRequest)
    }
}
