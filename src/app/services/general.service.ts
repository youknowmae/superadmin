import Swal, { SweetAlertIcon } from "sweetalert2";
import { Injectable } from "@angular/core";
import { pagination } from "../model/pagination.model";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {
    errorToastAlert(title: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title
          });
    }
    
    successToastAlert(title: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title
          });
    }

    errorAlert(title: string, text: string) {
        Swal.fire({
            title,
            text,
            icon: "error",
            timer: 3000,
            showConfirmButton: false
            // confirmButtonText: 'Close',
            // confirmButtonColor: "#777777",
            // scrollbarPadding: false,
          });
    }

    successAlert(title: string, text: string) {
        Swal.fire({
            title,
            text,
            icon: "success",
            timer: 3000,
            showConfirmButton: false
            // confirmButtonText: 'Close',
            // confirmButtonColor: "#777777",
            // scrollbarPadding: false,
          });
    }

    infoAlert(title: string, text: string) {
      Swal.fire({
          title,
          text,
          icon: "info",
          // timer: 4000,
          showConfirmButton: true,
          confirmButtonText: 'Close',
          confirmButtonColor: "#3fc3ee",
          scrollbarPadding: false,
        });
    }

    getPaginationDetails(materials: any, currentPage: number, perPage: number = 24) {
      var pagination: pagination = <pagination>{}
  
      pagination.current_page = currentPage
  
      pagination.total = materials.length
      pagination.from = (currentPage - 1) * perPage;
      pagination.to = ((pagination.from + perPage) > pagination.total) ? pagination.total : pagination.from + perPage;
      pagination.last_page = Math.ceil(pagination.total / perPage)
  
      pagination.per_page = perPage
  
      return pagination
    }

    createConfirmationAlert(title: string, text: string, icon: SweetAlertIcon) {
      let swalInstance = Swal.mixin({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: "#AB0E0E",
        cancelButtonColor: "#777777",
      })
      return swalInstance
    }    

    
    private secretKey = 'kjSj48U6G0H0BwC'; 
    
    encrypt(data: any): string {
      try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
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
