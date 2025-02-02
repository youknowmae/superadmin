import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../../services/user.service';
import { GeneralService } from '../../../../../../../services/general.service';

// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss'
})
export class EvaluationComponent {
  isLoading: boolean = true
  isEmpty: boolean = false

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

  evaluation: any
  formDetails: FormGroup 
  
  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private us: UserService,
    private gs: GeneralService
  ) {
    this.formDetails = this.fb.group({
      knowledge: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      skills: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      attitude: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
      ]),
      suggestions: this.fb.group({
        strong_point: [null, [Validators.required, Validators.maxLength(256)]],
        utilized_effectively: [null, [Validators.required, Validators.maxLength(256)]],
        weak_point: [null, [Validators.required, Validators.maxLength(256)]],
        corrected_by: [null, [Validators.required, Validators.maxLength(256)]],
        other_comment: [null, [Validators.required, Validators.maxLength(256)]],
      }),
      further_employment: this.fb.group({
        response: [null, Validators.required],
        why: [null, [Validators.required, Validators.maxLength(256)]],
        if_not: this.fb.array([
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null), 
          this.fb.control(null),
        ])
      })
    })
  }

  ngOnInit() {
    this.getEvaluation()
  }



  getEvaluation() {
    let user = this.us.getStudentProfile()

    this.ds.get('superadmin/students/evaluation/', user.id).subscribe(
      evaluation => {
        this.isLoading = false
        this.evaluation = evaluation
    
        this.formDetails.patchValue({
          ...evaluation.evaluation
        })

        let further_employment =  this.formDetails.get('further_employment.response')?.value

        const ifNotArray = this.formDetails.get('further_employment.if_not') as FormArray;

        if (further_employment === '1') {
          ifNotArray.disable();  
        }
      },
      error => {
        if(error.status === 404) {
          this.isEmpty = true
        }
        else {
          this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        }
        this.isLoading = false
        console.error(error)
      }
    )
  }
}
