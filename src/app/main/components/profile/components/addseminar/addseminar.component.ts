import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-addseminar',
  templateUrl: './addseminar.component.html',
  styleUrl: './addseminar.component.scss'
})
export class AddseminarComponent {
  image: any = null

  formDetails: FormGroup = this.fb.group({
    title: [null, [Validators.required, Validators.maxLength(64)]],
    venue: [null, [Validators.required, Validators.maxLength(64)]],
    date: [null, [Validators.required]],
    total_hours: [null, [Validators.required]],
  })


  constructor(
    private ref: MatDialogRef<AddseminarComponent>,
    private fb: FormBuilder,
    private dataService: DataService,
    private gs: GeneralService
  ) {
  }

  uploadFile(event: any) {
    this.image = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel adding seminar? Your changes will not be saved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close(null);

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
          title: "Changes not saved."
        });
      }
    });
  }

  submit() {
    Swal.fire({
      title: "Upload?",
      text: "Are you sure you want to add this seminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.create()
      }
    });
  }

  create() {
    var payload = new FormData();

    if(!this.image) {
      this.gs.infoAlert('Image Required!', 'Please upload an screenshot of the seminar certificate.')
      return
    }

    payload.append('seminar_title', this.formDetails.value.title)
    payload.append('date', moment.tz(this.formDetails.value.date, 'Asia/Manila').format('YYYY-MM-DD'))
    payload.append('venue', this.formDetails.value.venue)
    payload.append('total_hours', this.formDetails.value.total_hours)

    payload.append('image', this.image);

    this.dataService.post('profile/seminars', '', payload).subscribe(
      result => {
        Swal.fire({
          title: "Uploaded!",
          text: result.message,
          icon: "success",
        });
        this.ref.close(result.data);
      },
      error => {
        console.error(error)
        if (error.status == 422) {
          Swal.fire({
            title: "error!",
            text: "Invalid input.",
            icon: "error",
          });
        }
        else {
          Swal.fire({
            title: "error!",
            text: "Something went wrong, please try again later.",
            icon: "error",
          });
        }
      }
    )
  }
}
