import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  ojtDurationFormDetails: FormGroup

  constructor(
    private ds: DataService,
    private us: UserService,
    private fb: FormBuilder,
    private gs: GeneralService
  ) {
    this.ojtDurationFormDetails = this.fb.group({
      ITP131: [null,[Validators.required, Validators.pattern("^[0-9]*$"),]],
      ITP422: [null, [Validators.required, Validators.pattern("^[0-9]*$"),]]
    })
  }

  ngOnInit() {
    this.getOjtHours()
  }

  getOjtHours() {
    this.ds.get('superadmin/settings/required-ojt-hours').subscribe(
      response => {
        console.log(response)
        response.forEach((element: any) => {
          this.ojtDurationFormDetails.patchValue({
            [element.course_code]: element.required_hours
          })
        });
      },
      error => {
        console.error(error)
      }
    )
  }

  savePracticumHours() {
    Swal.fire({
      title: "Save?",
      text: "Your changes will be saved.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.ojtDurationFormDetails.value)
        this.ds.post('superadmin/settings/required-ojt-hours', '', this.ojtDurationFormDetails.value).subscribe(
          response => {
            this.gs.successToastAlert(response.message)
          },
          error => {
            if(error.status === 422) {
              this.gs.errorAlert('Invalid Input!', 'Please check the input.')

            }
            else {
              this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later')

            }
            console.error(error)
          }
        )
      }
    });
  }
}
