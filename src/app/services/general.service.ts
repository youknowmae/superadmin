import Swal from "sweetalert2";
import { Injectable } from "@angular/core";

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

    
}
