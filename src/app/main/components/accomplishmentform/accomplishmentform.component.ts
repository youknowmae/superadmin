import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddaccomplishmentComponent } from './components/addaccomplishment/addaccomplishment.component';
import { AddattendanceComponent } from './components/addattendance/addattendance.component';
import { DataService } from '../../../services/data.service';
import { UserService } from '../../../services/user.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-accomplishmentform',
  templateUrl: './accomplishmentform.component.html',
  styleUrls: ['./accomplishmentform.component.scss']
})
export class AccomplishmentformComponent {
  accomplishmentReports: any

  progress: any = {
    total_hours: 0,
    required_hours: 0,  //static muna
    remarks: ''
  }

  displayedColumns: string[] = ['date', 'arrival_time', 'departure_time', 'total_hours'];

  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private us: UserService,
    private ds: DataService,
    private gs: GeneralService) {
      this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    var student = this.us.getUser()

    this.progress.required_hours = student.required_hours
    this.getAccomplishmentReport(student.id)
    this.getDailyAttendance()
  }

  Openaddaccomplishment() {
    this.dialog.open(AddaccomplishmentComponent, {

    });

  }

  Openaddattendace() {
    var modal =  this.dialog.open(AddattendanceComponent, {

    });

    
    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      this.progress.total_hours = 0
      this.getDailyAttendance()
    });
  }

  getAccomplishmentReport(id: number) {
    this.ds.get('student/accomplishment-report').subscribe(
      response => {
        this.accomplishmentReports = Object.entries(response)
                                        .map(([week, accomplishment_report]: [string, any]) => { 
                                          var accumulated_hours: number = 0

                                          accomplishment_report.forEach((report: any) => {
                                            accumulated_hours += report.total_hours
                                          });

                                          return { week, accomplishment_report, accumulated_hours }
                                        })
        console.log(this.accomplishmentReports)
      },
      error => {
        console.error(error)
      }
    )
  }

  getDailyAttendance() {
    this.ds.get('student/attendance').subscribe(
      response => {
        console.log(response)

        response.forEach((attendance: any) => {
          this.progress.total_hours += attendance.total_hours 
        });

        if(this.progress.total_hours >= this.progress.required_hours) {
          this.progress.remarks = ' - Completed'
        }

        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )

  }

  isSubmittingEvaluation: boolean = false
  submitEvaluation() {
    if(this.isSubmittingEvaluation) {
      return
    }

    this.isSubmittingEvaluation = true

    console.log('test')
    this.ds.get('evaluation/comply').subscribe(
      response => {
        this.gs.successAlert('Submitted', response.message)
        this.isSubmittingEvaluation = false
      },
      error => {
        console.error(error)
        this.gs.errorAlert(error.error.title, error.error.message)

        this.isSubmittingEvaluation = false
      }
    )
  }

}
