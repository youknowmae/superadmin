import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addskills',
  templateUrl: './addskills.component.html',
  styleUrl: './addskills.component.scss'
})
export class AddskillsComponent {
  formDetails: FormGroup = this.fb.group({
    skills: this.fb.array([
      this.fb.group({
        // id: [null],
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
      this.fb.group({
        // id: [null],
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
      this.fb.group({
        // id: [null],
        strong_skill: [null, [Validators.required, Validators.maxLength(32)]],
        weak_skill: [null, [Validators.required, Validators.maxLength(32)]]
      }),
    ]),
  })


  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<AddskillsComponent>,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    // if(this.data.length > 0) {
      // const skillsArray = this.formDetails.get('skills') as FormArray;
  
      // Clear existing form array if needed
      // skillsArray.clear();
  
      // Add each skill item to the form array
      // this.data.forEach((skill: any) => {
      //   skillsArray.push(this.fb.group({
      //     id: [skill.id],
      //     strong_skill: [skill.strong_skill, [Validators.required, Validators.maxLength(32)]],
      //     weak_skill: [skill.weak_skill, [Validators.required, Validators.maxLength(32)]]
      //   }));
      // });

    // }
  }

  closepopup() {
    Swal.fire({
      title: "Cancel?",
      text: "Are you sure you want to cancel adding skills?",
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
    if(!this.formDetails.valid) {
      return
    }

    console.log(this.formDetails.value)
    Swal.fire({
      title: "Submit?",
      text: "Are you sure you want to add this skills?",
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
  }
}
