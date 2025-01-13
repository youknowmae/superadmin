import { Component } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { pagination } from '../../../../../model/pagination.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  unfilteredIndustryPartners: any = []
  industryPartners: any = []
  isLoading: boolean = true
  
  statusFilter: any = 2
  searchFilter: string = ''

  pagination: pagination = <pagination>{};

  constructor(
    private ds: DataService, 
    private us: UserService, 
    private gs: GeneralService,
    private router: Router
  ) {
    this.pagination = {
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      per_page: 15,
      last_page: 0,
    }
  }

  ngOnInit() {
    this.getIndustryPartnerRequest()
  }

  getIndustryPartnerRequest() {
    this.ds.get('superadmin/request/industryPartners').subscribe(
      response => {
        console.log(response)
        let partners = response.filter(
          (data: any) => data.status == 2 || data.status == 3 || data.status == 4
        )
        
        this.unfilteredIndustryPartners = partners.map((element: any) => {
          if(element.status == 2) {
            element.status_text = 'For Approval'
          }
          else if(element.status == 3) {
            element.status_text = 'Not Approved'
          } 
          else if(element.status == 4) {
            element.status_text = 'Approved'
          }

          return element
          
        });

        this.applyFilter()
        this.isLoading = false
      },
      error => {
        this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        console.error(error)
        this.isLoading = false
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

  search(search: string) {
    this.searchFilter = search.trim().toLowerCase()
    this.applyFilter()
  }

  applyFilter() {
    let search = this.searchFilter.toLowerCase()

    console.log('filtering')

    let data = this.unfilteredIndustryPartners

    if(this.statusFilter) {
      data = data.filter(
        (data: any) => data.status == this.statusFilter
      )
    }

    if(this.searchFilter) {
      data = data.filter((element: any) => {
        return element.company_name.toLowerCase().includes(search) ||
          element.municipality.toLowerCase().includes(search)
      })
    }

    this.pagination = this.gs.getPaginationDetails(data, this.pagination.current_page, this.pagination.per_page)

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++

    this.industryPartners = data
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page
    if(destination_page < 1 || destination_page > this.pagination.last_page) {
      return
    }
    
    this.pagination.current_page += page
    this.applyFilter()
  }

  jumpPage(page: number){
    this.pagination.current_page = page
    this.applyFilter()
  }
}
