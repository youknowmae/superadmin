import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: any 

  accountDetails: FormGroup

  showPassword: boolean = false

  constructor(
    private us: UserService,
    private ds: DataService, 
    private gs: GeneralService,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.accountDetails = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    })
    
  }

  ngOnInit() {
    this.getAddRequest()
  }

  getAddRequest() {
    let request = this.us.getIndustryPartnerAddRequest()

    if(!request) {
      this.router.navigate(['main/newpartners/list'])
      return
    }

    this.industryPartner = request

    this.accountDetails.patchValue({
      email: this.industryPartner.email
    })
  }

  approveConfirmation() {
    Swal.fire({
      title: "Approve?",
      text: "Are you sure you want to Approve this company?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.approvePartner()
      }
    });
  }

  approvePartner() {
    this.ds.post('superadmin/request/industryPartners/', this.industryPartner.id, this.accountDetails.value).subscribe(
      response => {
        console.log(response)
        this.gs.successAlert(response.title, response.message)
        this.router.navigate(['main/newpartners/list'])
      },
      error => {
        if(error.status == 422) {
          this.gs.errorAlert('Invalid Input!', 'Please check your input')
        }
        else {
          this.gs.errorAlert('Oops', 'Something went wrong. Please try again later.')
        }
        console.log(error)
      }
    )
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
