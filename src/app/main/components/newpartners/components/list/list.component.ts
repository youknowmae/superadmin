import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  unfilteredIndustryPartners: any = []
  industryPartners: any = []

  statusFilter: any = '2'

  constructor(
    private ds: DataService, 
    private us: UserService, 
    private gs: GeneralService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getIndustryPartnerRequest()
  }

  getIndustryPartnerRequest() {
    this.ds.get('superadmin/request/industryPartners').subscribe(
      response => {
        console.log(response)
        this.unfilteredIndustryPartners = response
        this.applyFilter()
      },
      error => {
        this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        console.error(error)
      }
    )
  }

  viewRequestDetails(id: number) {
    this.ds.get('superadmin/request/industryPartners/', id).subscribe(
      response => {
        console.log(response)

        let industryPartner = response

        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;
        
        this.us.setIndustryPartnerAddRequest(response)
        this.router.navigate(['main/newpartners/view'])
      },
      error => {
        if(error.status === 404) {
          this.gs.errorAlert('Not Found!', 'The item your looking for is not existing.')
        }
        else {
          this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        }

        console.error(error)
      }
    )
  }

  onStatusFilterChange(event: MatSelectChange) {
    this.statusFilter = event.value
    this.applyFilter()
  }

  applyFilter() {
    console.log('filtering')

    this.industryPartners = this.unfilteredIndustryPartners.filter(
      (data: any) => data.status == this.statusFilter
    )
  }
}
