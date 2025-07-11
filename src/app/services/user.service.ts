import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { appSettings } from '../../environments/environment';

interface User {
  name: string;
  program: string;
  picture: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: string = btoa('user');
  token: string = btoa('token');
  industryPartner: string = btoa('industryPartner');
  studentProfile: string = btoa('studentProfile');
  industryPartnerAddRequest: string = btoa('industryPartnerAddRequest');
  academicYears: string = btoa('academicYears');
  selectedAcademicYear: string = btoa('selectedAcademicYears');
  technicalSkills: string = btoa('technicalSkills');

  private genRanHex(size: number): string {
    return Array.from({ length: size }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private setData(label: string, data: any) {
    sessionStorage.setItem(label, this.encrypt(data));
  }

  private extractData(label: string) {
    return this.decrypt(sessionStorage.getItem(label));
  }

  setUserLogState() {
    sessionStorage.setItem('userLogState', 'true');
  }

  setToken(data: User) {
    this.setData(this.token, data);
  }
  getToken() {
    return this.extractData(this.token);
  }

  setUser(data: User) {
    this.setData(this.user, data);
  }
  getUser() {
    return this.extractData(this.user);
  }

  setIndustryPartner(data: any) {
    this.setData(this.industryPartner, data);
  }
  getIndustryPartner() {
    return this.extractData(this.industryPartner);
  }

  setStudentProfile(data: any) {
    this.setData(this.studentProfile, data);
  }
  getStudentProfile() {
    return this.extractData(this.studentProfile);
  }

  setIndustryPartnerAddRequest(data: any) {
    this.setData(this.industryPartnerAddRequest, data);
  }
  getIndustryPartnerAddRequest() {
    return this.extractData(this.industryPartnerAddRequest);
  }

  setAcademicYears(data: any) {
    this.setData(this.academicYears, data);
  }
  getAcademicYears() {
    return this.extractData(this.academicYears);
  }

  setSelectedAcademicYears(data: any) {
    this.setData(this.selectedAcademicYear, data);
  }
  getSelectedAcademicYears() {
    return this.extractData(this.selectedAcademicYear);
  }

  setTechnicalSkillsData(data: any) {
    this.setData(this.technicalSkills, data);
  }
  getTechnicalSkillsData() {
    return this.extractData(this.technicalSkills);
  }

  encrypt(data: any): string {
    const note = appSettings.frontNote;

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), note).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  decrypt(cipherText: string | null): any {
    const note = appSettings.frontNote;

    if (!cipherText) {
      return null;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, note);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return null;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  recover(data: any) {
    const decodedData = JSON.parse(
      CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
    );

    const key = appSettings.note;
    const iv = CryptoJS.enc.Base64.parse(decodedData.iv);
    const salt = CryptoJS.enc.Base64.parse(decodedData.salt);
    const iterations = CryptoJS.enc.Base64.parse(
      decodedData.iterations
    ).toString(CryptoJS.enc.Utf8);
    const cipherText = decodedData.encryptedValue;

    const hashKey = CryptoJS.PBKDF2(key, salt, {
      hasher: CryptoJS.algo.SHA256,
      keySize: 8,
      iterations: parseInt(iterations),
    });

    const bytes = CryptoJS.AES.decrypt(cipherText, hashKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  }
  
  encryptPayload(data: object): string {
    const stringData = JSON.stringify(data);

    const key = CryptoJS.enc.Hex.parse(this.genRanHex(64));
    const iv = CryptoJS.enc.Hex.parse(this.genRanHex(32));

    const encrypted = CryptoJS.AES.encrypt(stringData, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const prefix = this.genRanHex(12);

    const payload =
      prefix +
      iv.toString(CryptoJS.enc.Hex) +
      key.toString(CryptoJS.enc.Hex) +
      encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    return btoa(payload);
  }
}
