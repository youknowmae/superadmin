import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateHeaderName } from 'http';
import { DataService } from '../../../services/data.service';
import { GeneralService } from '../../../services/general.service';
import { response } from 'express';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-ojtexitpoll',
  templateUrl: './ojtexitpoll.component.html',
  styleUrl: './ojtexitpoll.component.scss'
})
export class OjtexitpollComponent {
  isSubmitting: boolean = false
  exitPollDetails: any = {
    user: '',
    industry_partner: {
      supervisor_position: '',
      immediate_supervisor: '',
      full_address: '',
      company_name: ''
    },
    total_hours_completed: ''
  }

  formDetails: FormGroup = this.fb.group({
    industry_partner: [null, Validators.required],
    assigned_position: [null, [Validators.required, Validators.maxLength(256)]],
    assigned_department: [null, [Validators.required, Validators.maxLength(256)]],
    brief_job_description: [null, [Validators.required, Validators.maxLength(256)]],
    binary_question: this.fb.array([
      this.fb.control(null, Validators.required),
      this.fb.control(null, Validators.required),
      this.fb.control(null, Validators.required),
      this.fb.control(null, Validators.required),
      this.fb.control(null, Validators.required), 
      this.fb.control(null, Validators.required),
      this.fb.control(null, Validators.required)
    ]),
    short_question: this.fb.array([
      this.fb.group({
        training_objective: [null, [Validators.required, Validators.maxLength(32)]],
        achievement_level: [null, Validators.required]
      }),
      this.fb.group({
        training_objective: [null, [Validators.required, Validators.maxLength(32)]],
        achievement_level: [null, Validators.required]
      }),
      this.fb.group({
        training_objective: [null, [Validators.required, Validators.maxLength(32)]],
        achievement_level: [null, Validators.required]
      }),
      this.fb.group({
        training_objective: [null, [Validators.required, Validators.maxLength(32)]],
        achievement_level: [null, Validators.required]
      }),
      this.fb.group({
        training_objective: [null, [Validators.required, Validators.maxLength(32)]],
        achievement_level: [null, Validators.required]
      }),
    ]),
    likert_question: [null, Validators.required],
    long_question: [null, [Validators.required, Validators.maxLength(512)]]
  })

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService
  ) {

  }

  ngOnInit() {
    this.exitPollDetails.user = this.us.getUser()

    this.getExitpollSupportingDetails()

    console.log(this.exitPollDetails)
  }

  getExitpollSupportingDetails() {
    // return
    this.ds.get('student/exit-poll/details').subscribe(
      response => {
        response.industry_partner.full_address = response.industry_partner.street + ' ' + response.industry_partner.barangay + ' ' + response.industry_partner.municipality + ', ' + response.industry_partner.province

        this.exitPollDetails.industry_partner = response.industry_partner
        this.exitPollDetails.total_hours_completed = response.total_hours_completed

        this.formDetails.patchValue({
          industry_partner: response.industry_partner.id
        })
      },
      error => {
        console.error(error)
      }
    )
  }

  submit() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.post('student/exit-poll', '', this.formDetails.value).subscribe(
      response => {
        console.log('response');
        this.gs.successAlert('Submitted!', response.message)
        this.isSubmitting = false
      },
      error => {
        console.error(error)
        if(error.status === 409) {
          this.gs.errorAlert(error.error.title, error.error.message)
        }
        else {
          this.gs.errorAlert('Error!', 'Something went wrong, Please try again later.')
        }
        this.isSubmitting = false
      }
    )
  }

}
