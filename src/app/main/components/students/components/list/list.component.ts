import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'mobile', 'course', 'program', 'year_level', 'time_completion', 'status', 'actions'];

  currentFilter: string = 'all'
  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();

  isLoading: boolean = false
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  
  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getStudents()
  }

  getStudents() {
    this.ds.get('monitoring/students').subscribe(
      students => {
        let studentsList = students.map((student: any) => {
          let course = student.student_courses[0].course_code
          let required_hours: number = 0

          if(course === 'ITP132') {
            required_hours = 500
          }
          else if (course === 'ITP131') {
            required_hours = 200
          }

          let hours_left = required_hours

          //if has accomplishment report
          if(student.accomplishment_report.length > 0) {
            student.accomplishment_report = student.accomplishment_report[0]

            hours_left -= parseInt(student.accomplishment_report.current_total_hours)
          }

          let status = (student.internship_applications.length === 0) ? 'Pending' : 'Ongoing'

          if(hours_left <= 0) {
            hours_left = 0
            status = 'Completed'
          }

          return {
            full_name: student.first_name + " " + student.last_name,
            course,
            required_hours,
            hours_left,
            status,
            ...student
          } 
        })
        console.log(studentsList)
        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  applyFilter(value: string) {
    this.currentFilter = value 

    if(value == "all") {
      this.dataSource.data = this.unfilteredStudents
      return
    }

    this.dataSource.data = this.unfilteredStudents.filter((student: any) => {
      var status = student.status.toLowerCase()
      if(value == 'completed') {
        return status.includes('completed') 
      }

      if(value == 'pending') {
        return status.includes('pending') 
      }
      
      if(value == 'ongoing') {
        return status.includes('ongoing') 
      }

      return false
    })    
  }

  viewStudent(id: number) {
    if(this.isLoading) {
      return
    }

    let studentDetails = this.unfilteredStudents.find((student: any) => student.id = id)

    console.log(studentDetails)
    this.ds.get('monitoring/students/', id).subscribe(
      student => {
        this.us.setStudentProfile({ ...student, required_hours: studentDetails.required_hours })
        this.router.navigate(['main/students/view'])
        this.isLoading = false
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }
}
