import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: any
  student: any
  
  isLoading: boolean = true

  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level', 'status'];

  constructor(
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
    private ds: DataService
  ) {
  }

  ngOnInit() {
    this.getIndustryPartner()
    this.student = this.us.getUser()
  }
  
  getIndustryPartner() {
    let id = this.us.getIndustryPartner()

    if(!id) {
      this.router.navigate(['main/industrypartners/list'])
    }

    
    this.ds.get('superadmin/industryPartners/', id).subscribe(
      industryPartner => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        let full_address = `${industryPartner?.street || ''} ${industryPartner?.barangay || ''}, ${industryPartner?.municipality || ''}`
        industryPartner.full_address = full_address
        
        console.log(industryPartner)

        this.industryPartner = industryPartner

        this.isLoading = false
      },
      error => {
        this.isLoading = false
        console.error(error)
        if(error.status === 404) {
          this.router.navigate(['main/industrypartners/list'])
          this.gs.errorAlert('Not Found!', 'Industry Partner not found.')
        }
        else {
          this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        }
      }
    )      
  }

  navigateToApplication(id: number) {
    if(!this.student.personality_test){
      this.gs.infoAlert('Personality test is required!', 'Please do the personality test first to proceed.')
      this.router.navigate(['/main/profile'])

      return
    }
    this.router.navigate(['/main/industrypartners/apply/' + id])
  }



}
