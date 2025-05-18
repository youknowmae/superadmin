import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Injectable } from '@angular/core';
import { pagination } from '../model/pagination.model';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  makeToast(title: string, icon: SweetAlertIcon) {
    Swal.fire({
      icon,
      title,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  }

  makeAlert(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title,
      text,
      icon,
      timer: 3000,
      showConfirmButton: false,
    });
  }
  
  async confirmationAlert(title: string, text: string, icon: SweetAlertIcon, confirmButtonText: string = 'Yes') {
    let alert: Promise<boolean> = Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'No',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      heightAuto: false
    }).then((res: any)=>{
      if(res.value) {
        return true
      }
      return false;
    });

    return alert;
  }

  getPaginationDetails(
    materials: any,
    currentPage: number,
    perPage: number = 24
  ) {
    var pagination: pagination = <pagination>{};

    pagination.current_page = currentPage;

    pagination.total = materials.length;
    pagination.from = (currentPage - 1) * perPage;
    pagination.to =
      pagination.from + perPage > pagination.total
        ? pagination.total
        : pagination.from + perPage;
    pagination.last_page = Math.ceil(pagination.total / perPage);

    pagination.per_page = perPage;

    return pagination;
  }

  private secretKey = 'kjSj48U6G0H0BwC';

  encrypt(data: any): string {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.secretKey
      ).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  decrypt(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return null;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}
