import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GeneralService } from './general.service';

interface User {
    name: string, 
    program: string, 
    picture: string
} 

@Injectable({
  providedIn: 'root'
})

export class UserService {
    user: string = btoa('user')
    industryPartner: string = btoa('industryPartner')
    studentProfile: string = btoa('studentProfile')
    industryPartnerAddRequest: string = btoa('industryPartnerAddRequest')

    constructor(
        private gs: GeneralService
    ) {}
    
    setUser(user: User) {
        let encryptedData = this.gs.encrypt(user)
        sessionStorage.setItem(this.user, encryptedData)
    }

    getUser() {
        let user = sessionStorage.getItem(this.user)

        if(!user) {
            return null
        }

        let plainTextData = this.gs.decrypt(user)

        return plainTextData
    }

    setIndustryPartner(industryPartner: any) {
        let encryptedData = this.gs.encrypt(industryPartner)
        sessionStorage.setItem(this.industryPartner, encryptedData)
    }

    getIndustryPartner() {
        let industryPartner = sessionStorage.getItem(this.industryPartner)

        if(!industryPartner) {
            return null
        }

        let plainTextData = this.gs.decrypt(industryPartner)

        return plainTextData
    }

    setStudentProfile(studentProfile: any) {
        let encryptedData = this.gs.encrypt(studentProfile)
        sessionStorage.setItem(this.studentProfile, encryptedData)
    }

    getStudentProfile() {
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(studentProfile)

        return plainTextData
    }

    setIndustryPartnerAddRequest(addRequest: any) {
        let encryptedData = this.gs.encrypt(addRequest)
        sessionStorage.setItem(this.industryPartnerAddRequest, encryptedData)
    }

    getIndustryPartnerAddRequest() {
        let addRequest = sessionStorage.getItem(this.industryPartnerAddRequest)

        if(!addRequest) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(addRequest)

        return plainTextData
    }
}
