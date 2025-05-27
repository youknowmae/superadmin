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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Pipe, PipeTransform } from '@angular/core';

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

  academicYearFilter: string | null = null;
  filteredIndustryPartners: IndustryPartner[] = [];
  industryPartners: IndustryPartner[] = [];
  isLoading: boolean = true;
  isFetching: boolean = false;
  isSubmitting: boolean = false;
  isGridView: boolean = true;

  isArchiveFilter: boolean = false;

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

  academicYearOptions = [];

  onAcademicYearFilterChange(event: any): void {
    console.log('Selected academic year:', event.value);
    // You can add logic here to filter a table or fetch new data
  }

  export(): void {
    console.log('Exporting data for:', this.academicYearFilter);
    // Add export logic here (e.g., export to CSV/PDF)
  }

  ngOnInit() {
    const academicYears = this.us.getAcademicYears();
    this.academicYearOptions = academicYears;
    const activeAcadYear = academicYears.find(
      (item: any) => item.is_active === 1
    );

    this.academicYearFilter = activeAcadYear;

    this.getIndustryPartners();
  }

  getIndustryPartners() {
    this.ds.get('superadmin/industryPartners').subscribe(
      (industryPartners) => {
        this.industryPartners = industryPartners.map((item: any) => {
          const application_count = item.internship_applications.length;
          let accepted_application_count = 0;
          let completed_count = 0;

          item.internship_applications.forEach((applicant: any) => {
            if (applicant.status == 8) accepted_application_count += 1;
            else return;

            if (applicant.user.student_evaluation) completed_count += 1;
          });

          return {
            ...item,
            application_count,
            accepted_application_count,
            completed_count,
          };
        });
        console.log(this.industryPartners);

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

      result.is_archived = 0;
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

    this.ds.get(`superadmin/industryPartners/${id}/archive`).subscribe(
      (result) => {
        this.isSubmitting = false;
        console.log(result);

        this.industryPartners = this.industryPartners.map((item: any) =>
          item.id === id ? { ...item, is_archived: 1 } : item
        );

        this.filterIndustryPartners();

        this.gs.makeToast('Successfully archived', 'success');
      },
      (error) => {
        this.isSubmitting = false;
        console.error(error);
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

    this.ds.get(`superadmin/industryPartners/${id}/unarchive`).subscribe(
      (result) => {
        this.isSubmitting = false;

        this.industryPartners = this.industryPartners.map((item: any) =>
          item.id === id ? { ...item, is_archived: 0 } : item
        );

        this.filterIndustryPartners();

        this.gs.makeToast('Successfully unarchived', 'success');
      },
      (error) => {
        this.isSubmitting = false;
      }
    );
  }

  // Set active filter
  setFilter(filter: boolean) {
    this.isArchiveFilter = filter;
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
    data = data.filter((item: any) => item.is_archived == this.isArchiveFilter);

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

  isExpired(date: Date | undefined): boolean {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < today;
  }
}
