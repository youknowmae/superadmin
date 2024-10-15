import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-accomplishmentreport',
  templateUrl: './accomplishmentreport.component.html',
  styleUrl: './accomplishmentreport.component.scss'
})
export class AccomplishmentreportComponent {
  weekly_attendance: any = []

  constructor(
    private us: UserService,
    private ds: DataService
  ) {
  }

  ngOnInit() {
    var student = this.us.getStudentProfile()

    this.getAccomplishmentReport(student.id)

  }

  getAccomplishmentReport(id: number) {
    this.ds.get('adviser/monitoring/students/attendance/', id).subscribe(
      response => {
        
        this.computeWeeklyAttendance(response)
      },
      error => {
        console.error(error)
      }
    )
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);
    
  computeWeeklyAttendance(data: any) {
    let weeklyAttendance: any = this.groupBy(data, (item: any) => item.week_of_year)

    weeklyAttendance = Object.entries(weeklyAttendance).map(([week, accomplishment_report]: [string, any]) => { 
                                      var accumulated_hours: number = 0

                                      accomplishment_report.forEach((report: any) => {
                                        accumulated_hours += report.total_hours
                                      });

                                      return { week, accomplishment_report, accumulated_hours }
                                    })

    this.weekly_attendance = weeklyAttendance
    console.log(this.weekly_attendance)
  }

}
