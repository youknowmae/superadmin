import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent {
  industryPartner: any
  files: any = []

  constructor(
    private ds: DataService,
    private us: UserService,
    private router: Router,
    private gs: GeneralService
  ) {
  }

  ngOnInit() {
    this.getIndustryPartner()
  }

  getIndustryPartner() {
    this.industryPartner = this.us.getIndustryPartner()
  }

  uploadMultiple(event: any) {
    const files: FileList = event.target.files;


    for (let index = 0; index < files.length; index++) {
      this.files.push(files[index])
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1)
  }

  apply() {

    console.log('test')
    const formdata = new FormData();
    
    for (let [index, file] of this.files.entries()) {
      formdata.append('files[]', file)
      console.log(file)
    }

    this.ds.post('apply/', this.industryPartner.id, formdata).subscribe(
      response => {
        console.log(response)
        this.gs.successAlert('Applied!', 'Application form has been submitted')
        this.router.navigate(['main/applicationstatus/list'])
      }, 
      error => {
        console.error(error)
        if(error.status === 409 && error.error.message == 'Please do the personality test first.') {
          this.gs.errorAlert('Error', error.error.message)
          this.router.navigate(['/main/profile'])
        }
        else if(error.status === 409) {
          this.gs.errorAlert('Error', error.error.message)
        }
      }
    )
  }

  applicationConfirmation() {
    Swal.fire({
      title: "Apply?",
      text: "Are you sure you want to apply in this company?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.apply()
      }
    });
  }
}
