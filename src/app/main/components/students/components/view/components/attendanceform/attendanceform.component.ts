import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../../../services/data.service';
import { UserService } from '../../../../../../../services/user.service';

@Component({
  selector: 'app-attendanceform',
  templateUrl: './attendanceform.component.html',
  styleUrl: './attendanceform.component.scss'
})
export class AttendanceformComponent {
  progress: any = {
    total_hours: 0,
    required_hours: 0,
    remarks: ''
  }

  displayedColumns: string[] = ['date', 'arrival_time', 'departure_time', 'total_hours', 'is_verified'];
  
  unverified_attendance: number = 0

  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private us: UserService,
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    let user = this.us.getStudentProfile()
    this.progress.required_hours = user.required_hours
    this.getAttendance(user.id) 
  }

  getAttendance(id: number) {
    this.ds.get('adviser/monitoring/students/attendance/', id).subscribe(
      response => {
        console.log(response)

        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        
        this.tallyProgress()
      },
      error => {
        console.error(error)
      }
    )

  }
  
  tallyProgress() {
    this.progress.total_hours = 0
    this.unverified_attendance = 0 

    let data = this.dataSource.data

    data.forEach((attendance: any) => {
      if(attendance.is_verified)
        this.progress.total_hours += attendance.total_hours 
      else 
        this.unverified_attendance += 1
    });

    if(this.progress.total_hours >= this.progress.required_hours) 
      this.progress.remarks = ' - Completed'
    
  }
}
