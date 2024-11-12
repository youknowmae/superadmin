import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { EditIndustryPartnerComponent } from '../edit-industry-partner/edit-industry-partner.component';
import { AddIndustryPartnerComponent } from '../add-industry-partner/add-industry-partner.component';
import { MatDialog } from '@angular/material/dialog';
import { pagination } from '../../../../../model/pagination.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-industry-partners',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  filteredIndustryPartners: IndustryPartner[] = []
  industryPartners: IndustryPartner[] = []
  isLoading: boolean = true
  isGettingPartner: boolean = false

  searchValue: string = ''

  pagination: pagination = <pagination>{};


  constructor(
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
    private dialogRef: MatDialog
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
    this.getIndustryPartners()
  }

  getIndustryPartners() {
    this.ds.get('superadmin/industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners
        console.log(industryPartners)

        this.filterIndustryPartners()
        this.isLoading = false
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }

  getIndustryPartner(id: number) {
    if(this.isGettingPartner) {
      return
    }

    this.isGettingPartner = true
    
    this.ds.get('superadmin/industryPartners/', id).subscribe(
      industryPartner => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        this.us.setIndustryPartner(industryPartner)
        console.log(industryPartner)
        this.router.navigate(['main/industrypartners/view/' + id])
        this.isGettingPartner = false
      },
      error => {
        console.error(error)
        if(error.status === 404) {
          this.gs.errorAlert('Error!', 'Industry Partner not found.')
          this.isGettingPartner = false
        }
      }
    )
  }

  addIndustryPartner() {
    var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
      disableClose: true       
    })

    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      
      this.industryPartners.unshift(result)
    });
  }

  isFetching: boolean = false
  editIndustryPartner(id: number) {
    if(this.isFetching === true) {
      return
    }

    this.isFetching = true

    this.ds.get('superadmin/industryPartners/', id).subscribe(
      (industryPartner: IndustryPartner) => {
        var modal = this.dialogRef.open(EditIndustryPartnerComponent, {
          data: industryPartner,
          disableClose: true
        })
        
        modal.afterClosed().subscribe((result: any) => {
          console.log(result)

          if (!result) {
            return
          }
          
          this.filteredIndustryPartners = this.industryPartners.map((data: any) =>
            data.id === result.id ? result : data
          );
        });
      },
      error => {
        console.error(error);
        this.isFetching = false
      },
      () => {
        this.isFetching = false
      }
    )
  }

  deleteIndustryPartner(id: number) {
    this.ds.delete('superadmin/industryPartners/', id).subscribe(
      result => {
        console.log(result)
        this.industryPartners = this.industryPartners.filter((announcement: any) => announcement.id !== id);
        this.filteredIndustryPartners = this.filteredIndustryPartners.filter((announcement: any) => announcement.id !== id);
        this.gs.successToastAlert('Successfully removed')
      },
      error => {
        console.error(error)
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      })
  }

  deleteConfirmation(id: number) {
    Swal.fire({
      title: 'Remove?',
      text: 'Are you sure you want to remove this industry partner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteIndustryPartner(id);
      }
    });
  }

  search(value: string) {
    value = value.toLowerCase()
    this.searchValue = value
    this.pagination.current_page = 1

    this.filterIndustryPartners()
    // this.filteredIndustryPartners = this.industryPartners.filter(
    //   (item: IndustryPartner) => {
    //     return item.company_name.toLowerCase().includes(value) ||
    //       item.municipality.toLowerCase().includes(value)
    //   }
    // )
  }

  filterIndustryPartners() {
    let search = this.searchValue.toLowerCase()

    var data = this.industryPartners
    if(search) {
      data = data.filter(
        (item: IndustryPartner) => {
          return item.company_name.toLowerCase().includes(search) ||
            item.municipality.toLowerCase().includes(search) 
        }
      )
    }

    this.pagination = this.gs.getPaginationDetails(data, this.pagination.current_page, this.pagination.per_page)

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++
    

    this.filteredIndustryPartners = data
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page
    if(destination_page < 1 || destination_page > this.pagination.last_page) {
      return
    }
    
    this.pagination.current_page += page
    this.filterIndustryPartners()
  }

  jumpPage(page: number){
    this.pagination.current_page = page
    this.filterIndustryPartners()
  }
}
