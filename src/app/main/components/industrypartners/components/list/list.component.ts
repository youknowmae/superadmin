import { Component, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-list-industry-partners',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    console.log(this.sort)
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['company', 'location', 'noOfApplicants', 'acceptedStudents', 'completed', 'actions'];

  filteredIndustryPartners: IndustryPartner[] = []
  industryPartners: IndustryPartner[] = []
  isLoading: boolean = true
  isGettingPartner: boolean = false
  isSubmitting: boolean = false
  isGridView: boolean = true;

  searchValue: string = ''

  pagination: pagination = <pagination>{};

    // Initialize MatTableDataSource
    dataSource = new MatTableDataSource(this.filteredIndustryPartners);


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
      per_page: 12,
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
    this.us.setIndustryPartner(id)
    this.router.navigate(['main/industrypartners/view'])
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
      this.filterIndustryPartners()
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
          
          this.industryPartners = this.industryPartners.map((data: any) =>
            data.id === result.id ? result : data
          );
          this.filterIndustryPartners()
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
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.get(`superadmin/industryPartners/${id}/delete`, ).subscribe(
      result => {
        this.isSubmitting = false
        console.log(result)
        this.industryPartners = this.industryPartners.filter((announcement: any) => announcement.id !== id);
        this.filteredIndustryPartners = this.filteredIndustryPartners.filter((announcement: any) => announcement.id !== id);
        this.gs.successToastAlert('Successfully removed')
      },
      error => {
        this.isSubmitting = false
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

  
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
