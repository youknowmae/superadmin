import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addaccomplishment',
  templateUrl: './addaccomplishment.component.html',
  styleUrl: './addaccomplishment.component.scss'
})
export class AddaccomplishmentComponent {
  file: any = null

  formDetails: FormGroup = this.fb.group({
    company_name: [null, [Validators.required, Validators.maxLength(64)]],
    description: [null, [Validators.required, Validators.maxLength(1024)]],

    company_head: [null, [Validators.required, Validators.maxLength(128)]],
    head_position: [null, [Validators.required, Validators.maxLength(64)]],
    immediate_supervisor: [null, [Validators.required, Validators.maxLength(128)]],
    supervisor_position: [null, [Validators.required, Validators.maxLength(64)]],

    region: ["III", [Validators.required, Validators.maxLength(32)]],
    province: ["Zambales", [Validators.required, Validators.maxLength(32)]],
    municipality: [null, [Validators.required, Validators.maxLength(32)]],
    barangay: [null, [Validators.required, Validators.maxLength(32)]],
    street: [null, [Validators.required, Validators.maxLength(32)]],
    zip_code: [null, [Validators.required, Validators.pattern('[0-9]{4}')]],

    telephone_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
    mobile_number: [null, [Validators.required, Validators.pattern('(09)[0-9]{9}')]],
    fax_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
    email: [null, [Validators.required, Validators.email]],
    website: [null, [Validators.maxLength(128)]],
  })


  constructor(
    private ref: MatDialogRef<AddaccomplishmentComponent>,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    const today = new Date();
    this.formDetails.patchValue({
      date: today.toISOString().split('T')[0]
    })
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel adding industry partner??",
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
      title: "Create?",
      text: "Are you sure you want to add this industry partner?",
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

    Object.entries(this.formDetails.value as { [key: string]: string | null})
          .forEach(([key, value]) =>{
            if(value)
              payload.append(key, value)
            console.log(value)
          })

    if(this.file)
      payload.append('image', this.file);

    this.dataService.post('industryPartners', '', payload).subscribe(
      result => {
        Swal.fire({
          title: "Success!",
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
