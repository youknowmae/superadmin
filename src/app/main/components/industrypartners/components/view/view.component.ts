import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  industryPartner: any;
  student: any;

  isLoading: boolean = true;

  dataSource: any = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'name',
    'student_number',
    'course',
    'year_level',
    'status',
  ];

  constructor(
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
    private ds: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getIndustryPartner();
    this.student = this.us.getUser();
  }

  getIndustryPartner() {
    let id = this.us.getIndustryPartner();

    if (!id) {
      this.router.navigate(['main/industrypartners/list']);
    }

    this.ds.get('superadmin/industryPartners/', id).subscribe(
      (industryPartner) => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${
          companyHead?.last_name || ''
        } ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${
          supervisor?.last_name || ''
        } ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        let full_address = `${industryPartner?.street || ''} ${
          industryPartner?.barangay || ''
        }, ${industryPartner?.municipality || ''}`;
        industryPartner.full_address = full_address;

        console.log(industryPartner);

        this.industryPartner = industryPartner;

        if (industryPartner.internship_applications) {
          industryPartner.internship_applications =
            industryPartner.internship_applications.map((student: any) => {
              const requiredHours =
                student.user.ojt_class.adviser_class.active_ojt_hours
                  .required_hours;
              const currentProgress =
                student.user?.verified_attendance_total?.current_total_hours ||
                0;

              let status;

              if (currentProgress >= requiredHours) {
                status = 'Completed';
              } else {
                status = 'Ongoing';
              }

              return {
                full_name:
                  student.user.first_name + ' ' + student.user.last_name,
                ...student,
                status,
              };
            });
        }

        this.dataSource.data = this.industryPartner.internship_applications;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error(error);
        if (error.status === 404) {
          this.router.navigate(['main/industrypartners/list']);
          this.gs.makeAlert(
            'Not Found!',
            'Industry Partner not found.',
            'error'
          );
        } else {
          this.gs.makeAlert(
            'Oops!',
            'Something went wrong. Please try again later.',
            'error'
          );
        }
      }
    );
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
