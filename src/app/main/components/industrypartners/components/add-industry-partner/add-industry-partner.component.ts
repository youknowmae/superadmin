import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-add-industry-partner',
  templateUrl: './add-industry-partner.component.html',
  styleUrl: './add-industry-partner.component.scss'
})
export class AddIndustryPartnerComponent {
  file: any = null
  
  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  showPassword: boolean = false
  
  formDetails: FormGroup 

  isSubmitting: boolean = false

  
  constructor(
    private ref: MatDialogRef<AddIndustryPartnerComponent>,
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.formDetails = this.fb.group({
      company_name: [null, [Validators.required, Validators.maxLength(64)]],
        description: [null, [Validators.required, Validators.maxLength(2048)]],
    
        // company_head: [null, [Validators.required, Validators.maxLength(128)]],
        company_head: this.fb.group({
          first_name: [null, [Validators.required, Validators.maxLength(64)]],
          middle_name: [null, [Validators.maxLength(64)]],
          last_name: [null, [Validators.required, Validators.maxLength(64)]],
          ext_name: [null], 
          sex: [null, Validators.required],
        }),
        head_position: [null, [Validators.required, Validators.maxLength(64)]],
        
        // immediate_supervisor: [null, [Validators.required, Validators.maxLength(128)]],
        immediate_supervisor: this.fb.group({
          first_name: [null, [Validators.required, Validators.maxLength(64)]],
          middle_name: [null, [Validators.maxLength(64)]],
          last_name: [null, [Validators.required, Validators.maxLength(64)]],
          ext_name: [null],
          sex: [null, Validators.required],
        }),
        supervisor_position: [null, [Validators.required, Validators.maxLength(64)]],
    
        region: ["III", [Validators.required, Validators.maxLength(32)]],
        province: [null, [Validators.required, Validators.maxLength(32)]],
        municipality: [null, [Validators.required, Validators.maxLength(32)]],
        barangay: [null, [Validators.maxLength(64)]],
        street: [null, [Validators.maxLength(128)]],
        // zip_code: [null, [Validators.required, Validators.pattern('[0-9]{4}')]],
    
        telephone_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
        mobile_number: [null, [Validators.required, Validators.pattern('^[0-9 ()-]+$')]],
        fax_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
        email: [null, [Validators.required, Validators.email]],
        website: [null, [Validators.maxLength(128)]],

        email_2: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
    })

    const today = new Date();
    this.formDetails.patchValue({
      date: today.toISOString().split('T')[0]
    })

    this.formDetails.get('email')?.valueChanges.subscribe((newValue) => {
      this.formDetails.patchValue({
        email_2: newValue
      })
    });
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

    if(!this.file) {
      this.gs.errorAlert('Invalid Input!', 'Image is required')
      return
    }
    
    Object.entries(this.formDetails.value).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue) {
            payload.append(`${key}[${subKey}]`, subValue);
          }
        });
      } else if (value) {
        payload.append(key, String(value));
      }
      else {
        payload.append(key, '');
      }
    });

    if(this.file)
      payload.append('image', this.file);

    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true
    
    this.ds.post('superadmin/industryPartners', '', payload).subscribe(
      result => {
        this.isSubmitting = false
        Swal.fire({
          title: "Success!",
          text: result.message,
          icon: "success",
        });
        this.ref.close(result.data);
        
      },
      error => {
        this.isSubmitting = false
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
            title: "Oops!",
            text: "Something went wrong, please try again later.",
            icon: "error",
          });
        }
      }
    )
  }
}
