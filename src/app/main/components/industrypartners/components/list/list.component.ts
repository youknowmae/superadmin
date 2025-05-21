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
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-list-industry-partners',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = [
    'company',
    'location',
    'noOfApplicants',
    'acceptedStudents',
    'completed',
    'actions',
  ];

  filteredIndustryPartners: IndustryPartner[] = [];
  industryPartners: IndustryPartner[] = [];
  isLoading: boolean = true;
  isFetching: boolean = false;
  isSubmitting: boolean = false;
  isGridView: boolean = true;

  // Track active filter state
  activeFilter: 'active' | 'inactive' = 'active';

  searchValue: string = '';

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
    };
  }

  ngOnInit() {
    this.getIndustryPartners();
  }

  getIndustryPartners() {
    this.ds.get('superadmin/industryPartners').subscribe(
      (industryPartners) => {
        // Add status property to each partner
        this.industryPartners = industryPartners.map((partner: any) => ({
          ...partner,
          status: partner.status || 'active'
        }));
        console.log(industryPartners);

        this.filterIndustryPartners();
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  getIndustryPartner(id: number) {
    this.us.setIndustryPartner(id);
    this.router.navigate(['main/industrypartners/view']);
  }

  addIndustryPartner() {
    var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
      disableClose: true,
    });

    modal.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result) {
        return;
      }

      // Set status for new partners as active by default
      result.status = 'active';
      this.industryPartners.unshift(result);
      this.filterIndustryPartners();
    });
  }

  editIndustryPartner(id: number) {
    if (this.isFetching === true) {
      return;
    }

    this.isFetching = true;

    this.ds.get('superadmin/industryPartners/', id).subscribe(
      (industryPartner: IndustryPartner) => {
        var modal = this.dialogRef.open(EditIndustryPartnerComponent, {
          data: industryPartner,
          disableClose: true,
        });

        modal.afterClosed().subscribe((result: any) => {
          console.log(result);

          if (!result) {
            return;
          }

          this.industryPartners = this.industryPartners.map((data: any) =>
            data.id === result.id ? { ...result, status: data.status } : data
          );
          this.filterIndustryPartners();
        });
      },
      (error) => {
        console.error(error);
        this.isFetching = false;
      },
      () => {
        this.isFetching = false;
      }
    );
  }

  async archive(id: number) {
    const res = await this.gs.confirmationAlert(
      'Archive?',
      'Are you sure you want to archive this industry partner?',
      'warning',
      'Archive'
    );

    if (!res) return;

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.ds.get(`superadmin/industryPartners/${id}/delete`).subscribe(
      (result) => {
        this.isSubmitting = false;
        console.log(result);

        // Instead of removing, update the status to inactive
        this.industryPartners = this.industryPartners.map((item: any) =>
          item.id === id ? { ...item, status: 'inactive' } : item
        );

        // Filter the list again to respect current active filter
        this.filterIndustryPartners();

        this.gs.makeToast('Successfully archived', 'success');
      },
      (error) => {
        this.isSubmitting = false;
        console.error(error);
        this.gs.makeAlert('Error!', 'Something went wrong. Please try again later.', 'error')
      }
    );
  }

  async unarchive(id: number) {
    const res = await this.gs.confirmationAlert(
      'Unarchive?',
      'Are you sure you want to unarchive this industry partner?',
      'warning',
      'Unarchive'
    );

    if (!res) return;

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // We can reuse the same endpoint or create a new one if needed
    this.ds.get(`superadmin/industryPartners/${id}/restore`).subscribe(
      (result) => {
        this.isSubmitting = false;
        console.log(result);

        // Update the status to active
        this.industryPartners = this.industryPartners.map((item: any) =>
          item.id === id ? { ...item, status: 'active' } : item
        );

        // Filter the list again to respect current active filter
        this.filterIndustryPartners();

        this.gs.makeToast('Successfully unarchived', 'success');
      },
      (error) => {
        this.isSubmitting = false;
        console.error(error);
        this.gs.makeAlert('Error!', 'Something went wrong. Please try again later.', 'error')
      }
    );
  }

  // Set active filter
  setFilter(filter: 'active' | 'inactive') {
    this.activeFilter = filter;
    this.pagination.current_page = 1;
    this.filterIndustryPartners();
  }

  search(value: string) {
    value = value.toLowerCase();
    this.searchValue = value;
    this.pagination.current_page = 1;

    this.filterIndustryPartners();
  }

  filterIndustryPartners() {
    let search = this.searchValue.toLowerCase();

    var data = this.industryPartners;

    // Filter by active status
    data = data.filter((item: any) => item.status === this.activeFilter);

    if (search) {
      data = data.filter((item: IndustryPartner) => {
        return (
          item.company_name.toLowerCase().includes(search) ||
          item.municipality.toLowerCase().includes(search)
        );
      });
    }

    this.pagination = this.gs.getPaginationDetails(
      data,
      this.pagination.current_page,
      this.pagination.per_page
    );

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++;

    this.filteredIndustryPartners = data;
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page;
    if (destination_page < 1 || destination_page > this.pagination.last_page) {
      return;
    }

    this.pagination.current_page += page;
    this.filterIndustryPartners();
  }

  jumpPage(page: number) {
    this.pagination.current_page = page;
    this.filterIndustryPartners();
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
