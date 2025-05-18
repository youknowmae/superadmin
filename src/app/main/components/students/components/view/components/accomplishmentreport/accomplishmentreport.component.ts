import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';
import { AcademicYear } from '../../../../../../../model/academicYear.model';

@Component({
  selector: 'app-accomplishmentreport',
  templateUrl: './accomplishmentreport.component.html',
  styleUrl: './accomplishmentreport.component.scss',
})
export class AccomplishmentreportComponent {
  weekly_attendance: any = [];
  isLoading: boolean = true;

  constructor(private us: UserService, private ds: DataService) {}

  ngOnInit() {
    const selectedAcadYear: AcademicYear = this.us.getSelectedAcademicYears();
    var student = this.us.getStudentProfile();

    this.getAccomplishmentReport(student.id, selectedAcadYear);
  }

  getAccomplishmentReport(id: number, acadYear: AcademicYear) {
    this.ds
      .get(
        `superadmin/students/attendance/${id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          this.computeWeeklyAttendance(response);
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  computeWeeklyAttendance(data: any) {
    let weeklyAttendance: any = this.groupBy(
      data,
      (item: any) => new Date(item.date).getFullYear() + ' ' + item.week_of_year
    );

    weeklyAttendance = Object.entries(weeklyAttendance).map(
      ([week, accomplishment_report]: [string, any]) => {
        var accumulated_hours: number = 0;

        accomplishment_report.forEach((report: any) => {
          accumulated_hours += report.total_hours;
        });

        return { week, accomplishment_report, accumulated_hours };
      }
    );

    this.weekly_attendance = weeklyAttendance;
    console.log(this.weekly_attendance);
  }
}
